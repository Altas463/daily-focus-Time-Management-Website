'use client';

import { useMemo, useState } from 'react';
import BackToDashboardLink from '@/components/BackToDashboardLink';
import { formatShortDate } from '@/utils/date';

type PersonaKey = 'student' | 'freelancer' | 'developer';

type ProjectTask = {
  id: string;
  label: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  context?: string;
};

type ProjectCard = {
  id: string;
  name: string;
  stage: string;
  dueDate: string;
  progress: number;
  focus: string;
  notes: string;
  accent: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  tasks: ProjectTask[];
};

type ProjectColumn = {
  id: string;
  title: string;
  description: string;
  intent: string;
  projects: ProjectCard[];
};

type ProjectTemplate = {
  id: string;
  title: string;
  summary: string;
  bestFor: PersonaKey | 'all';
  highlights: string[];
};

const accentPalette: Record<ProjectCard['accent'], string> = {
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  amber: '#f59e0b',
  rose: '#f43f5e',
};

const taskStatusTone: Record<ProjectTask['status'], string> = {
  todo: 'bg-gray-300 dark:bg-gray-700',
  inProgress: 'bg-sky-400/80 dark:bg-sky-500/80',
  review: 'bg-purple-400/80 dark:bg-purple-500/70',
  done: 'bg-emerald-400/80 dark:bg-emerald-500/70',
};

const personaOptions: Array<{ key: PersonaKey; label: string; blurb: string }> = [
  {
    key: 'student',
    label: 'Students',
    blurb: 'Keep coursework, group deliverables, and portfolio prep in view.',
  },
  {
    key: 'freelancer',
    label: 'Freelancers',
    blurb: 'Track retainers, proposals, and client feedback loops together.',
  },
  {
    key: 'developer',
    label: 'Developers',
    blurb: 'Map sprints, refactors, and adoption rollouts without leaving focus mode.',
  },
];

