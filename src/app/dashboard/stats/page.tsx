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
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <BackToDashboardLink />
          <div className="h-4 w-px bg-border-default"></div>
          <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Analytics</span>
        </div>
        <StatsHeaderSkeleton />
        <StatsCardsSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="flex items-center gap-4">
          <BackToDashboardLink />
          <div className="h-4 w-px bg-border-default"></div>
          <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Analytics</span>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-mono">
          ERROR: {error}
        </div>
      </div>
    );
  }

  const weeklyCompleted = data.tasks?.weeklyCompleted ?? [];
  const hasChartData = weeklyCompleted.length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Analytics</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Focus and task trends</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Daily Focus tracks your flow state and task completion metrics."}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="TASKS COMPLETED"
          stat={numberFormatter.format(data.tasks?.completedCount ?? 0)}
          hint="Total recorded across all lists."
          tone="emerald"
        />
        <StatCard
          title="FOCUS HOURS"
          stat={`${focusDuration.hours}h ${focusDuration.minutes}m`}
          hint={`${focusMinutesFormatter.format(focusDuration.totalMinutes)} minutes in Pomodoro sessions.`}
          tone="blue"
        />
        <StatCard
          title="POMODORO SESSIONS"
          stat={numberFormatter.format(data.pomodoro?.totalPomodoros ?? 0)}
          hint="Completed focus intervals."
          tone="purple"
        />
        <StatCard
          title="WEEKLY AVERAGE"
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
          hint="Average tasks per week."
          tone="amber"
        />
      </section>

      <section className="bento-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="label-tech">WEEKLY COMPLETION CHART</span>
            </div>
            <p className="text-sm text-slate-500 font-mono">
              Spot peaks and quieter weeks to plan your sprints.
            </p>
          </div>
        </div>

        <div className="h-72 border border-dashed border-border-default bg-surface-base p-4 rounded-sm">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompleted} margin={{ top: 10, right: 12, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                <XAxis dataKey="weekLabel" tick={{ fontSize: 11, fontFamily: "monospace" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fontFamily: "monospace" }} />
                <Tooltip
                  cursor={{ fill: "rgba(0, 71, 171, 0.08)" }}
                  contentStyle={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    borderRadius: "2px",
                    border: "1px solid var(--border-default)"
                  }}
                />
                <Bar dataKey="completedCount" fill="#0047AB" radius={[2, 2, 0, 0]} />
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
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
  };

  return (
    <article className="bento-card p-5 transition hover:border-primary">
      <div className="flex items-center justify-between mb-3">
        <span className="label-tech">{title}</span>
        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded-sm ${toneStyles[tone]}`}>
          LIVE
        </span>
      </div>
      <p className="text-3xl font-mono font-bold text-slate-900">{stat}</p>
      <p className="text-xs text-slate-500 font-mono mt-2">{hint}</p>
    </article>
  );
}

function EmptyChartState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <span className="text-sm font-bold text-slate-700">NO_DATA_AVAILABLE</span>
      <p className="max-w-sm text-center text-xs font-mono text-slate-500">
        Finish a few tasks this week to unlock trend lines. Completed items appear here automatically.
      </p>
    </div>
  );
}

function StatsHeaderSkeleton() {
  return (
    <header>
      <div className="h-8 w-72 animate-pulse rounded-sm bg-slate-200" />
      <div className="mt-3 h-4 w-96 animate-pulse rounded-sm bg-slate-100" />
    </header>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bento-card p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-24 animate-pulse rounded-sm bg-slate-200" />
            <div className="h-4 w-10 animate-pulse rounded-sm bg-slate-100" />
          </div>
          <div className="h-8 w-20 animate-pulse rounded-sm bg-slate-200 mt-2" />
          <div className="h-3 w-full animate-pulse rounded-sm bg-slate-100 mt-3" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <section className="bento-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="h-3 w-40 animate-pulse rounded-sm bg-slate-200 mb-2" />
          <div className="h-3 w-64 animate-pulse rounded-sm bg-slate-100" />
        </div>
      </div>
      <div className="h-72 border border-dashed border-border-default bg-surface-base p-4 rounded-sm animate-pulse" />
    </section>
  );
}
