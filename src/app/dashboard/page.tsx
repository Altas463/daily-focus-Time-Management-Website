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
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
            {greetingText}, {session?.user?.name || "friend"}
          </h1>
          <p className="mx-auto text-base text-slate-600 dark:text-slate-400">
            Let&apos;s focus on what matters. Your progress is waiting.
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
          ].map((card, idx) => (
            <motion.div 
              key={card.label} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80"
            >
              <div className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">{card.value}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{card.helper}</p>
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{card.label}</h3>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200/50 dark:bg-slate-700/50">
                <motion.div 
                  className={`h-2 rounded-full ${card.barColor}`} 
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-slate-700/50 dark:bg-slate-800/80">
              <div className="border-b border-slate-200/50 px-6 py-5 dark:border-slate-700/50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tasks to complete</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Focus on what matters today</p>
                  </div>
                  <span className="rounded-xl border border-blue-200/50 bg-blue-50/50 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300">
                    {taskSummary.incomplete} {taskSummary.incomplete === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                {incompleteTasks.length === 0 ? (
                  <div className="grid place-items-center py-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 dark:from-emerald-900/30 dark:to-cyan-900/30">
                      <span className="text-3xl">✨</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">All caught up!</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No tasks waiting. Take a well-deserved break.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {incompleteTasks.map((task, index) => {
                      const urgency = getTaskUrgency(task.endDate);
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group rounded-xl border border-slate-200/50 bg-white p-4 transition hover:bg-slate-50 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-700/30 dark:hover:bg-slate-700/50"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="mb-2 flex items-center gap-3">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full flex-shrink-0 ${toneDotMap[urgency.tone]}`} />
                                <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                  {task.title}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${toneBadgeMap[urgency.tone]}`}>
                                  {urgency.label}
                                </span>
                                {task.endDate && (
                                  <span className="text-slate-500 dark:text-slate-400">{formatRelativeDate(task.endDate)}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleComplete(task.id)}
                              className="flex-shrink-0 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30 focus:outline-none dark:from-emerald-500 dark:to-cyan-500"
                              aria-label={`Mark completed ${task.title}`}
                            >
                              Done
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
            <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-slate-700/50 dark:bg-slate-800/80">
              <div className="border-b border-slate-200/50 px-6 py-5 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Focus Session</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">25 min focus, 5 min break</p>
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