const boardData: Record<PersonaKey, ProjectColumn[]> = {
  student: [
    {
      id: 'coursework',
      title: 'Coursework',
      description: 'Assignments and labs for this term.',
      intent: 'Ship on time and stay eligibility-ready.',
      projects: [
        {
          id: 'capstone',
          name: 'Capstone Research Sprint',
          stage: 'Analysis draft',
          dueDate: '2025-05-26',
          progress: 55,
          focus: 'Outline findings with advisor feedback integrated.',
          notes: 'Request a desk review before week 8 to avoid rework.',
          accent: 'emerald',
          tasks: [
            { id: 'capstone-1', label: 'Synthesize survey responses', status: 'inProgress' },
            { id: 'capstone-2', label: 'Draft methodology slide deck', status: 'todo', context: 'Need references' },
            { id: 'capstone-3', label: 'Book advisor sync', status: 'done' },
          ],
        },
        {
          id: 'ml-lab',
          name: 'Machine Learning Lab 05',
          stage: 'Model tuning',
          dueDate: '2025-05-17',
          progress: 35,
          focus: 'Clean notebook + compare ROC curves with baseline.',
          notes: 'TA said to prioritise interpretability notes over accuracy.',
          accent: 'blue',
          tasks: [
            { id: 'ml-lab-1', label: 'Refine feature scaling', status: 'inProgress' },
            { id: 'ml-lab-2', label: 'Write evaluation summary', status: 'todo' },
            { id: 'ml-lab-3', label: 'Peer review session', status: 'review', context: 'Friday study group' },
          ],
        },
      ],
    },
    {
      id: 'collaboration',
      title: 'Group Projects',
      description: 'Shared deliverables across teams.',
      intent: 'Make next check-in effortless.',
      projects: [
        {
          id: 'ux-rework',
          name: 'Design Systems Refresh',
          stage: 'Feedback review',
          dueDate: '2025-05-30',
          progress: 70,
          focus: 'Align new accessibility tokens with Figma library.',
          notes: 'Needs sign-off from mobility accessibility lead.',
          accent: 'purple',
          tasks: [
            { id: 'ux-rework-1', label: 'Audit component inventory', status: 'done' },
            { id: 'ux-rework-2', label: 'Update spacing scale', status: 'inProgress' },
            { id: 'ux-rework-3', label: 'Collect user feedback notes', status: 'todo' },
          ],
        },
        {
          id: 'case-study',
          name: 'Consulting Case Competition',
          stage: 'Presentation polish',
          dueDate: '2025-05-22',
          progress: 82,
          focus: 'Rehearse delivery and tighten financial story.',
          notes: 'Timeline locked; allocate 1 hour for Q&A practice.',
          accent: 'amber',
          tasks: [
            { id: 'case-study-1', label: 'Finalize slide narrative', status: 'review' },
            { id: 'case-study-2', label: 'Run timed dry run', status: 'todo' },
            { id: 'case-study-3', label: 'Update appendix data table', status: 'done' },
          ],
        },
      ],
    },
    {
      id: 'portfolio',
      title: 'Career & Portfolio',
      description: 'Longer-term assets that strengthen applications.',
      intent: 'Ship artifacts recruiters can skim in 90 seconds.',
      projects: [
        {
          id: 'portfolio-site',
          name: 'Personal Portfolio v3',
          stage: 'Content choreography',
          dueDate: '2025-06-14',
          progress: 48,
          focus: 'Publish projects index + hero animation tweak.',
          notes: 'Reserve lab printers for poster version post-finals.',
          accent: 'rose',
          tasks: [
            { id: 'portfolio-site-1', label: 'Write case study intros', status: 'inProgress' },
            { id: 'portfolio-site-2', label: 'Record walkthrough video', status: 'todo' },
            { id: 'portfolio-site-3', label: 'Deploy staging build', status: 'done' },
          ],
        },
      ],
    },
  ],
  freelancer: [
    {
      id: 'active-retainers',
      title: 'Active Retainers',
      description: 'Recurring work with monthly checkpoints.',
      intent: 'Surface the next deliverable per client.',
      projects: [
        {
          id: 'brand-audit',
          name: 'Northwind Brand Audit',
          stage: 'Insights handoff',
          dueDate: '2025-05-19',
          progress: 64,
          focus: 'Translate analytics into actionable playbook.',
          notes: 'Client wants Loom recap under eight minutes.',
          accent: 'emerald',
          tasks: [
            { id: 'brand-audit-1', label: 'Compile sentiment highlights', status: 'done' },
            { id: 'brand-audit-2', label: 'Storyboard Loom walkthrough', status: 'todo' },
            { id: 'brand-audit-3', label: 'Finalize notion handover doc', status: 'inProgress' },
          ],
        },
        {
          id: 'maintenance',
          name: 'AtlasSite Care Plan',
          stage: 'QA window',
          dueDate: '2025-05-25',
          progress: 42,
          focus: 'Bundle bug fixes with SEO crawl updates.',
          notes: 'Coordinate release window with in-house dev lead.',
          accent: 'blue',
          tasks: [
            { id: 'maintenance-1', label: 'Audit lighthouse regressions', status: 'inProgress' },
            { id: 'maintenance-2', label: 'Prep client-ready changelog', status: 'todo' },
            { id: 'maintenance-3', label: 'Schedule post-release check', status: 'todo' },
          ],
        },
      ],
    },
    {
      id: 'pipeline',
      title: 'Pipeline',
      description: 'Opportunities that need structured follow-up.',
      intent: 'Keep proposals timely and outcomes visible.',
      projects: [
        {
          id: 'proposal',
          name: 'Rework CMS Proposal',
          stage: 'Scope validation',
          dueDate: '2025-05-16',
          progress: 25,
          focus: 'Confirm backlog size and maintenance appetite.',
          notes: 'Send comparative pricing table before Friday call.',
          accent: 'purple',
          tasks: [
            { id: 'proposal-1', label: 'Draft options matrix', status: 'inProgress' },
            { id: 'proposal-2', label: 'Collect testimonials', status: 'todo' },
            { id: 'proposal-3', label: 'Budget review with accountant', status: 'todo' },
          ],
        },
        {
          id: 'workshop',
          name: 'Async Ways of Working Workshop',
          stage: 'Participant onboarding',
          dueDate: '2025-05-28',
          progress: 58,
          focus: 'Build worksheet assets and gather case studies.',
          notes: 'Flagged need for captioned recordings in follow-up.',
          accent: 'amber',
          tasks: [
            { id: 'workshop-1', label: 'Script facilitation outline', status: 'inProgress' },
            { id: 'workshop-2', label: 'Prepare miro board template', status: 'done' },
            { id: 'workshop-3', label: 'Design participant packet', status: 'review' },
          ],
        },
      ],
    },
    {
      id: 'backlog',
      title: 'Backlog & Experiments',
      description: 'Ideas that can convert into future retainers.',
      intent: 'Incubate assets when client time loosens.',
      projects: [
        {
          id: 'lead-magnet',
          name: 'Notion Content Library Template',
          stage: 'Outline ready',
          dueDate: '2025-06-04',
          progress: 18,
          focus: 'Design landing page wireframe and teaser email.',
          notes: 'Aim to publish right before summer inquiry season.',
          accent: 'rose',
          tasks: [
            { id: 'lead-magnet-1', label: 'Draft copy skeleton', status: 'todo' },
            { id: 'lead-magnet-2', label: 'Collect testimonial snippets', status: 'todo' },
            { id: 'lead-magnet-3', label: 'Build Notion template blocks', status: 'inProgress' },
          ],
        },
      ],
    },
  ],
  developer: [
    {
      id: 'sprint',
      title: 'Current Sprint',
      description: 'Active user stories targeted for this iteration.',
      intent: 'Keep blockers surfaced before stand-up.',
      projects: [
        {
          id: 'notification-core',
          name: 'Notification Center Refactor',
          stage: 'QA handoff',
          dueDate: '2025-05-21',
          progress: 72,
          focus: 'Stabilise queue workers and document failure modes.',
          notes: 'Coordinate release with mobile team to avoid double pings.',
          accent: 'emerald',
          tasks: [
            { id: 'notification-core-1', label: 'Write load test scripts', status: 'done' },
            { id: 'notification-core-2', label: 'Finalize retry strategy', status: 'inProgress' },
            { id: 'notification-core-3', label: 'Pair QA verification', status: 'review' },
          ],
        },
        {
          id: 'billing-updates',
          name: 'Usage-Based Billing Upgrade',
          stage: 'Integration testing',
          dueDate: '2025-05-24',
          progress: 46,
          focus: 'Align invoice line-items with finance data warehouse.',
          notes: 'Need sign-off from compliance before toggling feature flag.',
          accent: 'blue',
          tasks: [
            { id: 'billing-updates-1', label: 'Sync with finance about rounding', status: 'todo' },
            { id: 'billing-updates-2', label: 'Backfill historic usage', status: 'inProgress' },
            { id: 'billing-updates-3', label: 'Write integration tests', status: 'todo' },
          ],
        },
      ],
    },
    {
      id: 'foundational',
      title: 'Architecture',
      description: 'Strategic work that pays off each sprint.',
      intent: 'Invest in platform upgrades intentionally.',
      projects: [
        {
          id: 'design-system',
          name: 'Cross-platform Design Tokens',
          stage: 'Rollout planning',
          dueDate: '2025-06-10',
          progress: 38,
          focus: 'Align native and web consumers on token naming.',
          notes: 'Document migration path for legacy SCSS variables.',
          accent: 'purple',
          tasks: [
            { id: 'design-system-1', label: 'Map token gaps', status: 'inProgress' },
            { id: 'design-system-2', label: 'Draft migration checklist', status: 'todo' },
            { id: 'design-system-3', label: 'Pilot in settings module', status: 'todo' },
          ],
        },
        {
          id: 'observability',
          name: 'Observability Playbook',
          stage: 'Outline review',
          dueDate: '2025-05-29',
          progress: 58,
          focus: 'Codify runbooks and normalize alert severities.',
          notes: 'Security team requested section on incident triage.',
          accent: 'amber',
          tasks: [
            { id: 'observability-1', label: 'Draft escalation matrix', status: 'inProgress' },
            { id: 'observability-2', label: 'Collect SLO baselines', status: 'review' },
            { id: 'observability-3', label: 'Publish to internal wiki', status: 'todo' },
          ],
        },
      ],
    },
    {
      id: 'adoption',
      title: 'Adoption & Enablement',
      description: 'Helping teams land the change.',
      intent: 'Share context and reduce back-and-forth.',
      projects: [
        {
          id: 'enablement-kit',
          name: 'AI Feature Enablement Kit',
          stage: 'Stakeholder briefing',
          dueDate: '2025-06-02',
          progress: 65,
          focus: 'Ship hands-on labs plus success metrics dashboard.',
          notes: 'Marketing requested case studies for beta launch.',
          accent: 'rose',
          tasks: [
            { id: 'enablement-kit-1', label: 'Outline enablement narrative', status: 'inProgress' },
            { id: 'enablement-kit-2', label: 'Draft metrics dashboard', status: 'todo' },
            { id: 'enablement-kit-3', label: 'Record feature walkthrough', status: 'review' },
          ],
        },
      ],
    },
  ],
};

