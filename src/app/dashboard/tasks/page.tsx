"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <BackToDashboardLink />

          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Quản lý công việc
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Tổ chức và theo dõi tiến độ công việc của bạn
            </p>
          </div>

          {/* Task Columns */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {(["incomplete", "completed"] as const).map((columnKey) => {
                const columnConfig = {
                  incomplete: {
                    title: "Đang thực hiện",
                    count: tasks.filter((t) => !t.completed).length,
                  },
                  completed: {
                    title: "Hoàn thành",
                    count: tasks.filter((t) => t.completed).length,
                  },
                };

                const config = columnConfig[columnKey];
                const columnTasks = tasks.filter(
                  (t) => t.completed === (columnKey === "completed")
                );

                return (
                  <Droppable droppableId={columnKey} key={columnKey}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
                          shadow-sm hover:shadow-md transition-all duration-200
                          ${
                            snapshot.isDraggingOver
                              ? "bg-gray-50 dark:bg-gray-750 border-gray-300 dark:border-gray-600"
                              : ""
                          }
                        `}
                      >
                        {/* Column Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {config.title}
                            </h3>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              {config.count}
                            </span>
                          </div>
                        </div>

                        {/* Tasks Container */}
                        <div className="p-6 space-y-3 min-h-[400px]">
                          {columnTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                              <div className="w-12 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center mb-3">
                                <svg
                                  className="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              </div>
                              <p className="text-sm font-medium">
                                {columnKey === "incomplete"
                                  ? "Không có task đang thực hiện"
                                  : "Chưa hoàn thành task nào"}
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
                                    className={`
                                      transition-all duration-200
                                      ${
                                        snapshot.isDragging
                                          ? "rotate-3 scale-105 shadow-2xl z-50"
                                          : ""
                                      }
                                    `}
                                  >
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-move"
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

                          {/* Add Task Form/Button */}
                          {formVisible[columnKey] ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                              <input
                                type="text"
                                placeholder="Nhập tiêu đề task..."
                                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                              <div className="flex items-center gap-2 mt-3">
                                <button
                                  onClick={() => handleCreateTask(columnKey)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow hover:shadow-md"
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
                                  className="text-gray-500 hover:text-red-500 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                  aria-label="Huỷ"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
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
                              className="group w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 hover:shadow-md"
                            >
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 flex items-center justify-center transition">
                                <svg
                                  className="h-5 w-5 transition group-hover:scale-110"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="font-semibold text-base">
                                  Thêm task mới
                                </span>
                                <span className="text-sm opacity-70">
                                  Click để tạo task
                                </span>
                              </div>
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
