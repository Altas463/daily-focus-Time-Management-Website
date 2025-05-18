// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";

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

  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0); // in minutes
  const [completedTodayCount, setCompletedTodayCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else {
      setLoading(false);
      fetchTasks();
      fetchStats();
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

  const fetchStats = async () => {
    try {
      const [pomodoroRes, taskRes] = await Promise.all([
        fetch("/api/pomodoro-sessions/stats"),
        fetch("/api/tasks/stats"),
      ]);

      const pomodoroData = await pomodoroRes.json();
      const taskData = await taskRes.json();

      setPomodoroCount(pomodoroData.totalPomodoros || 0);
      setFocusTime(Math.floor((pomodoroData.totalFocusSeconds || 0) / 60));
      setCompletedTodayCount(taskData.completedTodayCount || 0);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );

      fetchStats(); // Cập nhật lại thống kê sau khi hoàn thành task
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

      {/* Danh sách task chưa hoàn thành */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          📋 Danh sách công việc chưa hoàn thành
        </h3>
        {incompleteTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Không có công việc nào chưa hoàn thành.
          </p>
        ) : (
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
        )}
      </section>

      {/* Pomodoro Timer */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          ⏳ Đồng hồ Pomodoro
        </h3>
        <PomodoroTimer />
      </section>

      {/* Thống kê */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Task hoàn thành hôm nay
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {completedTodayCount}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Pomodoro hoàn tất
          </h3>
          <p className="text-2xl font-bold text-blue-500">{pomodoroCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Tổng thời gian tập trung
          </h3>
          <p className="text-2xl font-bold text-purple-500">
            {focusTime} phút
          </p>
        </div>
      </section>
    </div>
  );
}
