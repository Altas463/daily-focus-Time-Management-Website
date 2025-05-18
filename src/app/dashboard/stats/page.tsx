"use client";

import { useEffect, useState } from "react";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type PomodoroStats = {
  totalPomodoros: number;
  totalFocusSeconds: number;
};

type TaskStats = {
  completedCount: number;
  weeklyCompleted: { weekLabel: string; completedCount: number }[];
};

export default function StatsPage() {
  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const [pomodoroRes, taskRes] = await Promise.all([
          fetch("/api/pomodoro-sessions/stats/total"),
          fetch("/api/tasks/stats/total"),
        ]);

        if (!pomodoroRes.ok) {
          throw new Error("Failed to fetch pomodoro stats");
        }
        if (!taskRes.ok) {
          throw new Error("Failed to fetch task stats");
        }

        const pomodoroData = await pomodoroRes.json();
        const taskData = await taskRes.json();

        setPomodoroStats(pomodoroData);
        setTaskStats(taskData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h} giờ ${m} phút`;
  };

  if (loading) return <div>Đang tải dữ liệu thống kê...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      <BackToDashboardLink />

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        📊 Thống kê năng suất
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
            Task hoàn thành
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {taskStats?.completedCount ?? 0}
          </p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Tổng số task bạn đã hoàn thành từ trước đến nay
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
            Tổng thời gian làm việc
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {pomodoroStats
              ? formatDuration(pomodoroStats.totalFocusSeconds)
              : "0 giờ 0 phút"}
          </p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Tổng thời gian bạn đã tập trung làm việc (tính theo Pomodoro)
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Tổng số phiên Pomodoro hoàn thành:{" "}
            <strong>{pomodoroStats?.totalPomodoros ?? 0}</strong>
          </p>
        </div>
      </div>

      {/* Biểu đồ task hoàn thành theo tuần */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
          Task hoàn thành theo tuần
        </h3>

        {taskStats?.weeklyCompleted && taskStats.weeklyCompleted.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskStats.weeklyCompleted} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekLabel" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="completedCount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="mt-4 text-gray-500 dark:text-gray-400">Không có dữ liệu tuần để hiển thị.</p>
        )}
      </div>
    </div>
  );
}
