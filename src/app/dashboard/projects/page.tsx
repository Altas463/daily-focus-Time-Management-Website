"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import BackToDashboardLink from "@/components/BackToDashboardLink";
import { formatShortDate } from "@/utils/date";
import { BarChart3, Users, Zap, Target, Layers, LayoutTemplate } from "lucide-react";

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
      { label: "Active", value: stats.activeProjects },
      { label: "Total", value: stats.totalProjects },
      { label: "Tasks", value: `${stats.tasksCompleted}/${stats.tasksTotal}` },
      { label: "Rate", value: `${completionRate}%` },
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
        <h1 className="text-3xl font-display font-bold mb-2">Project Initiatives</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Manage complex workflows and track progress across multiple domains."}</p>
      </header>

      {loading ? (
        <LoadingBoard />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Persona Selector */}
            <div className="bento-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="label-tech">PERSONA</span>
              </div>
              <div className="flex flex-col gap-2">
                {personaOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setActivePersona(option.key)}
                    className={clsx(
                      "text-left px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border rounded-sm transition-all",
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
                <p className="text-xs text-slate-500 font-mono border-t border-dashed border-border-default pt-3">
                  {activePersonaDetails.blurb}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="bento-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="label-tech">METRICS</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {statCards.map((card) => (
                  <div key={card.label}>
                    <div className="text-xl font-mono font-bold text-slate-900">{card.value}</div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{card.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="bento-card p-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <LayoutTemplate className="w-4 h-4 text-primary" />
                <span className="label-tech">TEMPLATES</span>
              </div>
              <div className="flex flex-col gap-3">
                {templates
                  .filter((template) => template.bestFor === "all" || template.bestFor === activePersona)
                  .map((template) => (
                    <button
                      key={template.id}
                      className="text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors">{template.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono line-clamp-2 mt-0.5">{template.summary}</p>
                    </button>
                  ))}
              </div>
            </div>

          </div>

          {/* Right Content (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Row: Suggestions & Radar */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Focus Suggestions */}
              <div className="bento-card flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="label-tech">FOCUS SUGGESTIONS</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Auto-curated</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  {focusSuggestions.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-border-default rounded-sm p-4 text-center">
                       <p className="text-xs text-slate-500 font-mono">Add projects to see recommendations.</p>
                    </div>
                  ) : (
                    focusSuggestions.slice(0, 3).map((suggestion) => (
                      <FocusSuggestionCard key={suggestion.projectId} suggestion={suggestion} />
                    ))
                  )}
                </div>
              </div>

              {/* Delivery Radar */}
              <div className="bento-card flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="label-tech">DELIVERY RADAR</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">This Week</span>
                </div>

                <div className="flex-1 space-y-3">
                  {focusSuggestions.length === 0 ? (
                    <div className="h-full flex items-center justify-center border border-dashed border-border-default rounded-sm p-4 text-center">
                       <p className="text-xs text-slate-500 font-mono">No upcoming deadlines.</p>
                    </div>
                  ) : (
                    focusSuggestions.slice(0, 4).map((item) => (
                      <div key={item.projectId} className="flex items-center gap-3 border border-border-subtle bg-surface-panel px-3 py-2 rounded-sm">
                        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: accentPalette[item.accent] }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">{item.title}</span>
                            <span className="text-[10px] font-mono text-slate-500">{item.dueLabel}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Board Overview */}
            <div className="bento-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="label-tech">BOARD OVERVIEW</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{boardColumns.length} Columns</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {boardColumns.map((column) => (
                  <ProjectColumn key={column.id} column={column} />
                ))}
                {boardColumns.length === 0 && (
                  <div className="col-span-full border border-dashed border-border-default bg-surface-base p-8 text-center text-sm text-slate-500 font-mono rounded-sm">
                    No projects yet—start by creating a column.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function LoadingBoard() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3 space-y-6">
         <div className="bento-card h-48 animate-pulse bg-slate-100" />
         <div className="bento-card h-32 animate-pulse bg-slate-100" />
      </div>
      <div className="col-span-9 space-y-6">
         <div className="grid grid-cols-2 gap-6">
            <div className="bento-card h-48 animate-pulse bg-slate-100" />
            <div className="bento-card h-48 animate-pulse bg-slate-100" />
         </div>
         <div className="bento-card h-96 animate-pulse bg-slate-100" />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-sm font-mono">
      ERROR: {message}
    </section>
  );
}

function FocusSuggestionCard({ suggestion }: { suggestion: FocusSuggestion }) {
  return (
    <article className="flex items-start gap-3 border border-border-subtle bg-surface-panel p-3 rounded-sm transition hover:border-primary cursor-pointer group">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-sm text-[10px] font-mono font-bold text-white flex-shrink-0"
        style={{ backgroundColor: accentPalette[suggestion.accent] }}
      >
        {suggestion.title.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{suggestion.title}</p>
          <FocusPriorityBadge priority={suggestion.priority} />
        </div>
        <p className="text-[10px] text-slate-500 font-mono line-clamp-1">{suggestion.summary}</p>
      </div>
    </article>
  );
}

function FocusPriorityBadge({ priority }: { priority: FocusSuggestion["priority"] }) {
  const tone: Record<FocusSuggestion["priority"], string> = {
    "Critical focus": "text-red-600 bg-red-50 border-red-100",
    "High focus": "text-amber-600 bg-amber-50 border-amber-100",
    "Worth a look": "text-blue-600 bg-blue-50 border-blue-100",
    "On track": "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <span className={clsx("px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider border rounded-[2px]", tone[priority])}>
      {priority.split(' ')[0]}
    </span>
  );
}

function ProjectColumn({ column }: { column: ProjectBoardColumn }) {
  return (
    <section className="flex flex-col gap-3 border border-border-subtle bg-surface-panel p-3 rounded-sm h-full">
      <header className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{column.title}</h3>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          {column.projects.length}
        </span>
      </header>

      <div className="space-y-3 flex-1">
        {column.projects.map((project) => (
          <article key={project.id} className="space-y-3 border border-border-subtle bg-surface-base p-3 rounded-sm transition hover:border-primary group cursor-pointer shadow-sm">
            <div className="flex items-start gap-3">
              <ProjectProgressRing value={project.progress} accent={project.accent} />
              <div className="flex flex-1 flex-col min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{project.name}</h4>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {project.dueDate ? `Due ${formatShortDate(new Date(project.dueDate))}` : "No date"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {project.tasks.length > 0 && (
                <ul className="space-y-1.5">
                  {project.tasks.slice(0, 3).map((task) => (
                    <li key={task.id} className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-600 truncate">{task.label}</span>
                      <span className={clsx("h-1.5 w-1.5 rounded-full flex-shrink-0", taskStatusTone[task.status])} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProjectProgressRing({ value, accent }: { value: number; accent: PersonaAccentToken }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const stroke = accentPalette[accent];

  return (
    <div className="relative h-10 w-10 flex-shrink-0">
      <svg className="h-full w-full" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-slate-700">
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
