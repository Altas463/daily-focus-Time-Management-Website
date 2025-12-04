"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskCard from "@/components/tasks/TaskCard";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import TimeBlockingBoard, {
  buildBlockAssignments,
  findTimeBlockById,
  type TimeBlockDefinition,
} from "@/components/tasks/TimeBlockingBoard";
import type { Task } from "@/types";
import {
  createEmptyTask,
  getTaskUrgency,
  summarizeTasks,
  TaskUrgency,
  isTaskDueSoon,
  isTaskOverdue,
  findNextDueTask,
} from "@/utils/tasks";
import { formatRelativeDate, formatShortDate } from "@/utils/date";

type ColumnKey = "incomplete" | "completed";

type NewTaskState = ReturnType<typeof createEmptyTask>;

const columnConfig: Record<
  ColumnKey,
  { title: string; description: string; badgeColor: string; emptyText: string }
> = {
  incomplete: {
    title: "In Progress",
    description: "Tasks in progress, drag and drop to change status",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    emptyText: "All tasks completed, create new ones to continue!",
  },
  completed: {
    title: "Completed",
    description: "Keep track of what you have accomplished",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    emptyText: "No completed tasks yet. You can drag tasks from the other column.",
  },
};

const quickTemplates = [
  { title: "Daily planning", description: "List of 3 important priorities" },
  { title: "Daily standup", description: "Progress update + blockers" },
  { title: "End of day recap", description: "Reflection + plan for tomorrow" },
] as const;

const toneBadge: Record<TaskUrgency["tone"], string> = {
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  notice: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const MINUTE_IN_MS = 60_000;

const getTodayInputValue = () => {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offsetMinutes * MINUTE_IN_MS);
  return local.toISOString().slice(0, 10);
};

