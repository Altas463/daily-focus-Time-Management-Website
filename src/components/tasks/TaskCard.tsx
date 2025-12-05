"use client";

import { FC, useState } from "react";
import { Task } from "@/types";
import TaskEditModal from "./TaskEditModal";
import { MoreHorizontal, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDayMonth } from "@/utils/date";

type TaskCardProps = {
  task: Task;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
};

const getPriorityStyle = (priority?: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-600 border-red-200";
    case "medium":
      return "bg-orange-50 text-orange-600 border-orange-200";
    case "low":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    default:
      return null;
  }
};

const TaskCard: FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dueText = formatDayMonth(task.endDate);
  const priorityClass = getPriorityStyle(task.priority);

  const isOverdue = task.endDate && new Date(task.endDate) < new Date() && !task.completed;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative p-4 bg-surface-base border rounded-sm cursor-pointer transition-all duration-200 ${
          isHovered ? "border-primary shadow-sm" : "border-border-subtle"
        }`}
      >
        {/* Completed indicator line */}
        {task.completed && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-sm" />
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          {/* Task title */}
          <h3
            className={`text-sm font-medium leading-snug flex-1 ${
              task.completed ? "line-through text-slate-400" : "text-slate-900"
            }`}
          >
            {task.title}
          </h3>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className={`flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center transition-colors ${
              isHovered ? "bg-slate-100 text-slate-600" : "text-transparent group-hover:text-slate-400"
            }`}
            aria-label="Edit task"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {/* Completion status */}
          {task.completed && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" />
              Done
            </span>
          )}

          {/* Priority badge */}
          {priorityClass && !task.completed && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${priorityClass}`}>
              {task.priority}
            </span>
          )}

          {/* Due date */}
          {dueText && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm border uppercase tracking-wider ${
                task.completed
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : isOverdue
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-orange-50 text-orange-600 border-orange-200"
              }`}
            >
              {isOverdue && !task.completed ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              {dueText}
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <TaskEditModal
          task={task}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default TaskCard;
