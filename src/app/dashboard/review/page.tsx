"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";
import { format, parseISO } from "date-fns";
import BackToDashboardLink from "@/components/BackToDashboardLink";

type CompletedTask = {
  id: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  updatedAt: string;
};

type WeeklyPoint = {
  date: string;
  focusSeconds: number;
  focusMinutes: number;
  pomodoros: number;
  completedCount: number;
};

type ReviewSummary = {
  date: string;
  completedToday: CompletedTask[];
  completedTodayCount: number;
  focusTodaySeconds: number;
  focusTodayPomodoros: number;
  weeklySeries: WeeklyPoint[];
};

type JournalState = {
  wins: string;
  blockers: string;
  goals: string;
};

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

const emptyJournal: JournalState = { wins: "", blockers: "", goals: "" };

export default function ReviewPage() {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [journal, setJournal] = useState<JournalState>(emptyJournal);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/review/summary");
        if (!res.ok) {
          throw new Error("Unable to load review summary");
        }
        const data = (await res.json()) as ReviewSummary;
        setSummary(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const journalStorageKey = summary ? `daily-focus-journal-${summary.date}` : null;

  useEffect(() => {
    if (!journalStorageKey) return;
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(journalStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as JournalState;
        setJournal(parsed);
      } catch {
        setJournal(emptyJournal);
      }
    } else {
      setJournal(emptyJournal);
    }
  }, [journalStorageKey]);

  useEffect(() => {
    if (!journalStorageKey) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(journalStorageKey, JSON.stringify(journal));
  }, [journal, journalStorageKey]);

  const focusTodayMinutes = summary ? Math.round(summary.focusTodaySeconds / 60) : 0;

  const averageFocusMinutes = useMemo(() => {
    if (!summary || summary.weeklySeries.length === 0) return 0;
    const total = summary.weeklySeries.reduce((acc, point) => acc + point.focusMinutes, 0);
    return Math.round(total / summary.weeklySeries.length);
  }, [summary]);

  const chartData = useMemo(() => {
    if (!summary) return [];
    return summary.weeklySeries.map((point) => {
      const label = format(parseISO(point.date), "EEE");
      return {
        ...point,
        label,
      };
    });
  }, [summary]);

  const topFocusDays = useMemo(() => {
    if (!summary) return [];
    return [...summary.weeklySeries]
      .filter((point) => point.focusSeconds > 0)
      .sort((a, b) => b.focusSeconds - a.focusSeconds)
      .slice(0, 3);
  }, [summary]);

  const improvementPrompts = useMemo(() => {
    if (!summary) return [];
    const prompts: string[] = [];
    if (focusTodayMinutes < averageFocusMinutes) {
      prompts.push("Plan one extra deep-work block tomorrow to beat your weekly average.");
    } else {
      prompts.push("Keep the momentum by reserving a similar deep-work block tomorrow.");
    }

    if (summary.completedTodayCount === 0) {
      prompts.push("Pick a quick win task tonight so you can start tomorrow with a completion boost.");
    }

    const topTaskDay = [...summary.weeklySeries].sort((a, b) => b.completedCount - a.completedCount)[0];
    if (topTaskDay?.completedCount) {
      const dayName = format(parseISO(topTaskDay.date), "EEEE");
      prompts.push(`You complete the most tasks on ${dayName}. Mirror that routine for tomorrow's plan.`);
    }

    return prompts.slice(0, 3);
  }, [summary, focusTodayMinutes, averageFocusMinutes]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-8">
          <BackToDashboardLink />

          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
              Review dashboard
            </p>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reflect and reset</h1>
            <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              Review how you spent your focus today, celebrate progress, and capture quick notes before the next sprint.
            </p>
          </header>

          {loading && <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">Loading your latest progress…</div>}
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200">
              {error}
            </div>
          )}

          {summary && !loading && !error && (
            <>
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daily recap</h2>
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                      Completed {summary.completedTodayCount}
                    </span>
                  </div>
                  {summary.completedTodayCount === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No tasks marked complete today. Capture a quick win for tomorrow.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {summary.completedToday.slice(0, 5).map((task) => (
                        <li key={task.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
                          <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                          {task.description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{task.description}</p>}
                          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                            Done at {format(parseISO(task.updatedAt), "HH:mm")}
                          </p>
                        </li>
                      ))}
                      {summary.completedTodayCount > 5 && (
                        <li className="text-xs font-medium text-gray-500 dark:text-gray-400">+ {summary.completedTodayCount - 5} more completed items</li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="flex h-full flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Focus energy</h2>
                  <div className="flex flex-1 flex-col justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-800/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
                      Deep work time
                    </p>
                    <p className="mt-3 text-5xl font-bold text-gray-900 dark:text-white">{formatMinutes(focusTodayMinutes)}</p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {summary.focusTodayPomodoros} pomodoro block{summary.focusTodayPomodoros === 1 ? "" : "s"} logged today
                    </p>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-200 px-4 py-3 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    <span>Average this week</span>
                    <span>{formatMinutes(averageFocusMinutes)}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly trends</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Track how focus minutes and completed tasks stacked up during the last seven days.</p>
                  </div>
                </div>
                <div className="mt-6 h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                      <XAxis dataKey="label" />
                      <YAxis yAxisId="left" allowDecimals={false} />
                      <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: "#0f172a", borderRadius: 16, border: "none", color: "#f8fafc" }}
                        labelFormatter={(label) => `Day: ${label}`}
                        formatter={(value: number, name) => {
                          if (name === "focusMinutes") return [`${value} min`, "Focus"];
                          if (name === "completedCount") return [value, "Tasks"];
                          return [value, name];
                        }}
                      />
                      <Bar yAxisId="left" dataKey="focusMinutes" fill="#6366F1" radius={[12, 12, 4, 4]} />
                      <Line yAxisId="right" type="monotone" dataKey="completedCount" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Top focus days</h3>
                    {topFocusDays.length === 0 ? (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">No tracked focus blocks this week yet.</p>
                    ) : (
                      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                        {topFocusDays.map((day) => (
                          <li key={day.date} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900/70">
                            <span>{format(parseISO(day.date), "EEEE")}</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-300">{formatMinutes(day.focusMinutes)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/60">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Improvement prompts</h3>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {improvementPrompts.map((prompt) => (
                        <li key={prompt} className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900/70">
                          {prompt}
                        </li>
                      ))}
                      {improvementPrompts.length === 0 && (
                        <li className="text-xs text-gray-500 dark:text-gray-400">Data is still coming in. Log a few sessions to unlock tailored suggestions.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Journaling prompts</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Capture quick reflections. Notes stay on this device.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  {[
                    { key: "wins", label: "What went well?", placeholder: "Celebrate progress, even tiny wins." },
                    { key: "blockers", label: "Where did you get stuck?", placeholder: "Call out blockers so you can clear them tomorrow." },
                    { key: "goals", label: "What's next?", placeholder: "Set one intention to start your next focus block strong." },
                  ].map((field) => (
                    <label key={field.key} className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{field.label}</span>
                      <textarea
                        value={journal[field.key as keyof JournalState]}
                        onChange={(event) =>
                          setJournal((prev) => ({
                            ...prev,
                            [field.key]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        rows={5}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
