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

type Task = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
};

type NewTaskState = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

const initialNewTask: NewTaskState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskMap, setNewTaskMap] = useState<{
    [key in "incomplete" | "completed"]: NewTaskState;
  }>({
    incomplete: { ...initialNewTask },
    completed: { ...initialNewTask },
  });
  const [formVisible, setFormVisible] = useState<{
    [key in "incomplete" | "completed"]: boolean;
  }>({
    incomplete: false,
    completed: false,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async (column: "incomplete" | "completed") => {
    const newTask = newTaskMap[column];
    if (!newTask.title.trim()) return alert("Vui lòng nhập tiêu đề");

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: newTask.title.trim(),
        completed: column === "completed",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const created = await res.json();
    setTasks((prev) => [created, ...prev]);
    setNewTaskMap((prev) => ({ ...prev, [column]: { ...initialNewTask } }));
    setFormVisible((prev) => ({ ...prev, [column]: false }));
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const movedToCompleted = destination.droppableId === "completed";
    const task = tasks.find((t) => t.id === draggableId);
    if (!task || task.completed === movedToCompleted) return;

    await updateTask(draggableId, { completed: movedToCompleted });
  };

  const counts = useMemo(
    () => ({
      incomplete: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    }),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <BackToDashboardLink />

          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Quản lý công việc
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Tổ chức và theo dõi tiến độ công việc của bạn
            </p>
          </div>

          {/* Columns */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {(["incomplete", "completed"] as const).map((columnKey) => {
                const title =
                  columnKey === "incomplete" ? "Đang thực hiện" : "Hoàn thành";
                const columnTasks = tasks.filter(
                  (t) => t.completed === (columnKey === "completed")
                );
                const isDone = columnKey === "completed";

                return (
                  <Droppable droppableId={columnKey} key={columnKey}>
                    {(provided, snapshot) => (
                      <div
                        className={[
                          "relative rounded-2xl border bg-white/80 backdrop-blur-xl shadow-lg transition dark:border-white/10 dark:bg-white/5",
                          snapshot.isDraggingOver
                            ? "ring-2 ring-inset ring-blue-400/40 dark:ring-blue-400/30"
                            : "border-black/5",
                        ].join(" ")}
                      >
                        {/* Column header */}
                        <div className="border-b border-black/5 p-5 dark:border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                              </h3>
                              <div
                                className="mt-1 h-0.5 w-24 rounded bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-500 opacity-60"
                                aria-hidden
                              />
                            </div>
                            <span className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                              {counts[columnKey]} task
                            </span>
                          </div>
                        </div>

                        {/* IMPORTANT: droppable ref/props phải gắn vào container chứa trực tiếp Draggable */}
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[420px] space-y-3 p-5"
                        >
                          {columnTasks.length === 0 ? (
                            <div className="grid place-items-center rounded-xl border border-dashed border-gray-300/80 p-10 text-center dark:border-white/15">
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {isDone
                                  ? "Chưa có task hoàn thành"
                                  : "Không có task đang thực hiện"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Thêm task mới để bắt đầu.
                              </p>
                            </div>
                          ) : (
                            columnTasks.map((task, index) => (
                              <Draggable
                                draggableId={task.id}
                                index={index}
                                key={task.id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={provided.draggableProps.style} // giữ style của lib để định vị đúng
                                    className={
                                      snapshot.isDragging
                                        ? "z-50 drop-shadow-2xl"
                                        : ""
                                    } // KHÔNG dùng transform (rotate/scale) ở đây
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing"
                                    >
                                      <TaskCard
                                        task={task}
                                        onDelete={deleteTask}
                                        onUpdate={updateTask}
                                      />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}

                          {/* Add task */}
                          {formVisible[columnKey] ? (
                            <div className="rounded-xl border border-black/5 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                              <input
                                type="text"
                                placeholder="Nhập tiêu đề task..."
                                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                value={newTaskMap[columnKey].title}
                                onChange={(e) =>
                                  setNewTaskMap((prev) => ({
                                    ...prev,
                                    [columnKey]: {
                                      ...prev[columnKey],
                                      title: e.target.value,
                                    },
                                  }))
                                }
                                autoFocus
                              />
                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  onClick={() => handleCreateTask(columnKey)}
                                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-4 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                                >
                                  Thêm task
                                </button>
                                <button
                                  onClick={() =>
                                    setFormVisible((prev) => ({
                                      ...prev,
                                      [columnKey]: false,
                                    }))
                                  }
                                  className="rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                                  aria-label="Huỷ"
                                >
                                  Huỷ
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
                              className="group flex w-full items-center justify-between rounded-xl border-2 border-dashed border-gray-300 bg-white/70 px-4 py-4 text-left text-gray-700 transition hover:border-gray-400 hover:bg-white/90 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg白/10"
                            >
                              <span className="text-sm font-medium">
                                Thêm task mới
                              </span>
                              <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 group-hover:border-gray-400 dark:border-white/10 dark:text-gray-400">
                                Enter
                              </span>
                            </button>
                          )}
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
