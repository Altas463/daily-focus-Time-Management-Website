"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import { Save, Bell, Clock, Shield, Palette, Smartphone, Mail, Calendar } from "lucide-react";

const notificationChannels = [
  { key: "emailNotifications", label: "Email Summaries", description: "Daily focus reports and reminders", icon: Mail },
  { key: "pushNotifications", label: "Push Notifications", description: "Session nudges and timer alerts", icon: Smartphone },
  { key: "weeklyDigest", label: "Weekly Digest", description: "Highlights from tasks, stats, and reviews", icon: Calendar },
] as const;

type NotificationKey = typeof notificationChannels[number]["key"];
type NotificationState = Record<NotificationKey, boolean>;

type TimerState = {
  focusDurationMinutes: string;
  shortBreakMinutes: string;
  longBreakMinutes: string;
};

type PreferenceResponse = {
  preference: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyDigest?: boolean;
    focusDurationMinutes?: number;
    shortBreakMinutes?: number;
    longBreakMinutes?: number;
  };
  user?: {
    email?: string | null;
  };
};

type Feedback = { type: "success" | "error"; message: string };

const DEFAULT_NOTIFICATIONS: NotificationState = {
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: true,
};

const DEFAULT_TIMERS: TimerState = {
  focusDurationMinutes: "25",
  shortBreakMinutes: "5",
  longBreakMinutes: "15",
};

const TIMER_LIMITS = {
  focus: { min: 10, max: 90 },
  shortBreak: { min: 2, max: 30 },
  longBreak: { min: 5, max: 60 },
};

