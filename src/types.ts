// src/types.ts
export type TaskPriority = "low" | "medium" | "high";

export type TaskSubtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
  tags?: string[];
  priority?: TaskPriority;
  recurrenceRule?: string | null;
  subtasks?: TaskSubtask[];
};
