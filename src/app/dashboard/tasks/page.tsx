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
    <div className="space-y-4">
      <BackToDashboardLink />
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        📋 Quản lý công việc
      </h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 items-start">
          {(["incomplete", "completed"] as const).map((columnKey) => {
            const columnTitle =
              columnKey === "incomplete"
                ? "Chưa hoàn thành"
                : "Đã hoàn thành";
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
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCreateTask(columnKey)}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Thêm thẻ
                          </button>
                          <button
                            onClick={() =>
                              setFormVisible((prev) => ({
                                ...prev,
                                [columnKey]: false,
                              }))
                            }
                            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 text-lg font-bold p-1 transition-colors cursor-pointer"
                            aria-label="Huỷ thêm thẻ"
                          >
                            ✖
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