const templates: ProjectTemplate[] = [
  {
    id: 'client-onboarding',
    title: 'Client Onboarding Playbook',
    summary: 'Capture kickoff actions, permissions, and welcome automations in one place.',
    bestFor: 'freelancer',
    highlights: ['Discovery checklist', '15-day milestone plan', 'Feedback loops'],
  },
  {
    id: 'course-sprint',
    title: 'Semester Sprint Planner',
    summary: 'Cluster assignments, labs, and study blocks by course and difficulty.',
    bestFor: 'student',
    highlights: ['Week-by-week view', 'Group task handover', 'Exam prep boosters'],
  },
  {
    id: 'release-readiness',
    title: 'Release Readiness Tracker',
    summary: 'Coordinate QA sign-offs, docs, and rollbacks for multi-team launches.',
    bestFor: 'developer',
    highlights: ['Risk matrix', 'Launch war room notes', 'Post-release checklist'],
  },
  {
    id: 'idea-incubator',
    title: 'Idea Incubator Board',
    summary: 'Log experiments, demand signals, and traction notes before investing fully.',
    bestFor: 'all',
    highlights: ['Impact vs. effort score', 'Validation log', 'Template handoff'],
  },
];

function ProjectProgressRing({ value, accent }: { value: number; accent: ProjectCard['accent'] }) {
  const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), 100) : 0;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="8"
          fill="none"
          className="stroke-gray-200 dark:stroke-gray-800"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          stroke={accentPalette[accent]}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset]"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-gray-100">
        {Math.round(safeValue)}%
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [activePersona, setActivePersona] = useState<PersonaKey>('student');
  const personaBoard = boardData[activePersona];

  const projectList = useMemo(
    () => personaBoard.flatMap((column) => column.projects),
    [personaBoard],
  );

  const stats = useMemo(() => {
    const totalProjects = projectList.length;
    const progressSum = projectList.reduce((sum, project) => sum + project.progress, 0);
    const averageProgress = totalProjects ? Math.round(progressSum / totalProjects) : 0;
    const today = new Date();
    const dueSoonCount = projectList.filter((project) => {
      const due = new Date(project.dueDate);
      if (Number.isNaN(due.getTime())) return false;
      const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
    }).length;
    const reviewCount = projectList.filter((project) =>
      project.tasks.some((task) => task.status === 'review'),
    ).length;

    return { totalProjects, averageProgress, dueSoonCount, reviewCount };
  }, [projectList]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <BackToDashboardLink />

      <header className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">
              Project Hub
            </span>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">
              Kanban views by project groups
            </h1>
          </div>
          <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
            Switch between learner, freelance, and engineering boards to see how tasks roll up per
            project. Track due dates, progress rings, and punch-list notes in one place - ideal for
            power users migrating from Notion or Trello who want structure without losing focus.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {personaOptions.map((persona) => {
            const active = persona.key === activePersona;
            return (
              <button
                key={persona.key}
                type="button"
                onClick={() => setActivePersona(persona.key)}
                className={[
                  'inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition',
                  active
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-700',
                ].join(' ')}
              >
                <span className="font-semibold">{persona.label}</span>
                <span className="hidden text-xs text-gray-400 sm:inline">{persona.blurb}</span>
              </button>
            );
          })}
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active projects" value={stats.totalProjects} />
          <StatCard label="Average progress" value={`${stats.averageProgress}%`} />
          <StatCard label="Due within 7 days" value={stats.dueSoonCount} />
          <StatCard label="Reviews pending" value={stats.reviewCount} />
        </section>
      </header>

      <section aria-label="Project Kanban board" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Project groups</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Group tasks by project to spot progress, blockers, and runway at a glance.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-6">
            {personaBoard.map((column) => (
              <section
                key={column.id}
                className="w-[320px] shrink-0 rounded-3xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/60"
              >
                <header className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {column.title}
                    </h3>
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {column.projects.length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{column.description}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                    {column.intent}
                  </p>
                </header>

                <div className="space-y-4">
                  {column.projects.map((project) => (
                    <article
                      key={project.id}
                      className="space-y-4 rounded-2xl border border-white/60 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800/60 dark:bg-gray-900"
                    >
                      <div className="flex items-start gap-4">
                        <ProjectProgressRing value={project.progress} accent={project.accent} />
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {project.name}
                            </h4>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                              {project.stage}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Due {formatShortDate(new Date(project.dueDate))} | {project.focus}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <ul className="space-y-2">
                          {project.tasks.map((task) => (
                            <li
                              key={task.id}
                              className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-800 dark:text-gray-100">
                                  {task.label}
                                </span>
                                <span
                                  className={[
                                    'h-2.5 w-2.5 rounded-full',
                                    taskStatusTone[task.status],
                                  ].join(' ')}
                                  aria-hidden
                                />
                              </div>
                              {task.context && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {task.context}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>

                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                          {project.notes}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Project templates
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Optional blueprints to spin up consistent project groups faster.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.24em] text-gray-400 dark:text-gray-500">
            Designed for power users switching from workspace tools
          </span>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {templates
            .filter((template) => template.bestFor === 'all' || template.bestFor === activePersona)
            .map((template) => (
              <article
                key={template.id}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {template.title}
                  </h3>
                  <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    {template.bestFor === 'all' ? 'All' : template.bestFor}
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
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5 text-gray-700 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}
