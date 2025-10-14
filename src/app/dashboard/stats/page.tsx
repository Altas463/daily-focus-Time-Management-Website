"use client";

import { useEffect, useMemo, useState } from "react";
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

type CombinedStats = {
  pomodoro: PomodoroStats | null;
  tasks: TaskStats | null;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const focusMinutesFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export default function StatsPage() {
  const [data, setData] = useState<CombinedStats>({ pomodoro: null, tasks: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const [pomodoroRes, taskRes] = await Promise.all([
          fetch("/api/pomodoro-sessions/stats/total"),
          fetch("/api/tasks/stats/total"),
        ]);

        if (!pomodoroRes.ok) {
          throw new Error("Unable to load focus session stats.");
        }
        if (!taskRes.ok) {
          throw new Error("Unable to load task stats.");
        }

        const pomodoroData: PomodoroStats = await pomodoroRes.json();
        const taskData: TaskStats = await taskRes.json();

        if (!isMounted) return;
        setData({ pomodoro: pomodoroData, tasks: taskData });
      } catch (err: unknown) {
        if (!isMounted) return;
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong while loading stats.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const focusDuration = useMemo(() => {
    const seconds = data.pomodoro?.totalFocusSeconds ?? 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes, totalMinutes: Math.floor(seconds / 60) };
  }, [data.pomodoro]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <BackToDashboardLink />
        <StatsHeaderSkeleton />
        <StatsCardsSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <BackToDashboardLink />
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      </div>
    );
  }

  const weeklyCompleted = data.tasks?.weeklyCompleted ?? [];
  const hasChartData = weeklyCompleted.length > 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
          Productivity reports
        </span>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">
          Overview of your focus and task trends
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
          Daily Focus keeps a running record of what you complete and how long you stay in flow. Use these insights to celebrate streaks, rebalance workload, and fine tune your next sprint.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Tasks completed"
          stat={numberFormatter.format(data.tasks?.completedCount ?? 0)}
          hint="Total recorded across all lists."
          tone="emerald"
        />
        <StatCard
          title="Focus hours logged"
          stat={`${focusDuration.hours}h ${focusDuration.minutes}m`}
          hint={`${focusMinutesFormatter.format(focusDuration.totalMinutes)} minutes tracked in Pomodoro sessions.`}
          tone="blue"
        />
        <StatCard
          title="Pomodoro sessions"
          stat={numberFormatter.format(data.pomodoro?.totalPomodoros ?? 0)}
          hint="Completed focus intervals."
          tone="purple"
        />
        <StatCard
          title="Weekly average"
          stat={
            weeklyCompleted.length
              ? numberFormatter.format(
                  Math.round(
                    weeklyCompleted.reduce((sum, week) => sum + week.completedCount, 0) /
                      weeklyCompleted.length
                  )
                )
              : "0"
          }
          hint="Average tasks wrapped per week."
          tone="amber"
        />
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Completed tasks per week
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Spot the peaks and quieter weeks to plan your next sprint with confidence.
            </p>
          </div>
        </div>

        <div className="mt-6 h-72 rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompleted} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekLabel" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(16, 185, 129, 0.08)" }} />
                <Bar dataKey="completedCount" fill="#10B981" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState />
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  stat,
  hint,
  tone,
}: {
  title: string;
  stat: string;
  hint: string;
  tone: "emerald" | "blue" | "purple" | "amber";
}) {
  const toneStyles: Record<"emerald" | "blue" | "purple" | "amber", string> = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
        {title}
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${toneStyles[tone]}`}>
          Live
        </span>
      </div>
      <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">{stat}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
    </article>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="text-base font-semibold text-gray-700 dark:text-gray-200">
        No weekly task data yet
      </span>
      <p className="max-w-sm text-center text-xs">
        Finish a few tasks this week to unlock trend lines. Your completed items will appear here automatically.
      </p>
    </div>
  );
}

function StatsHeaderSkeleton() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-3 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="mt-4 h-6 w-72 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-3 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="mt-2 h-3 w-3/4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="mt-6 h-72 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
    </div>
  );
}
