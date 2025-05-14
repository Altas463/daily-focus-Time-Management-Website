"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard";
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
      body: JSON.stringify({ ...newTask, completed: column === "completed" }),
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
    <div className="space-y-6 px-4 md:px-10 py-6">
      <BackToDashboardLink />
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        📋 Quản lý công việc
      </h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 items-start">
          {(["incomplete", "completed"] as const).map((columnKey) => {
            const columnTitle =
              columnKey === "incomplete"
                ? "🕒 Chưa hoàn thành"
                : "✅ Đã hoàn thành";
            const columnTasks = tasks.filter(
              (t) => t.completed === (columnKey === "completed")
            );

            return (
              <Droppable droppableId={columnKey} key={columnKey}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md w-full max-w-md p-4 flex flex-col"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                      {columnTitle}
                    </h3>

                    <div className="flex flex-col gap-3 mb-4">
                      {columnTasks.map((task, index) => (
                        <Draggable
                          draggableId={task.id}
                          index={index}
                          key={task.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onDelete={deleteTask}
                                onUpdate={updateTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {formVisible[columnKey] ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Tiêu đề..."
                          className="w-full px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none"
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
                        />
                        <textarea
                          placeholder="Mô tả (tuỳ chọn)"
                          className="w-full px-3 py-2 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none"
                          rows={2}
                          value={newTaskMap[columnKey].description}
                          onChange={(e) =>
                            setNewTaskMap((prev) => ({
                              ...prev,
                              [columnKey]: {
                                ...prev[columnKey],
                                description: e.target.value,
                              },
                            }))
                          }
                        />
                        <div className="flex gap-2">
                          <div className="flex flex-col w-1/2">
                            <label className="text-sm text-gray-500 dark:text-gray-400">
                              Bắt đầu
                            </label>
                            <input
                              type="date"
                              className="px-2 py-1 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                              value={
                                newTaskMap[columnKey].startDate?.split(
                                  "T"
                                )[0] || ""
                              }
                              onChange={(e) =>
                                setNewTaskMap((prev) => ({
                                  ...prev,
                                  [columnKey]: {
                                    ...prev[columnKey],
                                    startDate: `${e.target.value}T${
                                      prev[columnKey].startDate?.split(
                                        "T"
                                      )[1] || "00:00"
                                    }`,
                                  },
                                }))
                              }
                            />
                            <input
                              type="time"
                              className="mt-1 px-2 py-1 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                              value={
                                newTaskMap[columnKey].startDate?.split(
                                  "T"
                                )[1] || ""
                              }
                              onChange={(e) =>
                                setNewTaskMap((prev) => ({
                                  ...prev,
                                  [columnKey]: {
                                    ...prev[columnKey],
                                    startDate: `${
                                      prev[columnKey].startDate?.split(
                                        "T"
                                      )[0] || ""
                                    }T${e.target.value}`,
                                  },
                                }))
                              }
                            />
                          </div>

                          <div className="flex flex-col w-1/2">
                            <label className="text-sm text-gray-500 dark:text-gray-400">
                              Kết thúc
                            </label>
                            <input
                              type="date"
                              className="px-2 py-1 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                              value={
                                newTaskMap[columnKey].endDate?.split("T")[0] ||
                                ""
                              }
                              onChange={(e) =>
                                setNewTaskMap((prev) => ({
                                  ...prev,
                                  [columnKey]: {
                                    ...prev[columnKey],
                                    endDate: `${e.target.value}T${
                                      prev[columnKey].endDate?.split("T")[1] ||
                                      "00:00"
                                    }`,
                                  },
                                }))
                              }
                            />
                            <input
                              type="time"
                              className="mt-1 px-2 py-1 rounded border dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                              value={
                                newTaskMap[columnKey].endDate?.split("T")[1] ||
                                ""
                              }
                              onChange={(e) =>
                                setNewTaskMap((prev) => ({
                                  ...prev,
                                  [columnKey]: {
                                    ...prev[columnKey],
                                    endDate: `${
                                      prev[columnKey].endDate?.split("T")[0] ||
                                      ""
                                    }T${e.target.value}`,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCreateTask(columnKey)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            ✔ Thêm
                          </button>
                          <button
                            onClick={() =>
                              setFormVisible((prev) => ({
                                ...prev,
                                [columnKey]: false,
                              }))
                            }
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          >
                            ✖ Huỷ
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100/60 dark:bg-gray-800/40 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Thêm thẻ mới</span>
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
