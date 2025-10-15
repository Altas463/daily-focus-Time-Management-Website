import { differenceInCalendarDays } from "date-fns";
import { Persona, Project, ProjectAccent, ProjectTask, ProjectTaskStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { defaultLanes, personaOptions } from "./defaults";

export type PersonaKey = "student" | "freelancer" | "developer";

export type TaskStatusToken = "todo" | "inProgress" | "review" | "done";

export type ProjectBoardTask = {
  id: string;
  label: string;
  status: TaskStatusToken;
  context: string | null;
};

export type ProjectBoardCard = {
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

export type PersonaAccentToken = "emerald" | "blue" | "purple" | "amber" | "rose";

export type ProjectBoardColumn = {
  id: string;
  title: string;
  description: string | null;
  intent: string | null;
  projects: ProjectBoardCard[];
};

export type FocusSuggestion = {
  projectId: string;
  title: string;
  summary: string;
  accent: PersonaAccentToken;
  score: number;
  stage: string;
  priority: "Critical focus" | "High focus" | "Worth a look" | "On track";
  dueLabel: string;
};

export type ProjectBoardResponse = {
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

const personaEnumToKey: Record<Persona, PersonaKey> = {
  [Persona.STUDENT]: "student",
  [Persona.FREELANCER]: "freelancer",
  [Persona.DEVELOPER]: "developer",
};

const accentEnumToToken: Record<ProjectAccent, PersonaAccentToken> = {
  [ProjectAccent.EMERALD]: "emerald",
  [ProjectAccent.BLUE]: "blue",
  [ProjectAccent.PURPLE]: "purple",
  [ProjectAccent.AMBER]: "amber",
  [ProjectAccent.ROSE]: "rose",
};

const statusEnumToToken: Record<ProjectTaskStatus, TaskStatusToken> = {
  [ProjectTaskStatus.TODO]: "todo",
  [ProjectTaskStatus.IN_PROGRESS]: "inProgress",
  [ProjectTaskStatus.REVIEW]: "review",
  [ProjectTaskStatus.DONE]: "done",
};

async function seedDefaultBoardForUser(userId: string) {
  for (const lane of defaultLanes) {
    await prisma.projectLane.create({
      data: {
        userId,
        persona: lane.persona,
        title: lane.title,
        description: lane.description ?? null,
        intent: lane.intent ?? null,
        ordering: lane.ordering ?? 0,
        projects: {
          create: lane.projects.map((project, projectIndex) => ({
            userId,
            name: project.name,
            stage: project.stage,
            dueDate: project.dueDate ? new Date(project.dueDate) : null,
            progress: project.progress,
            focus: project.focus ?? null,
            notes: project.notes ?? null,
            accent: project.accent,
            priority: project.priority ?? projectIndex,
            tasks: {
              create: project.tasks.map((task, taskIndex) => ({
                label: task.label,
                status: task.status,
                context: task.context ?? null,
                ordering: taskIndex,
              })),
            },
          })),
        },
      },
    });
  }
}

async function ensureBoard(userId: string) {
  const laneCount = await prisma.projectLane.count({ where: { userId } });
  if (laneCount === 0) {
    await seedDefaultBoardForUser(userId);
  }
}

function computeDueLabel(dueDate: Date | null): string {
  if (!dueDate) {
    return "No due date";
  }
  const today = new Date();
  const days = differenceInCalendarDays(dueDate, today);
  if (days < 0) {
    const overdueBy = Math.abs(days);
    return overdueBy === 1 ? "Overdue by 1 day" : `Overdue by ${overdueBy} days`;
  }
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 7) return `Due in ${days} days`;
  return dueDate.toLocaleDateString();
}

function computeFocusPriority(project: Project, dueDate: Date | null): FocusSuggestion["priority"] {
  const distance = dueDate ? differenceInCalendarDays(dueDate, new Date()) : null;
  if (distance !== null && distance <= 1) return "Critical focus";
  if (project.progress <= 25) return "Critical focus";
  if (distance !== null && distance <= 3) return "High focus";
  if (project.progress <= 55) return "High focus";
  if (distance !== null && distance <= 7) return "Worth a look";
  if (project.progress <= 80) return "Worth a look";
  return "On track";
}

function computeFocusScore(project: Project, dueDate: Date | null): number {
  const progressGap = 100 - project.progress;
  const priorityWeight = (project.priority ?? 0) * 10;
  const dueWeight = dueDate ? Math.max(0, 30 - Math.max(0, differenceInCalendarDays(dueDate, new Date()))) : 8;
  return progressGap + priorityWeight + dueWeight;
}

function mapProjectToCard(project: Project & { tasks: ProjectTask[] }): ProjectBoardCard {
  return {
    id: project.id,
    name: project.name,
    stage: project.stage,
    dueDate: project.dueDate ? project.dueDate.toISOString() : null,
    progress: project.progress,
    focus: project.focus,
    notes: project.notes,
    accent: accentEnumToToken[project.accent],
    tasks: project.tasks
      .sort((a, b) => a.ordering - b.ordering || a.createdAt.getTime() - b.createdAt.getTime())
      .map((task) => ({
        id: task.id,
        label: task.label,
        status: statusEnumToToken[task.status],
        context: task.context,
      })),
  };
}

export async function getProjectBoard(userId: string): Promise<ProjectBoardResponse> {
  await ensureBoard(userId);

  const lanes = await prisma.projectLane.findMany({
    where: { userId },
    orderBy: [{ persona: "asc" }, { ordering: "asc" }, { createdAt: "asc" }],
    include: {
      projects: {
        include: { tasks: true },
        orderBy: [{ priority: "desc" }, { dueDate: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  const board: Record<PersonaKey, ProjectBoardColumn[]> = {
    student: [],
    freelancer: [],
    developer: [],
  };

  let totalProjects = 0;
  let activeProjects = 0;
  let tasksTotal = 0;
  let tasksCompleted = 0;
  let upcomingDue = 0;
  let overdue = 0;

  const focusCandidates: FocusSuggestion[] = [];

  for (const lane of lanes) {
    const personaKey = personaEnumToKey[lane.persona];
    const columns = board[personaKey];

    const mappedProjects = lane.projects.map((project) => {
      totalProjects += 1;
      if (project.progress < 100) {
        activeProjects += 1;
      }

      const completedTasksForProject = project.tasks.filter(
        (task) => task.status === ProjectTaskStatus.DONE,
      ).length;
      tasksCompleted += completedTasksForProject;
      tasksTotal += project.tasks.length;

      const dueDate = project.dueDate ?? null;
      if (dueDate) {
        const diff = differenceInCalendarDays(dueDate, new Date());
        if (diff < 0) {
          overdue += 1;
        } else if (diff <= 7) {
          upcomingDue += 1;
        }
      }

      const projectCard = mapProjectToCard(project);

      const priority = computeFocusPriority(project, dueDate);
      const score = computeFocusScore(project, dueDate);
      const summary = project.focus || project.notes || "Revisit project details to uncover next steps.";

      focusCandidates.push({
        projectId: project.id,
        title: project.name,
        summary,
        accent: accentEnumToToken[project.accent],
        score,
        stage: project.stage,
        priority,
        dueLabel: computeDueLabel(dueDate),
      });

      return projectCard;
    });

    columns.push({
      id: lane.id,
      title: lane.title,
      description: lane.description,
      intent: lane.intent,
      projects: mappedProjects,
    });
  }

  const focus = focusCandidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const personas = personaOptions.map((persona) => ({
    key: personaEnumToKey[persona.key],
    label: persona.label,
    blurb: persona.blurb,
  }));

  return {
    personas,
    stats: {
      activeProjects,
      totalProjects,
      tasksCompleted,
      tasksTotal,
      upcomingDue,
      overdue,
    },
    board,
    focus,
  };
}
