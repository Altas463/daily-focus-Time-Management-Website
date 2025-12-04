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
  todo: "bg-slate-300",
  inProgress: "bg-primary",
  review: "bg-purple-500",
  done: "bg-emerald-500",
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Project Hub</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Keep every initiative moving forward</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Switch personas to focus on the work that matters this week."}</p>
      </header>

      <section className="bento-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {personaOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActivePersona(option.key)}
                  className={clsx(
                    "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border rounded-sm transition-all",
                    activePersona === option.key
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-base border-border-subtle text-slate-500 hover:border-primary hover:text-primary",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {activePersonaDetails?.blurb && (
              <p className="text-sm text-slate-500 font-mono">{activePersonaDetails.blurb}</p>
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
            <article className="bento-card">
              <header className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="label-tech">FOCUS SUGGESTIONS</span>
                  </div>
                  <p className="text-sm text-slate-500 font-mono">
                    High-impact projects ranked by urgency and progress.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Auto curated</span>
              </header>

              <div className="space-y-3">
                {focusSuggestions.length === 0 ? (
                  <div className="border border-dashed border-border-default bg-surface-base p-6 text-sm text-slate-500 font-mono rounded-sm">
                    Add a project or task to see personalised recommendations.
                  </div>
                ) : (
                  focusSuggestions.map((suggestion) => <FocusSuggestionCard key={suggestion.projectId} suggestion={suggestion} />)
                )}
              </div>
            </article>

            <article className="bento-card">
              <header className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="label-tech">DELIVERY RADAR</span>
                  </div>
                  <p className="text-sm text-slate-500 font-mono">Upcoming hand-offs and deadlines.</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">This week</span>
              </header>

              <ul className="space-y-3">
                {focusSuggestions.length === 0 ? (
                  <li className="border border-dashed border-border-default bg-surface-base p-4 text-xs text-slate-500 font-mono rounded-sm">
                    Nothing queued up—great time to plan the next milestone.
                  </li>
                ) : (
                  focusSuggestions.slice(0, 4).map((item) => (
                    <li key={item.projectId} className="flex items-start gap-3 border border-border-subtle bg-surface-base p-4 rounded-sm">
                      <span className="mt-1 h-2 w-2 rounded-full" style={{ backgroundColor: accentPalette[item.accent] }} aria-hidden />
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-sm font-bold text-slate-900">{item.title}</span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{item.stage}</span>
                        <p className="text-xs text-slate-500 font-mono">{item.dueLabel}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </article>
          </section>

          <section className="bento-card">
            <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="label-tech">BOARD OVERVIEW</span>
                </div>
                <p className="text-sm text-slate-500 font-mono">
                  Columns reflect how you categorise the work.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{boardColumns.length} columns</span>
            </header>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {boardColumns.map((column) => (
                <ProjectColumn key={column.id} column={column} />
              ))}

              {boardColumns.length === 0 && (
                <div className="border border-dashed border-border-default bg-surface-base p-8 text-center text-sm text-slate-500 font-mono rounded-sm">
                  No projects yet—start by creating a column that matches how you track work.
                </div>
              )}
            </div>
          </section>

          <section className="bento-card">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="label-tech">PROJECT TEMPLATES</span>
                </div>
                <p className="text-sm text-slate-500 font-mono">Optional blueprints to spin up consistent project groups faster.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Power user presets
              </span>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {templates
                .filter((template) => template.bestFor === "all" || template.bestFor === activePersona)
                .map((template) => (
                  <article
                    key={template.id}
                    className="flex flex-col gap-3 border border-border-subtle bg-surface-base p-4 rounded-sm transition hover:border-primary"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{template.title}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border border-border-subtle rounded-sm">
                        {template.bestFor === "all" ? "ALL" : template.bestFor.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{template.summary}</p>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {template.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 font-mono">
                          <span className="h-1 w-1 bg-primary rounded-full" aria-hidden />
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
      <div className="bento-card">
        <div className="h-4 w-48 animate-pulse rounded-sm bg-slate-200" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-sm bg-surface-base border border-border-subtle" />
          ))}
        </div>
      </div>
      <div className="bento-card">
        <div className="h-4 w-32 animate-pulse rounded-sm bg-slate-200" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-sm bg-surface-base border border-border-subtle" />
          ))}
        </div>
      </div>
    </section>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-mono">
      ERROR: {message}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bento-card p-4">
      <span className="label-tech mb-2">{label.toUpperCase()}</span>
      <p className="text-2xl font-mono font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FocusSuggestionCard({ suggestion }: { suggestion: FocusSuggestion }) {
  return (
    <article className="flex items-start gap-4 border border-border-subtle bg-surface-base p-4 rounded-sm transition hover:border-primary">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-sm text-xs font-mono font-bold text-white"
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
            <p className="text-sm font-bold text-slate-900">{suggestion.title}</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{suggestion.stage}</p>
          </div>
          <FocusPriorityBadge priority={suggestion.priority} />
        </div>
        <p className="text-xs text-slate-500 font-mono">{suggestion.summary}</p>
        <p className="text-xs font-mono font-medium text-slate-600">{suggestion.dueLabel}</p>
      </div>
    </article>
  );
}

function FocusPriorityBadge({ priority }: { priority: FocusSuggestion["priority"] }) {
  const tone: Record<FocusSuggestion["priority"], string> = {
    "Critical focus": "bg-red-50 text-red-600 border-red-200",
    "High focus": "bg-amber-50 text-amber-600 border-amber-200",
    "Worth a look": "bg-blue-50 text-blue-600 border-blue-200",
    "On track": "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <span className={clsx("px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-sm", tone[priority])}>{priority}</span>
  );
}

function ProjectColumn({ column }: { column: ProjectBoardColumn }) {
  return (
    <section className="flex h-full flex-col gap-4 border border-border-subtle bg-surface-base p-5 rounded-sm">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">{column.title}</h3>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 rounded-sm">
            {column.projects.length}
          </span>
        </div>
        {column.description && <p className="text-xs text-slate-500 font-mono">{column.description}</p>}
        {column.intent && (
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">{column.intent}</p>
        )}
      </header>

      <div className="space-y-4">
        {column.projects.map((project) => (
          <article key={project.id} className="space-y-4 border border-border-subtle bg-white p-5 rounded-sm transition hover:border-primary">
            <div className="flex items-start gap-4">
              <ProjectProgressRing value={project.progress} accent={project.accent} />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{project.name}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 rounded-sm">
                    {project.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {project.dueDate ? `Due ${formatShortDate(new Date(project.dueDate))}` : "No due date"}
                  {project.focus ? ` | ${project.focus}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ul className="space-y-2">
                {project.tasks.map((task) => (
                  <li key={task.id} className="flex flex-col gap-1 border border-border-subtle bg-surface-base px-3 py-2 text-sm rounded-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{task.label}</span>
                      <span className={clsx("h-2 w-2 rounded-full", taskStatusTone[task.status])} aria-hidden />
                    </div>
                    {task.context && <span className="text-xs text-slate-500 font-mono">{task.context}</span>}
                  </li>
                ))}
              </ul>

              {project.notes && (
                <div className="border border-dashed border-border-default bg-surface-base px-3 py-3 text-xs text-slate-600 font-mono rounded-sm">
                  {project.notes}
                </div>
              )}
            </div>
          </article>
        ))}

        {column.projects.length === 0 && (
          <div className="border border-dashed border-border-default bg-surface-base p-6 text-center text-xs text-slate-500 font-mono rounded-sm">
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
    <div className="relative h-14 w-14">
      <svg className="h-full w-full" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="5"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="square"
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs font-mono font-bold text-slate-900">
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
