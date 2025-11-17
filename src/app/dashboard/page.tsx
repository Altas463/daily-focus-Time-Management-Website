"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { getDaypartGreeting, formatRelativeDate, formatShortDate } from "@/utils/date";
import { getTaskUrgency, summarizeTasks, TaskUrgency } from "@/utils/tasks";
import { getFocusTimeProgress, getPomodoroProgress } from "@/utils/pomodoro";
import { clamp, formatDuration, pluralize } from "@/utils/format";
import { useDailyStreak } from "@/hooks/useDailyStreak";

type Task = {
  id: string;
  title: string;
  endDate?: string;
  completed: boolean;
};

type PomodoroStats = {
  totalPomodoros?: number;
  totalFocusSeconds?: number;
};

type TaskStats = {
  completedTodayCount?: number;
};

const toneBadgeMap: Record<TaskUrgency["tone"], string> = {
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  warning: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  notice: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const toneDotMap: Record<TaskUrgency["tone"], string> = {
  danger: "bg-red-500",
  warning: "bg-orange-500",
  notice: "bg-yellow-500",
  success: "bg-green-500",
  default: "bg-gray-400",
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusTimeMinutes, setFocusTimeMinutes] = useState(0);
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const { streak, bestStreak, lastVisit } = useDailyStreak();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/auth/login");
      return;
    }
    setLoading(false);
    void fetchTasks();
    void fetchStats();
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data: Task[] = await res.json();
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
      const pomodoroData: PomodoroStats = await pomodoroRes.json();
      const taskData: TaskStats = await taskRes.json();

      setPomodoroCount(pomodoroData.totalPomodoros ?? 0);
      setFocusTimeMinutes(Math.floor((pomodoroData.totalFocusSeconds ?? 0) / 60));
      setCompletedTodayCount(taskData.completedTodayCount ?? 0);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: true } : task)));
      void fetchStats();
    } catch (error) {
      console.error("Failed to mark completed:", error);
    }
  };

  const greetingText = getDaypartGreeting();
  const taskSummary = useMemo(() => summarizeTasks(tasks), [tasks]);
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const { progress: pomodoroProgress, remaining: pomodoroRemaining } = useMemo(
    () => getPomodoroProgress(pomodoroCount),
    [pomodoroCount]
  );
  const { progress: focusProgress, remaining: focusRemaining } = useMemo(
    () => getFocusTimeProgress(focusTimeMinutes),
    [focusTimeMinutes]
  );

  if (loading || status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-white dark:bg-gray-950">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
           <div className="h-1 w-56 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
             <div className="h-1 w-1/3 animate-[load_1.2s_ease_infinite] rounded-full bg-blue-500 dark:bg-blue-400" />
           </div>
           <p className="mt-3 text-sm">Loading dashboard...</p>
         </div>
        <style jsx>{`
          @keyframes load {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {greetingText}, {session?.user?.name || "friend"}!
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Focus on what matters, let Daily Focus record your progress and track it every day.
          </p>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Focus streak",
              value: pluralize(streak, "day", "days"),
              progress: clamp((streak / 14) * 100, 0, 100),
              barColor: "bg-slate-900",
              helper: streak >= 3 ? `Best streak ${bestStreak} days` : `Last check-in ${formatShortDate(lastVisit)}`,
            },
            {
              label: "Tasks completed today",
              value: completedTodayCount,
              progress: clamp((completedTodayCount / Math.max(taskSummary.total, 1)) * 100, 0, 100),
              barColor: "bg-emerald-600",
              helper: pluralize(taskSummary.total, "task tracked", "tasks tracked"),
            },
            {
              label: "Tasks due soon",
              value: taskSummary.dueSoon,
              progress: clamp((taskSummary.dueSoon / Math.max(taskSummary.incomplete, 1)) * 100, 0, 100),
              barColor: "bg-amber-500",
              helper: pluralize(taskSummary.overdue, "task overdue", "tasks overdue"),
            },
            {
              label: "Pomodoro sessions",
              value: pomodoroCount,
              progress: pomodoroProgress,
              barColor: "bg-blue-600",
              helper:
                pomodoroRemaining > 0
                  ? pluralize(pomodoroRemaining, "session to reach goal", "sessions to reach goal")
                  : "Goal completed for this week",
            },
            {
              label: "Focus time",
              value: formatDuration(focusTimeMinutes),
              progress: focusProgress,
              barColor: "bg-purple-600",
              helper:
                focusRemaining > 0
                  ? pluralize(Math.ceil(focusRemaining), "minute to reach goal", "minutes to reach goal")
                  : "Focus goal achieved for the week",
            },
          ].map((card) => (
            <div key={card.label} className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-1 text-3xl font-semibold text-gray-900 dark:text-white">{card.value}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.helper}</p>
              <h3 className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{card.label}</h3>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div className={`h-2 rounded-full ${card.barColor}`} style={{ width: `${card.progress}%` }} />
              </div>
            </div>
          ))}
        </motion.section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tasks Not Completed</h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
                    {taskSummary.incomplete} task
                  </span>
                </div>
              </div>
              <div className="p-6">
                {incompleteTasks.length === 0 ? (
                  <div className="grid place-items-center py-12 text-center">
                    <div className="mb-3 h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30" />
                    <h4 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">All Completed!</h4>
                    <p className="text-gray-500 dark:text-gray-400">No tasks waiting. Take a break and relax.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incompleteTasks.map((task, index) => {
                      const urgency = getTaskUrgency(task.endDate);
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group rounded-lg border border-gray-200 bg-white p-4 transition hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-3">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${toneDotMap[urgency.tone]}`} />
                                <span className="font-medium text-gray-900 transition group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                  {task.title}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${toneBadgeMap[urgency.tone]}`}>
                                  {urgency.label}
                                </span>
                                {task.endDate && (
                                  <span className="text-gray-500 dark:text-gray-400">{formatRelativeDate(task.endDate)}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleComplete(task.id)}
                              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
                              aria-label={`Mark completed ${task.title}`}
                            >
                              Complete
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

          <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pomodoro Timer</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Focus for 25 min, break for 5 min</p>
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



