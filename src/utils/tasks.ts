"use client";

export type TaskLike = {
  id: string;
  title: string;
  completed: boolean;
  endDate?: string | null;
  startDate?: string | null;
};

export type TaskSummary = {
  total: number;
  completed: number;
  incomplete: number;
  overdue: number;
  dueSoon: number;
};

type UrgencyTone = "danger" | "warning" | "notice" | "success" | "default";

export type TaskUrgency = {
  tone: UrgencyTone;
  label: string;
};

const MS_IN_DAY = 1000 * 60 * 60 * 24;

/**
 * Returns a blank task template for quickly initialising new task state objects.
 */
export function createEmptyTask(): {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
} {
  return {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  };
}

/**
 * Computes aggregate counts used in multiple parts of the dashboard.
 */
export function summarizeTasks(tasks: TaskLike[], now: Date = new Date()): TaskSummary {
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const dueSoonThreshold = new Date(now);
  dueSoonThreshold.setDate(dueSoonThreshold.getDate() + 3);

  return tasks.reduce<TaskSummary>(
    (summary, task) => {
      summary.total += 1;
      if (task.completed) {
        summary.completed += 1;
        return summary;
      }

      summary.incomplete += 1;

      if (!task.endDate) return summary;
      const due = new Date(task.endDate);
      if (Number.isNaN(due.getTime())) return summary;

      if (due < endOfToday) summary.overdue += 1;
      else if (due <= dueSoonThreshold) summary.dueSoon += 1;

      return summary;
    },
    { total: 0, completed: 0, incomplete: 0, overdue: 0, dueSoon: 0 }
  );
}

/**
 * Determines the urgency tone/label for a given task deadline.
 */
export function getTaskUrgency(endDate?: string | null, now: Date = new Date()): TaskUrgency {
   if (!endDate) return { tone: "default", label: "No priority" };

   const due = new Date(endDate);
   if (Number.isNaN(due.getTime())) return { tone: "default", label: "No deadline" };

   const diffInMs = due.getTime() - now.getTime();
   const diffInDays = Math.ceil(diffInMs / MS_IN_DAY);

   if (diffInDays < 0) return { tone: "danger", label: "Overdue" };
   if (diffInDays <= 1) return { tone: "warning", label: "Urgent" };
   if (diffInDays <= 3) return { tone: "notice", label: "Soon" };
   return { tone: "success", label: "Normal" };
 }

export function isTaskOverdue(endDate?: string | null, now: Date = new Date()): boolean {
  if (!endDate) return false;
  const due = new Date(endDate);
  if (Number.isNaN(due.getTime())) return false;
  return due.getTime() < now.getTime();
}

export function isTaskDueSoon(
  endDate?: string | null,
  now: Date = new Date(),
  windowInDays = 3
): boolean {
  if (!endDate) return false;
  const due = new Date(endDate);
  if (Number.isNaN(due.getTime())) return false;

  const diffInDays = Math.ceil((due.getTime() - now.getTime()) / MS_IN_DAY);
  return diffInDays >= 0 && diffInDays <= windowInDays;
}

export function findNextDueTask<T extends TaskLike>(tasks: T[], now: Date = new Date()): T | undefined {
  return tasks
    .filter((task) => !task.completed && task.endDate)
    .map((task) => ({ task, dueTime: new Date(task.endDate as string).getTime() }))
    .filter(({ dueTime }) => Number.isFinite(dueTime))
    .sort((a, b) => a.dueTime - b.dueTime)
    .find(({ dueTime }) => dueTime >= now.getTime())
    ?.task;
}
