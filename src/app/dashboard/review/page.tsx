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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Daily Review</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Reflect and reset</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Review focus patterns, celebrate progress, and capture notes before the next sprint."}</p>
      </header>

      {loading && (
        <div className="bento-card p-6">
          <span className="text-sm font-mono text-slate-500">LOADING_REVIEW_DATA...</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-mono">
          ERROR: {error}
        </div>
      )}

      {summary && !loading && !error && (
        <>
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bento-card">
              <div className="flex items-center justify-between mb-4">
                <span className="label-tech">DAILY RECAP</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold border rounded-sm bg-emerald-50 text-emerald-600 border-emerald-200">
                  {summary.completedTodayCount} DONE
                </span>
              </div>
              {summary.completedTodayCount === 0 ? (
                <p className="text-sm text-slate-500 font-mono">
                  No tasks marked complete today. Capture a quick win for tomorrow.
                </p>
              ) : (
                <ul className="space-y-3">
                  {summary.completedToday.slice(0, 5).map((task) => (
                    <li key={task.id} className="p-3 bg-surface-base border border-border-subtle rounded-sm">
                      <p className="font-mono text-sm font-bold text-slate-800">{task.title}</p>
                      {task.description && <p className="mt-1 text-xs text-slate-500 font-mono line-clamp-2">{task.description}</p>}
                      <p className="mt-2 text-[10px] text-slate-400 font-mono uppercase">
                        COMPLETED @ {format(parseISO(task.updatedAt), "HH:mm")}
                      </p>
                    </li>
                  ))}
                  {summary.completedTodayCount > 5 && (
                    <li className="text-xs font-mono text-slate-500">+ {summary.completedTodayCount - 5} more completed items</li>
                  )}
                </ul>
              )}
            </div>

            <div className="bento-card flex flex-col">
              <span className="label-tech mb-4">FOCUS ENERGY</span>
              <div className="flex-1 flex flex-col justify-center p-6 bg-surface-base border border-border-subtle rounded-sm text-center">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Deep work time
                </p>
                <p className="mt-3 text-4xl font-mono font-bold text-slate-900">{formatMinutes(focusTodayMinutes)}</p>
                <p className="mt-2 text-xs text-slate-500 font-mono">
                  {summary.focusTodayPomodoros} pomodoro block{summary.focusTodayPomodoros === 1 ? "" : "s"} logged today
                </p>
              </div>
              <div className="flex items-center justify-between mt-4 px-4 py-3 border border-dashed border-border-default rounded-sm text-xs font-mono text-slate-600">
                <span>WEEKLY_AVG:</span>
                <span className="font-bold">{formatMinutes(averageFocusMinutes)}</span>
              </div>
            </div>
          </section>

          <section className="bento-card">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="label-tech">WEEKLY TRENDS</span>
                </div>
                <p className="text-sm text-slate-500 font-mono">
                  Track how focus minutes and completed tasks stacked up during the last seven days.
                </p>
              </div>
            </div>
            <div className="h-72 border border-dashed border-border-default bg-surface-base p-4 rounded-sm">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 11, fontFamily: "monospace" }} />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      borderRadius: "2px",
                      border: "1px solid var(--border-default)"
                    }}
                    labelFormatter={(label) => `Day: ${label}`}
                    formatter={(value: number, name) => {
                      if (name === "focusMinutes") return [`${value} min`, "Focus"];
                      if (name === "completedCount") return [value, "Tasks"];
                      return [value, name];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="focusMinutes" fill="#0047AB" radius={[2, 2, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="completedCount" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="p-4 bg-surface-base border border-border-subtle rounded-sm">
                <span className="label-tech">TOP FOCUS DAYS</span>
                {topFocusDays.length === 0 ? (
                  <p className="mt-3 text-xs text-slate-500 font-mono">No tracked focus blocks this week yet.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {topFocusDays.map((day) => (
                      <li key={day.date} className="flex items-center justify-between px-3 py-2 border border-border-subtle rounded-sm bg-white">
                        <span className="text-sm font-mono text-slate-700">{format(parseISO(day.date), "EEEE")}</span>
                        <span className="font-mono font-bold text-primary">{formatMinutes(day.focusMinutes)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-4 bg-surface-base border border-border-subtle rounded-sm">
                <span className="label-tech">IMPROVEMENT PROMPTS</span>
                <ul className="mt-3 space-y-2">
                  {improvementPrompts.map((prompt) => (
                    <li key={prompt} className="px-3 py-2 border border-border-subtle rounded-sm bg-white text-sm font-mono text-slate-700">
                      {prompt}
                    </li>
                  ))}
                  {improvementPrompts.length === 0 && (
                    <li className="text-xs text-slate-500 font-mono">Data is still coming in. Log a few sessions to unlock tailored suggestions.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section className="bento-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <span className="label-tech">JOURNALING PROMPTS</span>
                <p className="text-sm text-slate-500 font-mono mt-2">Capture quick reflections. Notes stay on this device.</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { key: "wins", label: "WHAT_WENT_WELL", placeholder: "Celebrate progress, even tiny wins." },
                { key: "blockers", label: "WHERE_GOT_STUCK", placeholder: "Call out blockers so you can clear them tomorrow." },
                { key: "goals", label: "WHATS_NEXT", placeholder: "Set one intention to start your next focus block strong." },
              ].map((field) => (
                <label key={field.key} className="flex flex-col gap-2 p-4 bg-surface-base border border-border-subtle rounded-sm">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{field.label}</span>
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
                    className="w-full resize-none bg-white border border-border-subtle rounded-sm px-3 py-2 font-mono text-sm text-slate-800 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  />
                </label>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
