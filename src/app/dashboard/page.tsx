"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  endDate?: string;
  completed: boolean;
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (status === "loading") return; // đợi xác thực

    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else {
      setLoading(false);
      fetchTasks();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      // Cập nhật lại danh sách task
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );
    } catch (error) {
      console.error("Failed to mark completed:", error);
    }
  };

  if (loading || status === "loading") return <div>Loading...</div>;

  const incompleteTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        🎯 Xin chào, {session?.user?.name || "bạn"}! Hôm nay bạn sẽ tập trung vào điều gì?
      </h2>

      {/* Task hôm nay */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          📋 Danh sách công việc chưa hoàn thành
        </h3>
        {incompleteTasks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Không có công việc nào chưa hoàn thành.</p>
        )}
        <ul className="space-y-2">
          {incompleteTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="text-gray-800 dark:text-white">{task.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-orange-500">
                  {task.endDate
                    ? `⏰ Hạn: ${new Date(task.endDate).toLocaleDateString()}`
                    : "⏰ Chưa có hạn"}
                </span>
                <button
                  onClick={() => markCompleted(task.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  aria-label={`Đánh dấu hoàn thành công việc ${task.title}`}
                >
                  Hoàn thành
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* Pomodoro */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">⏱ Pomodoro hiện tại</h3>
        <div className="text-center text-4xl text-blue-600 font-mono">25:00</div>
        <div className="text-center mt-4 space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            ▶ Bắt đầu
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            🔁 Reset
          </button>
        </div>
      </section>

      {/* Thống kê */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Task hoàn thành hôm nay</h3>
          <p className="text-2xl font-bold text-green-500">3</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Pomodoro hoàn tất</h3>
          <p className="text-2xl font-bold text-blue-500">6</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng thời gian</h3>
          <p className="text-2xl font-bold text-purple-500">2h 30</p>
        </div>
      </section>
    </div>
  );
}
