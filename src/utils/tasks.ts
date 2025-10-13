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
  if (!endDate) return { tone: "default", label: "Khong uu tien" };

  const due = new Date(endDate);
  if (Number.isNaN(due.getTime())) return { tone: "default", label: "Khong ro han" };

  const diffInMs = due.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return { tone: "danger", label: "Qua han" };
  if (diffInDays <= 1) return { tone: "warning", label: "Can gap" };
  if (diffInDays <= 3) return { tone: "notice", label: "Dang gan" };
  return { tone: "success", label: "Binh thuong" };
}