const createDateTimeFromInput = (date: string, hour: number, minute: number) => {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date();
  result.setFullYear(year, month - 1, day);
  result.setHours(hour, minute, 0, 0);
  return result;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskMap, setNewTaskMap] = useState<Record<ColumnKey, NewTaskState>>({
    incomplete: createEmptyTask(),
    completed: createEmptyTask(),
  });
  const [formVisible, setFormVisible] = useState<Record<ColumnKey, boolean>>({
    incomplete: false,
    completed: false,
  });
  const [formErrors, setFormErrors] = useState<Record<ColumnKey, string | null>>({
    incomplete: null,
    completed: null,
  });
  const [submitting, setSubmitting] = useState<Record<ColumnKey, boolean>>({
    incomplete: false,
    completed: false,
  });
  const [filter, setFilter] = useState<"all" | "dueSoon" | "overdue">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeBlockDate, setTimeBlockDate] = useState<string>(() => getTodayInputValue());
  const [timeBlockPending, setTimeBlockPending] = useState<string | null>(null);
  const [timeBlockStatus, setTimeBlockStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    void fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const taskSummary = useMemo(() => summarizeTasks(tasks), [tasks]);
  const timeBlockAssignments = useMemo(
    () => buildBlockAssignments(tasks, timeBlockDate),
    [tasks, timeBlockDate],
  );

  const handleCreateTask = async (column: ColumnKey) => {
     const formState = newTaskMap[column];
     const trimmedTitle = formState.title.trim();
     if (!trimmedTitle) {
       setFormErrors((prev) => ({ ...prev, [column]: "Please enter a task title" }));
       return;
     }

     if (formState.startDate && formState.endDate) {
       const start = new Date(formState.startDate);
       const end = new Date(formState.endDate);
       if (start > end) {
         setFormErrors((prev) => ({
           ...prev,
           [column]: "End time must be greater than start time",
         }));
         return;
       }
     }

    setFormErrors((prev) => ({ ...prev, [column]: null }));
    setSubmitting((prev) => ({ ...prev, [column]: true }));

    const payload: Partial<Task> = {
      title: trimmedTitle,
      description: formState.description.trim() || undefined,
      startDate: formState.startDate || undefined,
      endDate: formState.endDate || undefined,
      completed: column === "completed",
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create task");
      const created: Task = await res.json();
      setTasks((prev) => [created, ...prev]);
      setNewTaskMap((prev) => ({ ...prev, [column]: createEmptyTask() }));
      setFormVisible((prev) => ({ ...prev, [column]: false }));
    } catch (error) {
      console.error("Failed to create task:", error);
      setFormErrors((prev) => ({ ...prev, [column]: "Unable to create task. Please try again." }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [column]: false }));
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const scheduleTaskInBlock = async (taskId: string, block: TimeBlockDefinition) => {
    if (!timeBlockDate) {
      setTimeBlockStatus({
        type: "error",
        text: "Select a planner date before scheduling blocks.",
      });
      return;
    }

    const occupant = timeBlockAssignments[block.id];
    const scheduledTask = tasks.find((item) => item.id === taskId);

    setTimeBlockStatus(null);
    setTimeBlockPending(block.id);

    try {
      if (occupant && occupant.id !== taskId) {
        await updateTask(occupant.id, { startDate: null, endDate: null });
      }

      const start = createDateTimeFromInput(timeBlockDate, block.startHour, block.startMinute);
      const end = new Date(start.getTime() + block.duration * MINUTE_IN_MS);

      await updateTask(taskId, {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      setTimeBlockStatus({
        type: "success",
        text: `Scheduled "${scheduledTask?.title ?? "task"}" for ${block.windowLabel}.`,
      });
    } catch (error) {
      console.error("Failed to schedule block:", error);
      setTimeBlockStatus({
        type: "error",
        text: "Unable to schedule that block. Please try again.",
      });
    } finally {
      setTimeBlockPending(null);
    }
  };

  const handleClearAssignment = async (taskId: string) => {
    const entry = Object.entries(timeBlockAssignments).find(([, task]) => task.id === taskId);
    const blockId = entry?.[0] ?? null;

    setTimeBlockStatus(null);
    if (blockId) {
      setTimeBlockPending(blockId);
    }

    try {
      await updateTask(taskId, { startDate: null, endDate: null });
      setTimeBlockStatus({
        type: "success",
        text: "Cleared the scheduled block.",
      });
    } catch (error) {
      console.error("Failed to clear block:", error);
      setTimeBlockStatus({
        type: "error",
        text: "Unable to clear that block. Please try again.",
      });
    } finally {
      setTimeBlockPending(null);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId.startsWith("timeblock:")) {
      const blockId = destination.droppableId.replace("timeblock:", "");
      const block = findTimeBlockById(blockId);
      if (!block) return;
      await scheduleTaskInBlock(draggableId, block);
      return;
    }

    if (destination.droppableId !== "incomplete" && destination.droppableId !== "completed") {
      return;
    }

    const movedToCompleted = destination.droppableId === "completed";
    const task = tasks.find((item) => item.id === draggableId);
    if (!task || task.completed === movedToCompleted) return;

    setTasks((prev) =>
      prev.map((item) =>
        item.id === draggableId ? { ...item, completed: movedToCompleted } : item,
      ),
    );

    try {
      await updateTask(draggableId, { completed: movedToCompleted });
    } catch (error) {
      console.error("Failed to move task:", error);
      setTasks((prev) =>
        prev.map((item) =>
          item.id === draggableId ? { ...item, completed: task.completed } : item,
        ),
      );
    }
  };

  const handleTimeBlockDateChange = (value: string) => {
    setTimeBlockDate(value);
    setTimeBlockStatus(null);
  };

  const handleInputChange = (
    column: ColumnKey,
    field: keyof NewTaskState,
    value: string
  ) => {
    setNewTaskMap((prev) => ({
      ...prev,
      [column]: {
        ...prev[column],
        [field]: value,
      },
    }));
  };

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return tasks;
    return tasks.filter((task) => {
      const haystacks = [task.title, task.description ?? ""]
        .join(" ")
        .toLowerCase();
      return haystacks.includes(term);
    });
  }, [tasks, searchTerm]);

  const applyTemplate = (template: (typeof quickTemplates)[number]) => {
    setFormVisible((prev) => ({ ...prev, incomplete: true }));
    setFormErrors((prev) => ({ ...prev, incomplete: null }));
    setNewTaskMap((prev) => ({
      ...prev,
      incomplete: {
        ...prev.incomplete,
        title: template.title,
        description: template.description,
        startDate: "",
        endDate: "",
      },
    }));
  };


  const columns = useMemo(() => {
    const base = {
      incomplete: filteredTasks.filter((task) => !task.completed),
      completed: filteredTasks.filter((task) => task.completed),
    };

    if (filter === "dueSoon") {
      base.incomplete = base.incomplete.filter((task) =>
        isTaskDueSoon(task.endDate)
      );
    } else if (filter === "overdue") {
      base.incomplete = base.incomplete.filter((task) =>
        isTaskOverdue(task.endDate)
      );
    }

    return base;
  }, [filteredTasks, filter]);

  const nextDueTask = useMemo(() => findNextDueTask(columns.incomplete), [columns.incomplete]);

  const filterOptions = [
    { key: "all", label: "All" },
    { key: "dueSoon", label: "Due Soon" },
    { key: "overdue", label: "Overdue" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Task Queue</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Task Management</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Clear planning helps you focus and not miss important deadlines."}</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL", value: taskSummary.total },
          { label: "IN PROGRESS", value: taskSummary.incomplete },
          { label: "OVERDUE", value: taskSummary.overdue },
          { label: "COMPLETED", value: taskSummary.completed },
        ].map((item) => (
          <div key={item.label} className="bento-card p-4">
            <span className="label-tech mb-2">{item.label}</span>
            <div className="text-2xl font-mono font-bold">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bento-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const active = filter === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className={[
                    "px-3 py-1.5 text-xs font-mono font-medium uppercase tracking-wider border rounded-sm transition-all",
                    active
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-base border-border-subtle text-slate-500 hover:border-slate-400",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bento-card">
        <div className="flex items-center gap-2 mb-4">
          <span className="label-tech">QUICK TEMPLATES</span>
          <span className="text-[10px] font-mono text-slate-400">ALT + N</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickTemplates.map((template) => (
            <button
              key={template.title}
              onClick={() => applyTemplate(template)}
              className="px-3 py-1.5 text-xs font-mono border border-dashed border-border-default text-slate-500 hover:border-primary hover:text-primary transition-colors rounded-sm"
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>

      {nextDueTask && (
        <div className="bento-card bg-surface-base border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div className="flex items-center gap-2 mb-2">
            <span className="label-tech">UPCOMING DEADLINE</span>
          </div>
          <p className="font-medium text-slate-900">{nextDueTask.title}</p>
          {nextDueTask.endDate && (
            <p className="text-xs font-mono text-slate-500 mt-1">
              Due {formatRelativeDate(nextDueTask.endDate)} • {formatShortDate(new Date(nextDueTask.endDate))}
            </p>
          )}
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {(Object.keys(columns) as ColumnKey[]).map((columnKey) => {
            const columnTasks = columns[columnKey];
            const config = columnConfig[columnKey];
            return (
              <Droppable droppableId={columnKey} key={columnKey}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="bento-card h-full min-h-[400px]">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="label-tech">{config.title.toUpperCase()}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded-sm">
                          {columnTasks.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{config.description}</p>

                      <div className="space-y-3">
                        {columnTasks.length === 0 ? (
                          <div className="py-8 border border-dashed border-border-default text-center text-sm text-slate-400 rounded-sm">
                            {config.emptyText}
                          </div>
                        ) : (
                          columnTasks.map((task, index) => {
                            const urgency = getTaskUrgency(task.endDate);
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(draggableProvided, snapshot) => (
                                  <div
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    style={draggableProvided.draggableProps.style}
                                    className={snapshot.isDragging ? "z-50 drop-shadow-2xl" : ""}
                                  >
                                    <div {...draggableProvided.dragHandleProps}>
                                      <TaskCard
                                        task={task}
                                        onUpdate={updateTask}
                                        onDelete={deleteTask}
                                      />
                                      {task.endDate && (
                                        <div className="mt-2 flex items-center gap-2 px-3 py-2 text-xs font-mono bg-surface-panel border border-border-subtle rounded-sm">
                                          <span className={`inline-flex h-2 w-2 rounded-full ${toneBadge[urgency.tone]}`} aria-hidden />
                                          <span className="text-slate-600">{urgency.label}</span>
                                          <span className="text-slate-400">•</span>
                                          <span className="text-slate-500">{formatRelativeDate(task.endDate)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })
                        )}
                        {provided.placeholder}

                        {formVisible[columnKey] ? (
                          <div className="space-y-3 p-4 bg-surface-panel border border-border-subtle rounded-sm">
                            <div>
                              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                Title
                              </label>
                              <input
                                type="text"
                                className="mt-1 w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                value={newTaskMap[columnKey].title}
                                onChange={(event) =>
                                  handleInputChange(columnKey, "title", event.target.value)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    void handleCreateTask(columnKey);
                                  }
                                }}
                                placeholder="Enter task title..."
                                autoFocus
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                Description (optional)
                              </label>
                              <textarea
                                className="mt-1 w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                rows={3}
                                value={newTaskMap[columnKey].description}
                                onChange={(event) =>
                                  handleInputChange(columnKey, "description", event.target.value)
                                }
                              />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                  Start
                                </label>
                                <input
                                  type="datetime-local"
                                  className="mt-1 w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                  value={newTaskMap[columnKey].startDate}
                                  onChange={(event) =>
                                    handleInputChange(columnKey, "startDate", event.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                                  End
                                </label>
                                <input
                                  type="datetime-local"
                                  className="mt-1 w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                  value={newTaskMap[columnKey].endDate}
                                  onChange={(event) =>
                                    handleInputChange(columnKey, "endDate", event.target.value)
                                  }
                                />
                              </div>
                            </div>

                            {formErrors[columnKey] && (
                              <p className="text-xs font-mono text-red-500">
                                {formErrors[columnKey]}
                              </p>
                            )}

                            <div className="flex items-center gap-2 pt-2">
                              <button
                                onClick={() => handleCreateTask(columnKey)}
                                disabled={submitting[columnKey]}
                                className="btn-tech-primary disabled:opacity-50"
                              >
                                {submitting[columnKey] ? "CREATING..." : "ADD TASK"}
                              </button>
                              <button
                                onClick={() =>
                                  setFormVisible((prev) => ({
                                    ...prev,
                                    [columnKey]: false,
                                  }))
                                }
                                className="btn-tech-secondary"
                              >
                                CANCEL
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              setFormVisible((prev) => ({
                                ...prev,
                                [columnKey]: true,
                              }))
                            }
                            className="w-full py-2 border border-dashed border-border-default text-slate-400 text-sm font-mono hover:border-primary hover:text-primary transition-colors rounded-sm"
                          >
                            + ADD TASK
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>

        <TimeBlockingBoard
          selectedDate={timeBlockDate}
          onSelectedDateChange={handleTimeBlockDateChange}
          assignments={timeBlockAssignments}
          onClearAssignment={handleClearAssignment}
          pendingBlockId={timeBlockPending}
          statusMessage={timeBlockStatus}
          onDismissStatus={() => setTimeBlockStatus(null)}
        />
      </DragDropContext>
    </div>
  );
}








