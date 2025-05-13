"use client";

import { useEffect, useState } from "react";
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Vui lòng nhập tiêu đề task");

    const res = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: { "Content-Type": "application/json" },
    });

    const created = await res.json();
    setTasks((prev) => [created, ...prev]);
    setNewTask({ title: "", description: "", startDate: "", endDate: "" });
    setShowForm(false);
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    }).then((res) => res.json());

    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

  return (
    <div className="space-y-4">
      <BackToDashboardLink />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        📋 Danh sách Task
      </h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ➕ {showForm ? "Đóng form" : "Thêm Task mới"}
      </button>

      {showForm && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2 animate-fade-in">
          <input
            className="w-full p-2 rounded border dark:bg-gray-800"
            placeholder="Tiêu đề task..."
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <textarea
            className="w-full p-2 rounded border dark:bg-gray-800"
            placeholder="Mô tả (tuỳ chọn)"
            value={newTask.description}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
          />

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Ngày bắt đầu
            </p>
            <input
              type="datetime-local"
              className="w-full p-2 rounded border dark:bg-gray-800"
              value={newTask.startDate}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Ngày kết thúc
            </p>
            <input
              type="datetime-local"
              className="w-full p-2 rounded border dark:bg-gray-800"
              value={newTask.endDate}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              ✅ Tạo task
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ✖ Huỷ
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={toggleComplete}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        ))}
      </div>
    </div>
  );
}
