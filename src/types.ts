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
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  completed: boolean;
  tags?: string[];
  priority?: TaskPriority;
  recurrenceRule?: string | null;
  subtasks?: TaskSubtask[];
  createdAt?: string;
  updatedAt?: string;
};
