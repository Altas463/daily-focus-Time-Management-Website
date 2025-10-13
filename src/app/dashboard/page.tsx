// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { getDaypartGreeting, formatRelativeDate } from "@/utils/date";

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
  const [focusTime, setFocusTime] = useState(0); // minutes
  const [completedTodayCount, setCompletedTodayCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
    setLoading(false);
    fetchTasks();
    fetchStats();
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
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
      fetchStats();
    } catch (error) {
      console.error("Failed to mark completed:", error);
    }
  };

  const greetingText = getDaypartGreeting();

  const getTaskPriority = (endDate?: string) => {
    if (!endDate) return { tone: "default", label: "Không ưu tiên" } as const;
    const date = new Date(endDate);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 0) return { tone: "danger", label: "Quá hạn" } as const;
    if (diffInDays <= 1) return { tone: "warning", label: "Khẩn cấp" } as const;
    if (diffInDays <= 3) return { tone: "notice", label: "Quan trọng" } as const;
    return { tone: "success", label: "Bình thường" } as const;
  };

  if (loading || status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-white dark:bg-gray-950">
        <div className="rounded-2xl border border-black/5 bg-white/80 p-6 text-gray-700 shadow backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
          <div className="h-1 w-56 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
            <div className="h-1 w-1/3 animate-[load_1.2s_ease_infinite] rounded-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-500" />
          </div>
          <p className="mt-3 text-sm">Đang tải dashboard…</p>
        </div>
        <style jsx>{`
          @keyframes load { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        `}</style>
      </div>
    );
  }

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{greetingText}, {session?.user?.name || "bạn"}!</h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600 dark:text-gray-300">Hôm nay bạn sẽ tập trung vào điều gì? Bắt đầu hành trình năng suất của mình.</p>
        </motion.div>

        {/* Stats */}
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              label: "Task hoàn thành hôm nay",
              value: String(completedTodayCount),
              progress: Math.min((completedTodayCount / 10) * 100, 100),
              gradient: "from-emerald-500 to-teal-500",
              sub: `+${Math.floor(completedTodayCount * 0.3)} hôm qua`,
            },
            {
              label: "Pomodoro hoàn tất",
              value: String(pomodoroCount),
              progress: Math.min((pomodoroCount / 20) * 100, 100),
              gradient: "from-blue-500 to-indigo-500",
              sub: `+${Math.floor(pomodoroCount * 0.2)} hôm qua`,
            },
            {
              label: "Tổng thời gian tập trung",
              value: `${Math.floor(focusTime / 60)}h ${focusTime % 60}m`,
              progress: Math.min((focusTime / 480) * 100, 100),
              gradient: "from-fuchsia-500 to-pink-500",
              sub: `+${Math.floor(focusTime * 0.15)}m hôm qua`,
            },
          ].map((c) => (
            <div key={c.label} className="group rounded-3xl border border-black/5 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-white/10 dark:bg-white/5">
              <div aria-hidden className="mb-4 h-0.5 w-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-500 opacity-70" />
              <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">{c.value}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{c.sub}</p>
              <h3 className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{c.label}</h3>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                <div className={`h-2 rounded-full bg-gradient-to-r ${c.gradient}`} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </motion.section>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Tasks */}
          <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="border-b border-black/5 p-6 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Công việc chưa hoàn thành</h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">{incompleteTasks.length} task</span>
                </div>
              </div>
              <div className="p-6">
                {incompleteTasks.length === 0 ? (
                  <div className="grid place-items-center py-12 text-center">
                    <div className="mb-3 h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
                    <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">Tuyệt vời! Bạn đã hoàn thành hết công việc</h4>
                    <p className="text-gray-500 dark:text-gray-400">Không có công việc nào chưa hoàn thành. Thời gian để thư giãn!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incompleteTasks.map((task, index) => {
                      const p = getTaskPriority(task.endDate);
                      const toneMap: Record<string, string> = {
                        danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                        warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                        notice: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                        success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                        default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
                      };
                      const dotMap: Record<string, string> = {
                        danger: "bg-red-500",
                        warning: "bg-orange-500",
                        notice: "bg-yellow-500",
                        success: "bg-green-500",
                        default: "bg-gray-400",
                      };
                      return (
                        <motion.div key={task.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="group rounded-2xl border border-gray-200/40 bg-gray-50/60 p-4 transition hover:bg-gray-100/60 dark:border-gray-700/30 dark:bg-gray-700/20 dark:hover:bg-gray-600/20">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${dotMap[p.tone]}`} />
                                <span className="font-medium text-gray-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{task.title}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${toneMap[p.tone]}`}>{p.label}</span>
                                {task.endDate && (
                                  <span className="text-gray-500 dark:text-gray-400">{formatRelativeDate(task.endDate)}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => markCompleted(task.id)}
                              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                              aria-label={`Đánh dấu hoàn thành công việc ${task.title}`}
                            >
                              Hoàn thành
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Pomodoro */}
          <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
            <div className="overflow-hidden rounded-3xl border border-black/5 bg-white/80 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
              <div className="border-b border-black/5 p-6 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Đồng hồ Pomodoro</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tập trung 25 phút, nghỉ 5 phút</p>
              </div>
              <div className="p-6">
                <PomodoroTimer />
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
