"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import { User, Shield, Key, Mail } from "lucide-react";

type PreferenceResponse = {
  preference: {
    displayName: string | null;
    role: string | null;
    bio: string | null;
  };
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
        setUserEmail(payload.user?.email ?? null);
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">User Profile</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Workspace Identity</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Manage your digital presence and role within the workspace."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Identity Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-surface-panel border-2 border-border-subtle flex items-center justify-center mb-4 relative overflow-hidden group">
               <User className="w-10 h-10 text-slate-400" />
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <span className="text-[10px] font-mono font-bold text-white uppercase">Change</span>
               </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {formState.displayName || "Anonymous User"}
            </h2>
            <p className="text-sm font-mono text-slate-500 mb-4">
              {formState.role || "No role set"}
            </p>

            <div className="w-full pt-4 border-t border-border-subtle space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{userEmail || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="font-mono">Standard Access</span>
              </div>
            </div>
          </div>

          <div className="bento-card p-4 space-y-3">
             <div className="flex items-center gap-2 mb-2">
               <Key className="w-4 h-4 text-primary" />
               <span className="label-tech">ACCOUNT SECURITY</span>
             </div>
             <button className="w-full text-left px-3 py-2 text-xs font-mono border border-border-subtle rounded-sm hover:border-primary hover:text-primary transition-colors">
               Change Password
             </button>
             <button className="w-full text-left px-3 py-2 text-xs font-mono border border-border-subtle rounded-sm hover:border-primary hover:text-primary transition-colors">
               Two-Factor Auth
             </button>
          </div>
        </div>

        {/* Right Column: Edit Form (8 Cols) */}
        <div className="lg:col-span-8">
          <section className="bento-card h-full">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="label-tech">PUBLIC PROFILE</span>
              </div>
              <p className="text-sm text-slate-500 font-mono">Update your name, headline, and bio.</p>
            </div>

            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={clsx(
                  "mb-6 p-4 text-sm font-mono rounded-sm border",
                  feedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-red-50 border-red-200 text-red-600",
                )}
              >
                {feedback.type === "success" ? "SUCCESS: " : "ERROR: "}{feedback.message}
              </div>
            )}

            <form
              id="profile-form"
              className="grid gap-6 md:grid-cols-2"
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Display Name</span>
                <input
                  type="text"
                  name="displayName"
                  placeholder="Jane Doe"
                  value={formState.displayName}
                  onChange={handleChange("displayName")}
                  disabled={isLoading || isSaving}
                  className="bg-surface-base border border-border-subtle rounded-sm px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Role / Focus Area</span>
                <input
                  type="text"
                  name="role"
                  placeholder="Product design student"
                  value={formState.role}
                  onChange={handleChange("role")}
                  disabled={isLoading || isSaving}
                  className="bg-surface-base border border-border-subtle rounded-sm px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <label className="md:col-span-2 flex flex-col gap-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">About You</span>
                <textarea
                  name="bio"
                  rows={6}
                  placeholder="Share a short introduction for collaborators."
                  value={formState.bio}
                  onChange={handleChange("bio")}
                  disabled={isLoading || isSaving}
                  className="resize-none bg-surface-base border border-border-subtle rounded-sm px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>

              <div className="md:col-span-2 flex items-center gap-3 text-xs font-mono text-slate-400">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                    LOADING_PROFILE...
                  </span>
                ) : (
                  <span>{isDirty ? "STATUS: UNSAVED_CHANGES" : "STATUS: ALL_SAVED"}</span>
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border-subtle">
              <button
                type="submit"
                form="profile-form"
                disabled={!isDirty || isSaving || isLoading}
                className="btn-tech-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                type="button"
                disabled={!isDirty || isSaving || isLoading}
                onClick={handleReset}
                className="btn-tech-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                RESET
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
