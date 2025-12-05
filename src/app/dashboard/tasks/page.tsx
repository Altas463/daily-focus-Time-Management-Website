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
  summarizeTasks,
  isTaskDueSoon,
  isTaskOverdue,
} from "@/utils/tasks";

import { Filter, Plus, Search, LayoutTemplate, BarChart3 } from "lucide-react";

type ColumnKey = "incomplete" | "completed";

type NewTaskState = ReturnType<typeof createEmptyTask>;

const columnConfig: Record<
  ColumnKey,
  { title: string; description: string; badgeColor: string; emptyText: string }
> = {
  incomplete: {
    title: "In Progress",
    description: "Active tasks",
    badgeColor: "bg-amber-100 text-amber-700",
    emptyText: "No active tasks",
  },
  completed: {
    title: "Completed",
    description: "Finished tasks",
    badgeColor: "bg-emerald-100 text-emerald-700",
    emptyText: "No completed tasks",
  },
};

const quickTemplates = [
  { title: "Daily planning", description: "List of 3 important priorities" },
  { title: "Daily standup", description: "Progress update + blockers" },
  { title: "End of day recap", description: "Reflection + plan for tomorrow" },
] as const;


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
  const [, setFormErrors] = useState<Record<ColumnKey, string | null>>({
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



  const filterOptions = [
    { key: "all", label: "All Tasks" },
    { key: "dueSoon", label: "Due Soon" },
    { key: "overdue", label: "Overdue" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Task Management</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Tasks & Planning</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Organize your work, track progress, and block time for deep focus."}</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar (Filters & Stats) - 3 Cols */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Card */}
          <div className="bento-card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="label-tech">OVERVIEW</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-mono font-bold">{taskSummary.incomplete}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Active</div>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold">{taskSummary.completed}</div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Done</div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bento-card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-primary" />
              <span className="label-tech">FILTERS</span>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search..."
                className="w-full bg-surface-base border border-border-subtle rounded-sm pl-8 pr-3 py-2 font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              {filterOptions.map((option) => {
                const active = filter === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key)}
                    className={`text-left px-3 py-2 text-xs font-mono font-medium uppercase tracking-wider rounded-sm transition-all ${
                      active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-slate-500 hover:bg-surface-panel"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Card */}
          <div className="bento-card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-4 h-4 text-primary" />
              <span className="label-tech">TEMPLATES</span>
            </div>
            <div className="flex flex-col gap-2">
              {quickTemplates.map((template) => (
                <button
                  key={template.title}
                  onClick={() => applyTemplate(template)}
                  className="text-left px-3 py-2 text-xs font-mono border border-dashed border-border-default text-slate-500 hover:border-primary hover:text-primary transition-colors rounded-sm"
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content (Task Board) - 9 Cols */}
        <div className="lg:col-span-9 space-y-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(Object.keys(columns) as ColumnKey[]).map((columnKey) => {
                const columnTasks = columns[columnKey];
                const config = columnConfig[columnKey];
                return (
                  <Droppable droppableId={columnKey} key={columnKey}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col h-full">
                        <div className="bento-card flex-1 min-h-[500px] flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <span className="label-tech">{config.title.toUpperCase()}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-sm ${config.badgeColor.split(' ')[0]} ${config.badgeColor.split(' ')[1]}`}>
                              {columnTasks.length}
                            </span>
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            {columnTasks.length === 0 ? (
                              <div className="h-32 flex items-center justify-center border border-dashed border-border-default rounded-sm">
                                <p className="text-xs font-mono text-slate-400">{config.emptyText}</p>
                              </div>
                            ) : (
                              columnTasks.map((task, index) => {
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
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })
                            )}
                            {provided.placeholder}
                          </div>

                          {/* Add Task Form / Button */}
                          <div className="mt-4 pt-4 border-t border-border-subtle">
                             {formVisible[columnKey] ? (
                              <div className="space-y-3 bg-surface-panel p-3 rounded-sm border border-border-subtle">
                                <input
                                  type="text"
                                  className="w-full bg-surface-base border border-border-subtle rounded-sm px-3 py-2 text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                  value={newTaskMap[columnKey].title}
                                  onChange={(e) => handleInputChange(columnKey, "title", e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      void handleCreateTask(columnKey);
                                    }
                                  }}
                                  placeholder="Task title..."
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleCreateTask(columnKey)}
                                    disabled={submitting[columnKey]}
                                    className="btn-tech-primary flex-1 py-1.5 text-xs"
                                  >
                                    ADD
                                  </button>
                                  <button
                                    onClick={() => setFormVisible((prev) => ({ ...prev, [columnKey]: false }))}
                                    className="btn-tech-secondary flex-1 py-1.5 text-xs"
                                  >
                                    CANCEL
                                  </button>
                                </div>
                              </div>
                             ) : (
                               <button
                                onClick={() => setFormVisible((prev) => ({ ...prev, [columnKey]: true }))}
                                className="w-full py-2 border border-dashed border-border-default text-slate-400 text-xs font-mono hover:border-primary hover:text-primary transition-colors rounded-sm flex items-center justify-center gap-2"
                              >
                                <Plus className="w-3 h-3" />
                                ADD TASK
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
      </div>
    </div>
  );
}