const toTimerString = (value: number | undefined, fallback: string) =>
  typeof value === "number" && Number.isFinite(value) ? String(value) : fallback;

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationState>({ ...DEFAULT_NOTIFICATIONS });
  const [notificationBaseline, setNotificationBaseline] = useState<NotificationState>({ ...DEFAULT_NOTIFICATIONS });
  const [timers, setTimers] = useState<TimerState>({ ...DEFAULT_TIMERS });
  const [timerBaseline, setTimerBaseline] = useState<TimerState>({ ...DEFAULT_TIMERS });
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingTimers, setIsSavingTimers] = useState(false);
  const [notificationFeedback, setNotificationFeedback] = useState<Feedback | null>(null);
  const [timerFeedback, setTimerFeedback] = useState<Feedback | null>(null);
  const [themeFeedback, setThemeFeedback] = useState<Feedback | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      setLoadError(null);
      try {
        const response = await fetch("/api/preferences", { cache: "no-store" });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.error ?? "Unable to load preferences.");
        }

        const payload = (await response.json()) as PreferenceResponse;
        if (!isMounted) return;
        const preference = payload.preference ?? {};

        const nextNotifications: NotificationState = {
          emailNotifications: preference.emailNotifications ?? DEFAULT_NOTIFICATIONS.emailNotifications,
          pushNotifications: preference.pushNotifications ?? DEFAULT_NOTIFICATIONS.pushNotifications,
          weeklyDigest: preference.weeklyDigest ?? DEFAULT_NOTIFICATIONS.weeklyDigest,
        };

        const nextTimers: TimerState = {
          focusDurationMinutes: toTimerString(preference.focusDurationMinutes, DEFAULT_TIMERS.focusDurationMinutes),
          shortBreakMinutes: toTimerString(preference.shortBreakMinutes, DEFAULT_TIMERS.shortBreakMinutes),
          longBreakMinutes: toTimerString(preference.longBreakMinutes, DEFAULT_TIMERS.longBreakMinutes),
        };

        setNotifications(nextNotifications);
        setNotificationBaseline({ ...nextNotifications });
        setTimers(nextTimers);
        setTimerBaseline({ ...nextTimers });

        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error instanceof Error ? error.message : "Something went wrong while loading settings.");
      }
    }

    void fetchPreferences();
    return () => { isMounted = false; };
  }, []);

  const isNotificationDirty = useMemo(
    () => notificationChannels.some((channel) => notifications[channel.key] !== notificationBaseline[channel.key]),
    [notifications, notificationBaseline],
  );

  const isTimerDirty = useMemo(
    () =>
      timers.focusDurationMinutes !== timerBaseline.focusDurationMinutes ||
      timers.shortBreakMinutes !== timerBaseline.shortBreakMinutes ||
      timers.longBreakMinutes !== timerBaseline.longBreakMinutes,
    [timers, timerBaseline],
  );

  const handleToggle = (key: NotificationKey) => (event: ChangeEvent<HTMLInputElement>) => {
    setNotificationFeedback(null);
    setNotifications((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleTimerChange = (key: keyof TimerState) => (event: ChangeEvent<HTMLInputElement>) => {
    setTimerFeedback(null);
    setTimers((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
    setThemeFeedback({ type: "success", message: "Theme preference updated." });
    setTimeout(() => setThemeFeedback(null), 3000);
  };

  const handleNotificationsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNotificationDirty) return;
    setIsSavingNotifications(true);
    setNotificationFeedback(null);
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications: notifications.emailNotifications,
          pushNotifications: notifications.pushNotifications,
          weeklyDigest: notifications.weeklyDigest,
        }),
      });
      if (!response.ok) throw new Error("Unable to update notifications.");
      setNotificationBaseline({ ...notifications });
      setNotificationFeedback({ type: "success", message: "Notification preferences saved." });
    } catch {
      setNotificationFeedback({ type: "error", message: "Unable to update notifications." });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleTimersSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isTimerDirty) return;
    setIsSavingTimers(true);
    setTimerFeedback(null);
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focusDurationMinutes: Number(timers.focusDurationMinutes),
          shortBreakMinutes: Number(timers.shortBreakMinutes),
          longBreakMinutes: Number(timers.longBreakMinutes),
        }),
      });
      if (!response.ok) throw new Error("Unable to save timer defaults.");
      setTimerBaseline({ ...timers });
      setTimerFeedback({ type: "success", message: "Timer defaults saved." });
    } catch {
      setTimerFeedback({ type: "error", message: "Unable to save timer defaults." });
    } finally {
      setIsSavingTimers(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">System Configuration</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Workspace Settings</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Configure your environment, notifications, and timer defaults."}</p>
      </header>

      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-mono">
          ERROR: {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account Security */}
          <section className="bento-card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="label-tech">ACCOUNT SECURITY</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-surface-panel border border-border-subtle rounded-sm">
                <span className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Identity</span>
                <span className="block font-mono text-xs font-bold text-slate-700">{session?.user?.email ?? "UNKNOWN_USER"}</span>
              </div>
              <div className="p-3 bg-surface-panel border border-border-subtle rounded-sm">
                <span className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Auth Method</span>
                <span className="block font-mono text-xs font-bold text-slate-700">
                  {session?.user?.image ? "OAUTH_PROVIDER_GOOGLE" : "STANDARD_CREDENTIALS"}
                </span>
              </div>
            </div>
          </section>

          {/* Interface Theme */}
          <section className="bento-card p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-primary" />
              <span className="label-tech">INTERFACE THEME</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", label: "LIGHT", icon: "☀️" },
                { value: "dark", label: "DARK", icon: "🌙" },
                { value: "system", label: "AUTO", icon: "💻" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value as "light" | "dark" | "system")}
                  className={clsx(
                    "flex flex-col items-center gap-2 p-3 border rounded-sm transition-all",
                    theme === option.value
                      ? "bg-primary/5 border-primary text-primary"
                      : "bg-surface-panel border-border-subtle text-slate-500 hover:border-slate-400"
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-[10px] font-mono font-bold">{option.label}</span>
                </button>
              ))}
            </div>
            {themeFeedback && (
              <div className="text-[10px] font-mono text-emerald-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                {themeFeedback.message}
              </div>
            )}
          </section>

        </div>

        {/* Right Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Notification Protocols */}
          <section className="bento-card">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-4 h-4 text-primary" />
              <span className="label-tech">NOTIFICATION PROTOCOLS</span>
            </div>

            <form onSubmit={handleNotificationsSubmit}>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {notificationChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <label
                      key={channel.key}
                      className={clsx(
                        "flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all group",
                        notifications[channel.key]
                          ? "bg-surface-panel border-primary/50"
                          : "bg-surface-base border-border-subtle hover:border-slate-400"
                      )}
                    >
                      <div className={clsx("mt-0.5 p-1.5 rounded-sm", notifications[channel.key] ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400")}>
                         <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="block text-sm font-bold text-slate-700">{channel.label}</span>
                          <input
                            type="checkbox"
                            checked={notifications[channel.key]}
                            onChange={handleToggle(channel.key)}
                            className="w-4 h-4 text-primary border-border-default rounded-sm focus:ring-primary"
                          />
                        </div>
                        <span className="block text-xs text-slate-500 mt-1 font-mono">{channel.description}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex justify-end border-t border-border-subtle pt-4">
                <button
                  type="submit"
                  disabled={!isNotificationDirty || isSavingNotifications}
                  className="btn-tech-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingNotifications ? "SAVING..." : "UPDATE PROTOCOLS"}
                  <Save className="w-4 h-4" />
                </button>
              </div>
              {notificationFeedback && (
                <div className="mt-2 text-right text-xs font-mono text-emerald-600">
                  {notificationFeedback.message}
                </div>
              )}
            </form>
          </section>

          {/* Timer Calibration */}
          <section className="bento-card">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-primary" />
              <span className="label-tech">TIMER CALIBRATION</span>
            </div>

            <form onSubmit={handleTimersSubmit}>
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                {[
                  { key: "focusDurationMinutes", label: "FOCUS DURATION", limits: TIMER_LIMITS.focus },
                  { key: "shortBreakMinutes", label: "SHORT BREAK", limits: TIMER_LIMITS.shortBreak },
                  { key: "longBreakMinutes", label: "LONG BREAK", limits: TIMER_LIMITS.longBreak },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{item.label}</label>
                    <div className="relative group">
                      <input
                        type="number"
                        value={timers[item.key as keyof TimerState]}
                        onChange={handleTimerChange(item.key as keyof TimerState)}
                        className="w-full bg-surface-base border border-border-subtle rounded-sm px-4 py-3 font-mono text-xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all group-hover:border-slate-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 font-bold">MIN</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      RANGE: {item.limits.min}-{item.limits.max} MIN
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-border-subtle pt-4">
                <button
                  type="submit"
                  disabled={!isTimerDirty || isSavingTimers}
                  className="btn-tech-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingTimers ? "SAVING..." : "CALIBRATE TIMERS"}
                  <Save className="w-4 h-4" />
                </button>
              </div>
              {timerFeedback && (
                <div className="mt-2 text-right text-xs font-mono text-emerald-600">
                  {timerFeedback.message}
                </div>
              )}
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
