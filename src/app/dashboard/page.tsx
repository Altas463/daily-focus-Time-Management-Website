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
  danger: { bg: "rgba(224, 122, 95, 0.15)", text: "#c45d43", dot: "#e07a5f" },
  warning: { bg: "rgba(244, 163, 147, 0.15)", text: "#c45d43", dot: "#f4a393" },
  notice: { bg: "rgba(129, 178, 154, 0.15)", text: "#5a8a6f", dot: "#81b29a" },
  success: { bg: "rgba(129, 178, 154, 0.2)", text: "#5a8a6f", dot: "#81b29a" },
  default: { bg: "var(--surface-secondary)", text: "var(--text-secondary)", dot: "var(--text-muted)" },
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
      <div
        className="grid min-h-screen place-items-center grain"
        style={{ background: "var(--background)" }}
      >
        <div
          className="card p-10 text-center"
        >
          <div className="icon-box mx-auto mb-5">
            <Target className="w-5 h-5" />
          </div>
          <div
            className="h-1 w-40 overflow-hidden rounded-full mx-auto"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p
            className="mt-5 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
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
      color: "var(--primary)",
      helper: streak >= 3 ? `Best: ${bestStreak} days` : `Last: ${formatShortDate(lastVisit)}`,
    },
    {
      label: "Completed Today",
      value: completedTodayCount,
      unit: completedTodayCount === 1 ? "task" : "tasks",
      icon: CheckCircle2,
      progress: clamp((completedTodayCount / Math.max(taskSummary.total, 1)) * 100, 0, 100),
      color: "var(--accent)",
      helper: `${taskSummary.total} total tracked`,
    },
    {
      label: "Due Soon",
      value: taskSummary.dueSoon,
      unit: taskSummary.dueSoon === 1 ? "task" : "tasks",
      icon: Clock,
      progress: clamp((taskSummary.dueSoon / Math.max(taskSummary.incomplete, 1)) * 100, 0, 100),
      color: "var(--primary-light)",
      helper: `${taskSummary.overdue} overdue`,
    },
    {
      label: "Pomodoro Sessions",
      value: pomodoroCount,
      unit: pomodoroCount === 1 ? "session" : "sessions",
      icon: Timer,
      progress: pomodoroProgress,
      color: "var(--secondary)",
      helper: pomodoroRemaining > 0 ? `${pomodoroRemaining} to goal` : "Goal reached!",
    },
    {
      label: "Focus Time",
      value: formatDuration(focusTimeMinutes),
      unit: "",
      icon: Zap,
      progress: focusProgress,
      color: "var(--secondary)",
      helper: focusRemaining > 0 ? `${Math.ceil(focusRemaining)}m to goal` : "Goal achieved!",
    },
  ];

  return (
    <div
      className="min-h-screen grain"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="accent-line" />
            <h1
              className="display-text text-3xl lg:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              {greetingText}, <span style={{ color: "var(--primary)" }}>{session?.user?.name?.split(" ")[0] || "friend"}</span>
            </h1>
            <p
              className="text-base"
              style={{ color: "var(--text-secondary)" }}
            >
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
                    className="group card p-5 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Icon */}
                    <div
                      className="icon-box mb-4 transition-transform group-hover:scale-105"
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Value */}
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="display-text text-2xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {card.value}
                      </span>
                      {card.unit && (
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {card.unit}
                        </span>
                      )}
                    </div>

                    {/* Label */}
                    <p
                      className="text-sm font-medium mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {card.label}
                    </p>

                    {/* Progress */}
                    <div
                      className="mt-4 h-1 rounded-full overflow-hidden"
                      style={{ background: "var(--border)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: card.color }}
                      />
                    </div>

                    {/* Helper */}
                    <p
                      className="text-xs mt-2"
                      style={{ color: "var(--text-muted)" }}
                    >
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
              <div className="card overflow-hidden">
                {/* Header */}
                <div
                  className="px-6 py-5 flex items-center justify-between"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="icon-box">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Pending Tasks
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {incompleteTasks.length} {incompleteTasks.length === 1 ? "task" : "tasks"} remaining
                      </p>
                    </div>
                  </div>

                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: taskSummary.incomplete > 0 ? "var(--primary-muted)" : "rgba(129, 178, 154, 0.15)",
                      color: taskSummary.incomplete > 0 ? "var(--primary)" : "var(--accent)",
                    }}
                  >
                    {taskSummary.incomplete > 0 ? `${taskSummary.incomplete} pending` : "All done!"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  {incompleteTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div
                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: "rgba(129, 178, 154, 0.15)" }}
                      >
                        <CheckCircle2 className="w-8 h-8" style={{ color: "var(--accent)" }} />
                      </div>
                      <h4
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        All Tasks Completed!
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
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
                            className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                            style={{
                              background: "var(--surface-secondary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {/* Status Dot */}
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: toneStyle.dot }}
                            />

                            {/* Task Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-medium truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {task.title}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span
                                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                                  style={{ background: toneStyle.bg, color: toneStyle.text }}
                                >
                                  {urgency.label}
                                </span>
                                {task.endDate && (
                                  <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {formatRelativeDate(task.endDate)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Complete Button */}
                            <button
                              onClick={() => handleComplete(task.id)}
                              className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                              style={{
                                background: "var(--primary)",
                                color: "white",
                              }}
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
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors"
                          style={{
                            color: "var(--primary)",
                            background: "var(--primary-muted)",
                          }}
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
              <div className="card overflow-hidden">
                {/* Header */}
                <div
                  className="px-6 py-5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="icon-box"
                      style={{ background: "rgba(61, 90, 128, 0.1)", color: "var(--secondary)" }}
                    >
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Pomodoro Timer
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
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
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    background: "var(--surface-secondary)",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {pomodoroCount} sessions today
                    </span>
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
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
