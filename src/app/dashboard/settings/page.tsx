"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import BackToDashboardLink from "@/components/BackToDashboardLink";

const notificationChannels = [
  { key: "emailNotifications", label: "Email summaries", description: "Daily focus reports and reminders" },
  { key: "pushNotifications", label: "Push notifications", description: "Session nudges and timer alerts" },
  { key: "weeklyDigest", label: "Weekly digest", description: "Highlights from tasks, stats, and reviews" },
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingTimers, setIsSavingTimers] = useState(false);
  const [notificationFeedback, setNotificationFeedback] = useState<Feedback | null>(null);
  const [timerFeedback, setTimerFeedback] = useState<Feedback | null>(null);
  const [themeFeedback, setThemeFeedback] = useState<Feedback | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      setIsLoading(true);
      setLoadError(null);
      setNotificationFeedback(null);
      setTimerFeedback(null);
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
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchPreferences();

    return () => {
      isMounted = false;
    };
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
    setNotifications((prev) => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const handleTimerChange = (key: keyof TimerState) => (event: ChangeEvent<HTMLInputElement>) => {
    setTimerFeedback(null);
    setTimers((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNotifications: notifications.emailNotifications,
          pushNotifications: notifications.pushNotifications,
          weeklyDigest: notifications.weeklyDigest,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update notifications.");
      }

      const preference = (payload.preference ?? {}) as PreferenceResponse["preference"];
      const nextState: NotificationState = {
        emailNotifications: preference.emailNotifications ?? notifications.emailNotifications,
        pushNotifications: preference.pushNotifications ?? notifications.pushNotifications,
        weeklyDigest: preference.weeklyDigest ?? notifications.weeklyDigest,
      };

      setNotifications(nextState);
      setNotificationBaseline({ ...nextState });
      setNotificationFeedback({ type: "success", message: "Notification preferences saved." });
    } catch (error) {
      setNotificationFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to update notifications right now.",
      });
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleTimersSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isTimerDirty) return;

    const parsedFocus = Math.round(Number(timers.focusDurationMinutes));
    const parsedShort = Math.round(Number(timers.shortBreakMinutes));
    const parsedLong = Math.round(Number(timers.longBreakMinutes));

    const invalidFocus =
      !Number.isFinite(parsedFocus) || parsedFocus < TIMER_LIMITS.focus.min || parsedFocus > TIMER_LIMITS.focus.max;
    const invalidShort =
      !Number.isFinite(parsedShort) || parsedShort < TIMER_LIMITS.shortBreak.min || parsedShort > TIMER_LIMITS.shortBreak.max;
    const invalidLong =
      !Number.isFinite(parsedLong) || parsedLong < TIMER_LIMITS.longBreak.min || parsedLong > TIMER_LIMITS.longBreak.max;

    if (invalidFocus || invalidShort || invalidLong) {
      setTimerFeedback({
        type: "error",
        message: "Please enter focus and break lengths within the allowed ranges.",
      });
      return;
    }

    setIsSavingTimers(true);
    setTimerFeedback(null);

    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          focusDurationMinutes: parsedFocus,
          shortBreakMinutes: parsedShort,
          longBreakMinutes: parsedLong,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save Pomodoro defaults.");
      }

      const preference = (payload.preference ?? {}) as PreferenceResponse["preference"];
      const nextState: TimerState = {
        focusDurationMinutes: toTimerString(preference.focusDurationMinutes, String(parsedFocus)),
        shortBreakMinutes: toTimerString(preference.shortBreakMinutes, String(parsedShort)),
        longBreakMinutes: toTimerString(preference.longBreakMinutes, String(parsedLong)),
      };

      setTimers(nextState);
      setTimerBaseline({ ...nextState });
      setTimerFeedback({ type: "success", message: "Pomodoro defaults saved." });
    } catch (error) {
      setTimerFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save Pomodoro defaults right now.",
      });
    } finally {
      setIsSavingTimers(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">Tune your Daily Focus workspace</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Adjust notifications, default timers, appearance, and workspace preferences to match how you plan, track, and ship work.
        </p>
      </header>

      {loadError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account information and security.</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Email address</span>
              <span className="mt-1 block text-sm text-gray-900 dark:text-gray-100">{session?.user?.email ?? "Not available"}</span>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Account type</span>
              <span className="mt-1 block text-sm text-gray-900 dark:text-gray-100">
                {session?.user?.image ? "Google Account" : "Email Account"}
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize how Daily Focus looks on your device.</p>
          </div>

          {themeFeedback && (
            <div
              role="status"
              aria-live="polite"
              className={clsx(
                "rounded-2xl border px-4 py-3 text-sm",
                themeFeedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
              )}
            >
              {themeFeedback.message}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Theme preference</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: "☀️" },
                { value: "dark", label: "Dark", icon: "🌙" },
                { value: "system", label: "System", icon: "💻" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value as "light" | "dark" | "system")}
                  disabled={isLoading}
                  className={clsx(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-60",
                    theme === option.value
                      ? "border-gray-900 bg-gray-50 dark:border-white dark:bg-gray-800"
                      : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/60",
                  )}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose when Daily Focus should keep you in the loop.</p>
          </div>

          {notificationFeedback && (
            <div
              role="status"
              aria-live="polite"
              className={clsx(
                "rounded-2xl border px-4 py-3 text-sm",
                notificationFeedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
              )}
            >
              {notificationFeedback.message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleNotificationsSubmit}>
            <div className="grid gap-4 md:grid-cols-3">
              {notificationChannels.map((channel) => (
                <label
                  key={channel.key}
                  className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm text-gray-700 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={notifications[channel.key]}
                    onChange={handleToggle(channel.key)}
                    disabled={isLoading || isSavingNotifications}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950"
                  />
                  <span>
                    <span className="block font-medium">{channel.label}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{channel.description}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {isLoading
                  ? "Loading your notification preferences..."
                  : isNotificationDirty
                  ? "You have unsaved notification changes."
                  : "All notification changes are saved."}
              </span>
              <button
                type="submit"
                disabled={!isNotificationDirty || isSavingNotifications || isLoading}
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:translate-y-0 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
              >
                {isSavingNotifications ? "Saving..." : "Update notifications"}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pomodoro defaults</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set baseline focus and break lengths for new sessions.</p>
          </div>

          {timerFeedback && (
            <div
              role="status"
              aria-live="polite"
              className={clsx(
                "rounded-2xl border px-4 py-3 text-sm",
                timerFeedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
              )}
            >
              {timerFeedback.message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleTimersSubmit}>
            <div className="grid gap-6 text-sm text-gray-700 dark:text-gray-200 md:grid-cols-3">
              <label className="flex flex-col gap-2">
                <span className="font-medium">Focus duration (minutes)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={TIMER_LIMITS.focus.min}
                  max={TIMER_LIMITS.focus.max}
                  value={timers.focusDurationMinutes}
                  onChange={handleTimerChange("focusDurationMinutes")}
                  disabled={isLoading || isSavingTimers}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {TIMER_LIMITS.focus.min}-{TIMER_LIMITS.focus.max} minutes
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-medium">Short break (minutes)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={TIMER_LIMITS.shortBreak.min}
                  max={TIMER_LIMITS.shortBreak.max}
                  value={timers.shortBreakMinutes}
                  onChange={handleTimerChange("shortBreakMinutes")}
                  disabled={isLoading || isSavingTimers}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {TIMER_LIMITS.shortBreak.min}-{TIMER_LIMITS.shortBreak.max} minutes
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-medium">Long break (minutes)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={TIMER_LIMITS.longBreak.min}
                  max={TIMER_LIMITS.longBreak.max}
                  value={timers.longBreakMinutes}
                  onChange={handleTimerChange("longBreakMinutes")}
                  disabled={isLoading || isSavingTimers}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {TIMER_LIMITS.longBreak.min}-{TIMER_LIMITS.longBreak.max} minutes
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {isLoading
                  ? "Loading your Pomodoro defaults..."
                  : isTimerDirty
                  ? "You have unsaved Pomodoro defaults."
                  : "All Pomodoro defaults are saved."}
              </span>
              <button
                type="submit"
                disabled={!isTimerDirty || isSavingTimers || isLoading}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/40 disabled:cursor-not-allowed disabled:text-gray-400 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
              >
                {isSavingTimers ? "Saving..." : "Save timer defaults"}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Privacy & Data</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data and account privacy settings.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 dark:border-gray-800 dark:bg-gray-900/60">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Export your data</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Download a copy of all your tasks, sessions, and preferences.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300/40 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900"
              >
                Export data
              </button>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50/70 p-6 dark:border-red-900/40 dark:bg-red-900/20">
              <h3 className="font-medium text-red-900 dark:text-red-100">Delete account</h3>
              <p className="mt-2 text-sm text-red-700 dark:text-red-200">
                Permanently remove your account and all associated data.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
              >
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
