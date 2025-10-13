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
import {
  createEmptyTask,
  getTaskUrgency,
  summarizeTasks,
  TaskUrgency,
  isTaskDueSoon,
  isTaskOverdue,
} from "@/utils/tasks";
import { formatRelativeDate } from "@/utils/date";

type Task = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
};

type ColumnKey = "incomplete" | "completed";

type NewTaskState = ReturnType<typeof createEmptyTask>;

const columnConfig: Record<
  ColumnKey,
  { title: string; description: string; badgeColor: string; emptyText: string }
> = {
  incomplete: {
    title: "Dang thuc hien",
    description: "Task dang mo, keo tha de chuyen trang thai",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    emptyText: "Tat ca da hoan thanh, them task moi de tiep tuc nao!",
  },
  completed: {
    title: "Da hoan thanh",
    description: "Luu vet nhung gi ban da lam duoc",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    emptyText: "Chua co task hoan thanh. Ban co the keo tha tu cot ben kia.",
  },
};

const quickTemplates = [
  { title: "Lap ke hoach ngay", description: "Danh sach 3 uu tien quan trong" },
  { title: "Buoi daily standup", description: "Thong tin tien do + tro ngai" },
  { title: "Tong ket cuoi ngay", description: "Nhan xet + len ke hoach ngay mai" },
] as const;

const toneBadge: Record<TaskUrgency["tone"], string> = {
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  notice: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
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

  const handleCreateTask = async (column: ColumnKey) => {
    const formState = newTaskMap[column];
    const trimmedTitle = formState.title.trim();
    if (!trimmedTitle) {
      setFormErrors((prev) => ({ ...prev, [column]: "Vui long nhap tieu de task" }));
      return;
    }

    if (formState.startDate && formState.endDate) {
      const start = new Date(formState.startDate);
      const end = new Date(formState.endDate);
      if (start > end) {
        setFormErrors((prev) => ({
          ...prev,
          [column]: "Thoi gian ket thuc phai lon hon thoi gian bat dau",
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
      setFormErrors((prev) => ({ ...prev, [column]: "Khong the tao task. Thu lai sau." }));
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

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const movedToCompleted = destination.droppableId === "completed";
    const task = tasks.find((item) => item.id === draggableId);
    if (!task || task.completed === movedToCompleted) return;

    setTasks((prev) =>
      prev.map((item) =>
        item.id === draggableId ? { ...item, completed: movedToCompleted } : item
      )
    );

    try {
      await updateTask(draggableId, { completed: movedToCompleted });
    } catch (error) {
      console.error("Failed to move task:", error);
      setTasks((prev) =>
        prev.map((item) =>
          item.id === draggableId ? { ...item, completed: task.completed } : item
        )
      );
    }
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
    { key: "all", label: "Tat ca" },
    { key: "dueSoon", label: "Sap den han" },
    { key: "overdue", label: "Qua han" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <BackToDashboardLink />

          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Quan ly cong viec</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Ke hoach ro rang giup ban tap trung va khong bo lo dead-line quan trong.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Tong task", value: taskSummary.total },
              { label: "Dang thuc hien", value: taskSummary.incomplete },
              { label: "Qua han", value: taskSummary.overdue },
              { label: "Hoan thanh", value: taskSummary.completed },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</span>
                <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = filter === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => setFilter(option.key)}
                    className={[
                      "rounded-full border px-3 py-1 text-sm font-medium transition",
                      active
                        ? "border-gray-900 bg-gray-900 text-white dark:border-white/90 dark:bg-white/90 dark:text-gray-900"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-white/10 dark:text-gray-300 dark:hover:border-white/20",
                    ].join(" ")}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="w-full sm:w-72">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tim task..."
                className="w-full rounded-full border border-gray-200 bg-white py-2 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Mau nhanh
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {quickTemplates.map((template) => (
                <button
                  key={template.title}
                  onClick={() => applyTemplate(template)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:bg-white/10 dark:text-gray-300 dark:hover:border-white/20"
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {(Object.keys(columns) as ColumnKey[]).map((columnKey) => {
                const columnTasks = columns[columnKey];
                const config = columnConfig[columnKey];
                return (
                  <Droppable droppableId={columnKey} key={columnKey}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                          <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-6 dark:border-gray-800">
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {config.title}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {config.description}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${config.badgeColor}`}
                            >
                              {columnTasks.length}
                            </span>
                          </div>

                          <div className="space-y-4 p-6">
                            {columnTasks.length === 0 ? (
                              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
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
                                            <div className="mt-2 flex items-center gap-2 rounded-xl bg-gray-100/70 px-3 py-2 text-xs text-gray-600 dark:bg-gray-700/40 dark:text-gray-300">
                                              <span className={`inline-flex h-2 w-2 rounded-full ${toneBadge[urgency.tone]}`} aria-hidden />
                                              <span>{urgency.label}</span>
                                              <span className="text-gray-400">•</span>
                                              <span>{formatRelativeDate(task.endDate)}</span>
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
                              <div className="space-y-3 rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                    Tieu de
                                  </label>
                                  <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
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
                                    placeholder="Nhap tieu de task..."
                                    autoFocus
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                    Mo ta (tuy chon)
                                  </label>
                                  <textarea
                                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                    rows={3}
                                    value={newTaskMap[columnKey].description}
                                    onChange={(event) =>
                                      handleInputChange(columnKey, "description", event.target.value)
                                    }
                                  />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                      Bat dau
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                      value={newTaskMap[columnKey].startDate}
                                      onChange={(event) =>
                                        handleInputChange(columnKey, "startDate", event.target.value)
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-300">
                                      Ket thuc
                                    </label>
                                    <input
                                      type="datetime-local"
                                      className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                      value={newTaskMap[columnKey].endDate}
                                      onChange={(event) =>
                                        handleInputChange(columnKey, "endDate", event.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                {formErrors[columnKey] && (
                                  <p className="text-xs font-medium text-red-500">
                                    {formErrors[columnKey]}
                                  </p>
                                )}

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCreateTask(columnKey)}
                                    disabled={submitting[columnKey]}
                                    className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-4 focus:ring-gray-900/20 disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                                  >
                                    {submitting[columnKey] ? "Dang tao..." : "Them task"}
                                  </button>
                                  <button
                                    onClick={() =>
                                      setFormVisible((prev) => ({
                                        ...prev,
                                        [columnKey]: false,
                                      }))
                                    }
                                    className="rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                                  >
                                    Huy
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
                                className="group flex w-full items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-white/70 px-4 py-4 text-left text-gray-700 transition hover:border-gray-400 hover:bg-white/90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-white/10"
                              >
                                <span className="text-sm font-medium">Them task moi</span>
                                <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 group-hover:border-gray-400 dark:border-gray-800 dark:text-gray-400">
                                  Enter
                                </span>
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
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

