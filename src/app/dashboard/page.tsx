"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  Clock,
  Timer,
  TrendingUp,
  Calendar,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { getDaypartGreeting, formatRelativeDate, formatShortDate } from "@/utils/date";
import { getTaskUrgency, summarizeTasks, TaskUrgency } from "@/utils/tasks";
import { getFocusTimeProgress, getPomodoroProgress } from "@/utils/pomodoro";
import { clamp, formatDuration } from "@/utils/format";
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

const toneBadgeMap: Record<TaskUrgency["tone"], { bg: string; text: string; dot: string }> = {
  danger: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  warning: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  notice: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  success: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  default: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
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
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-5 text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <div className="h-1 w-40 overflow-hidden rounded-full mx-auto bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-blue-600"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Focus Streak",
      value: streak,
      unit: streak === 1 ? "day" : "days",
      icon: Flame,
      progress: clamp((streak / 14) * 100, 0, 100),
      color: "bg-blue-600",
      helper: streak >= 3 ? `Best: ${bestStreak} days` : `Last: ${formatShortDate(lastVisit)}`,
    },
    {
      label: "Completed Today",
      value: completedTodayCount,
      unit: completedTodayCount === 1 ? "task" : "tasks",
      icon: CheckCircle2,
      progress: clamp((completedTodayCount / Math.max(taskSummary.total, 1)) * 100, 0, 100),
      color: "bg-green-500",
      helper: `${taskSummary.total} total tracked`,
    },
    {
      label: "Due Soon",
      value: taskSummary.dueSoon,
      unit: taskSummary.dueSoon === 1 ? "task" : "tasks",
      icon: Clock,
      progress: clamp((taskSummary.dueSoon / Math.max(taskSummary.incomplete, 1)) * 100, 0, 100),
      color: "bg-orange-400",
      helper: `${taskSummary.overdue} overdue`,
    },
    {
      label: "Pomodoro Sessions",
      value: pomodoroCount,
      unit: pomodoroCount === 1 ? "session" : "sessions",
      icon: Timer,
      progress: pomodoroProgress,
      color: "bg-indigo-500",
      helper: pomodoroRemaining > 0 ? `${pomodoroRemaining} to goal` : "Goal reached!",
    },
    {
      label: "Focus Time",
      value: formatDuration(focusTimeMinutes),
      unit: "",
      icon: Zap,
      progress: focusProgress,
      color: "bg-indigo-500",
      helper: focusRemaining > 0 ? `${Math.ceil(focusRemaining)}m to goal` : "Goal achieved!",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              {greetingText}, <span className="text-blue-600">{session?.user?.name?.split(" ")[0] || "friend"}</span>
            </h1>
            <p className="text-base text-slate-500">
              Focus on what matters. Track your progress every day.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.section variants={itemVariants}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {statsCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-4 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-slate-900">
                        {card.value}
                      </span>
                      {card.unit && (
                        <span className="text-sm font-medium text-slate-500">
                          {card.unit}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <p className="text-sm font-medium mt-1 text-slate-600">
                      {card.label}
                    </p>

                    {/* Progress */}
                    <div className="mt-4 h-1 rounded-full overflow-hidden bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${card.color}`}
                      />
                    </div>

                    {/* Helper */}
                    <p className="text-xs mt-2 text-slate-400">
                      {card.helper}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Tasks Section */}
            <motion.section variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Pending Tasks
                      </h3>
                      <p className="text-sm text-slate-500">
                        {incompleteTasks.length} {incompleteTasks.length === 1 ? "task" : "tasks"} remaining
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                    taskSummary.incomplete > 0 
                      ? "bg-blue-50 text-blue-700" 
                      : "bg-green-50 text-green-700"
                  }`}>
                    {taskSummary.incomplete > 0 ? `${taskSummary.incomplete} pending` : "All done!"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {incompleteTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 flex items-center justify-center mb-4 text-green-600">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">
                        All Tasks Completed!
                      </h4>
                      <p className="text-sm text-slate-500">
                        Great work! Take a well-deserved break.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {incompleteTasks.slice(0, 5).map((task, index) => {
                        const urgency = getTaskUrgency(task.endDate);
                        const toneStyle = toneBadgeMap[urgency.tone];

                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 transition-all duration-200 hover:bg-white hover:shadow-sm hover:border-blue-200"
                          >
                            {/* Status Dot */}
                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${toneStyle.dot}`} />

                            {/* Task Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-slate-900 group-hover:text-blue-700 transition-colors">
                                {task.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${toneStyle.bg} ${toneStyle.text}`}>
                                  {urgency.label}
                                </span>
                                {task.endDate && (
                                  <span className="text-xs text-slate-500">
                                    {formatRelativeDate(task.endDate)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Complete Button */}
                            <button
                              onClick={() => handleComplete(task.id)}
                              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold bg-white text-slate-600 border border-slate-200 shadow-sm transition-all duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-0.5"
                              aria-label={`Mark ${task.title} as completed`}
                            >
                              Done
                            </button>
                          </motion.div>
                        );
                      })}

                      {incompleteTasks.length > 5 && (
                        <button
                          onClick={() => router.push("/dashboard/tasks")}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          View all {incompleteTasks.length} tasks
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Pomodoro Section */}
            <motion.section variants={itemVariants}>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Pomodoro Timer
                      </h3>
                      <p className="text-sm text-slate-500">
                        25 min focus, 5 min break
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="p-6">
                  <PomodoroTimer />
                </div>

                {/* Quick Stats */}
                <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-600">
                      {pomodoroCount} sessions today
                    </span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {formatDuration(focusTimeMinutes)}
                  </span>
                </div>
              </div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
