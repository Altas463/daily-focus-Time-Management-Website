"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import { formatShortDate } from "@/utils/date";

const accentPalette: Record<PersonaAccentToken, string> = {
  emerald: "#10b981",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
};

const taskStatusTone: Record<ProjectTaskStatusToken, string> = {
  todo: "bg-gray-300 dark:bg-gray-700",
  inProgress: "bg-sky-400/80 dark:bg-sky-500/80",
  review: "bg-purple-400/80 dark:bg-purple-500/70",
  done: "bg-emerald-400/80 dark:bg-emerald-500/70",
};

const templates: Template[] = [
  {
    id: "client-discovery",
    title: "Client discovery pack",
    summary: "Prep docs for new retainers or consulting engagements.",
    bestFor: "freelancer",
    highlights: ["Meeting notes", "Timeline draft", "Risk tracker"],
  },
  {
    id: "sprint-health",
    title: "Sprint health monitor",
    summary: "Track blockers and scope changes during active sprints.",
    bestFor: "developer",
    highlights: ["Health checks", "Velocity signals", "Retro prep"],
  },
  {
    id: "capstone",
    title: "Capstone planning",
    summary: "Organise deliverables, research, and advisor touchpoints.",
    bestFor: "student",
    highlights: ["Advisor syncs", "Research log", "Milestone checklist"],
  },
  {
    id: "all-hands",
    title: "Launch readiness",
    summary: "Cross-functional punch list for upcoming releases.",
    bestFor: "all",
    highlights: ["QA coverage", "Comms plan", "Support handoff"],
  },
];

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectBoardResponse | null>(null);
  const [activePersona, setActivePersona] = useState<PersonaKey>("student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBoard() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? "Unable to load project hub right now.");
        }

        const payload = (await response.json()) as ProjectBoardResponse;
        if (!isMounted) return;

        setData(payload);
      } catch (fetchError: unknown) {
        if (!isMounted) return;
        const message =
          fetchError instanceof Error ? fetchError.message : "Something went wrong while loading projects.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadBoard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const personaKeys = data.personas.map((persona) => persona.key);
    if (personaKeys.length === 0) return;
    if (!personaKeys.includes(activePersona)) {
      setActivePersona(personaKeys[0]);
    }
  }, [data, activePersona]);

  const personaOptions = data?.personas ?? [];
  const activePersonaDetails = personaOptions.find((persona) => persona.key === activePersona);

  const stats = data?.stats;
  const statCards = useMemo(() => {
    if (!stats) return [] as Array<{ label: string; value: string | number }>;
    const completionRate = stats.tasksTotal === 0 ? 0 : Math.round((stats.tasksCompleted / stats.tasksTotal) * 100);
    return [
      { label: "Active projects", value: stats.activeProjects },
      { label: "Total projects", value: stats.totalProjects },
      { label: "Tasks complete", value: `${stats.tasksCompleted}/${stats.tasksTotal}` },
      { label: "Completion rate", value: `${completionRate}%` },
    ];
  }, [stats]);

  const boardColumns = data?.board?.[activePersona] ?? [];
  const focusSuggestions = data?.focus ?? [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Project hub</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-50">Keep every initiative moving forward</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Switch personas to focus on the work that matters this week. Your board mirrors the data behind focus sessions,
              task lists, and delivery milestones.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {personaOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActivePersona(option.key)}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    activePersona === option.key
                      ? "border-gray-900 bg-gray-900 text-white shadow-sm dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                      : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-900/60",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {activePersonaDetails?.blurb && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{activePersonaDetails.blurb}</p>
            )}
          </div>

          <div className="grid flex-none grid-cols-2 gap-3 sm:grid-cols-4">
            {statCards.map((card) => (
              <StatCard key={card.label} label={card.label} value={card.value} />
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingBoard />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Focus suggestions</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    High-impact projects ranked by urgency, progress, and upcoming deadlines.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Auto curated</span>
              </header>

              <div className="space-y-3">
                {focusSuggestions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
                    Add a project or task to see personalised recommendations.
                  </div>
                ) : (
                  focusSuggestions.map((suggestion) => <FocusSuggestionCard key={suggestion.projectId} suggestion={suggestion} />)
                )}
              </div>
            </article>

            <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delivery radar</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming hand-offs and deadlines pulled from your board.</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">This week</span>
              </header>

              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {focusSuggestions.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-400">
                    Nothing queued up—great time to plan the next milestone.
                  </li>
                ) : (
                  focusSuggestions.slice(0, 4).map((item) => (
                    <li key={item.projectId} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60">
                      <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: accentPalette[item.accent] }} aria-hidden />
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.title}</span>
                        <span className="text-xs uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">{item.stage}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.dueLabel}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </article>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Board overview</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Columns reflect how you categorise the work. Drill into cards to see the tasks tied to each outcome.
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">{boardColumns.length} columns</span>
            </header>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {boardColumns.map((column) => (
                <ProjectColumn key={column.id} column={column} />
              ))}

              {boardColumns.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
                  No projects yet—start by creating a column that matches how you track work.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Project templates</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Optional blueprints to spin up consistent project groups faster.</p>
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
                Designed for power users switching from workspace tools
              </span>
            </header>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {templates
                .filter((template) => template.bestFor === "all" || template.bestFor === activePersona)
                .map((template) => (
                  <article
                    key={template.id}
                    className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{template.title}</h3>
                      <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:border-gray-700 dark:text-gray-300">
                        {template.bestFor === "all" ? "All" : template.bestFor}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{template.summary}</p>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                      {template.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function LoadingBoard() {
  return (
    <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-4 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
      </div>
      <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-4 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800/60" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
      {message}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5 text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">{label}</span>
      <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}

function FocusSuggestionCard({ suggestion }: { suggestion: FocusSuggestion }) {
  return (
    <article className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/60">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: accentPalette[suggestion.accent] }}
      >
        {suggestion.title
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0]?.toUpperCase())
          .join("")}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{suggestion.title}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">{suggestion.stage}</p>
          </div>
          <FocusPriorityBadge priority={suggestion.priority} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{suggestion.summary}</p>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{suggestion.dueLabel}</p>
      </div>
    </article>
  );
}

function FocusPriorityBadge({ priority }: { priority: FocusSuggestion["priority"] }) {
  const tone: Record<FocusSuggestion["priority"], string> = {
    "Critical focus": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
    "High focus": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
    "Worth a look": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
    "On track": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  };

  return (
    <span className={clsx("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]", tone[priority])}>{priority}</span>
  );
}

function ProjectColumn({ column }: { column: ProjectBoardColumn }) {
  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{column.title}</h3>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {column.projects.length}
          </span>
        </div>
        {column.description && <p className="text-xs text-gray-500 dark:text-gray-400">{column.description}</p>}
        {column.intent && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">{column.intent}</p>
        )}
      </header>

      <div className="space-y-4">
        {column.projects.map((project) => (
          <article key={project.id} className="space-y-4 rounded-2xl border border-white/60 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/60 dark:bg-gray-900">
            <div className="flex items-start gap-4">
              <ProjectProgressRing value={project.progress} accent={project.accent} />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{project.name}</h4>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                    {project.stage}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.dueDate ? `Due ${formatShortDate(new Date(project.dueDate))}` : "No due date"}
                  {project.focus ? ` | ${project.focus}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ul className="space-y-2">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-800 dark:text-gray-100">{task.label}</span>
                      <span className={clsx("h-2.5 w-2.5 rounded-full", taskStatusTone[task.status])} aria-hidden />
                    </div>
                    {task.context && <span className="text-xs text-gray-500 dark:text-gray-400">{task.context}</span>}
                  </li>
                ))}
              </ul>

              {project.notes && (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                  {project.notes}
                </div>
              )}
            </div>
          </article>
        ))}

        {column.projects.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-100 p-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
            No projects here yet.
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectProgressRing({ value, accent }: { value: number; accent: PersonaAccentToken }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const stroke = accentPalette[accent];

  return (
    <div className="relative h-16 w-16">
      <svg className="h-full w-full" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-semibold text-gray-900 dark:text-gray-100">
        {value}%
      </div>
    </div>
  );
}

// Type declarations --------------------------------------------------------

type PersonaKey = "student" | "freelancer" | "developer";

type ProjectTaskStatusToken = "todo" | "inProgress" | "review" | "done";

type PersonaAccentToken = "emerald" | "blue" | "purple" | "amber" | "rose";

type ProjectBoardTask = {
  id: string;
  label: string;
  status: ProjectTaskStatusToken;
  context: string | null;
};

type ProjectBoardCard = {
  id: string;
  name: string;
  stage: string;
  dueDate: string | null;
  progress: number;
  focus: string | null;
  notes: string | null;
  accent: PersonaAccentToken;
  tasks: ProjectBoardTask[];
};

type ProjectBoardColumn = {
  id: string;
  title: string;
  description: string | null;
  intent: string | null;
  projects: ProjectBoardCard[];
};

type FocusSuggestion = {
  projectId: string;
  title: string;
  summary: string;
  accent: PersonaAccentToken;
  score: number;
  stage: string;
  priority: "Critical focus" | "High focus" | "Worth a look" | "On track";
  dueLabel: string;
};

type ProjectBoardResponse = {
  personas: Array<{ key: PersonaKey; label: string; blurb: string }>;
  stats: {
    activeProjects: number;
    totalProjects: number;
    tasksCompleted: number;
    tasksTotal: number;
    upcomingDue: number;
    overdue: number;
  };
  board: Record<PersonaKey, ProjectBoardColumn[]>;
  focus: FocusSuggestion[];
};

type Template = {
  id: string;
  title: string;
  summary: string;
  bestFor: PersonaKey | "all";
  highlights: string[];
};
