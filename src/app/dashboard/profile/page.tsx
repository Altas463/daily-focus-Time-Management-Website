"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BackToDashboardLink from "@/components/BackToDashboardLink";

type PreferenceResponse = {
  preference: {
    displayName: string | null;
    role: string | null;
    bio: string | null;
  };
  user: {
    name: string | null;
  } | null;
};

type FormState = {
  displayName: string;
  role: string;
  bio: string;
};

const EMPTY_STATE: FormState = {
  displayName: "",
  role: "",
  bio: "",
};

export default function ProfilePage() {
  const [formState, setFormState] = useState<FormState>(EMPTY_STATE);
  const [initialState, setInitialState] = useState<FormState>(EMPTY_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPreferences() {
      setIsLoading(true);
      setFeedback(null);
      try {
        const response = await fetch("/api/preferences", { cache: "no-store" });
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          throw new Error(errorBody.error ?? "Unable to load profile preferences.");
        }

        const payload = (await response.json()) as PreferenceResponse;
        if (!isMounted) return;

        const nextState: FormState = {
          displayName: payload.preference.displayName ?? payload.user?.name ?? "",
          role: payload.preference.role ?? "",
          bio: payload.preference.bio ?? "",
        };

        setFormState(nextState);
        setInitialState({ ...nextState });
      } catch (error: unknown) {
        if (!isMounted) return;
        setFeedback({
          type: "error",
          message: error instanceof Error ? error.message : "Something went wrong while loading your profile.",
        });
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

  const isDirty = useMemo(
    () =>
      formState.displayName !== initialState.displayName ||
      formState.role !== initialState.role ||
      formState.bio !== initialState.bio,
    [formState, initialState],
  );

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: formState.displayName,
          role: formState.role,
          bio: formState.bio,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save profile changes.");
      }

      const nextState: FormState = {
        displayName: payload.preference?.displayName ?? payload.user?.name ?? "",
        role: payload.preference?.role ?? "",
        bio: payload.preference?.bio ?? "",
      };

      setFormState(nextState);
      setInitialState({ ...nextState });
      setFeedback({ type: "success", message: "Profile updated successfully." });
    } catch (error: unknown) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to save profile changes right now.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormState({ ...initialState });
    setFeedback(null);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">Your workspace identity</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Manage the information other teammates see, including your display name, avatar, and contact details.
        </p>
      </header>

      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Public profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your name, headline, and profile photo.</p>
        </div>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={clsx(
              "rounded-2xl border px-4 py-3 text-sm",
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
            )}
          >
            {feedback.message}
          </div>
        )}

        <form
          id="profile-form"
          className="grid gap-6 md:grid-cols-2"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">Display name</span>
            <input
              type="text"
              name="displayName"
              placeholder="Jane Doe"
              value={formState.displayName}
              onChange={handleChange("displayName")}
              disabled={isLoading || isSaving}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">Role or focus area</span>
            <input
              type="text"
              name="role"
              placeholder="Product design student"
              value={formState.role}
              onChange={handleChange("role")}
              disabled={isLoading || isSaving}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
            />
          </label>

          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">About you</span>
            <textarea
              name="bio"
              rows={4}
              placeholder="Share a short introduction for collaborators."
              value={formState.bio}
              onChange={handleChange("bio")}
              disabled={isLoading || isSaving}
              className="resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:disabled:bg-gray-900"
            />
          </label>

          <div className="md:col-span-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                Loading profile...
              </span>
            ) : (
              <span>{isDirty ? "You have unsaved changes." : "All changes are saved."}</span>
            )}
          </div>
        </form>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            form="profile-form"
            disabled={!isDirty || isSaving || isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:translate-y-0 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90 dark:disabled:bg-gray-700 dark:disabled:text-gray-300"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            disabled={!isDirty || isSaving || isLoading}
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300/40 disabled:cursor-not-allowed disabled:text-gray-400 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-700/40"
          >
            Reset
          </button>
        </div>
      </section>
    </div>
  );
}
