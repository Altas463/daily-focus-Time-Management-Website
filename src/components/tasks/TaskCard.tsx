"use client";

import { FC, useState } from "react";
import { motion } from "framer-motion";
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
      return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", label: "High" };
    case "medium":
      return { bg: "rgba(249, 115, 22, 0.1)", color: "#f97316", label: "Medium" };
    case "low":
      return { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", label: "Low" };
    default:
      return null;
  }
};

const TaskCard: FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dueText = formatDayMonth(task.endDate);
  const priorityStyle = getPriorityStyle(task.priority);

  const isOverdue = task.endDate && new Date(task.endDate) < new Date() && !task.completed;

  return (
    <>
      <motion.div
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative p-4 rounded-xl cursor-pointer transition-all duration-200"
        style={{
          background: "var(--surface)",
          border: `1px solid ${isHovered ? "var(--primary)" : "var(--border)"}`,
          boxShadow: isHovered ? "var(--shadow-card)" : "none",
        }}
      >
        {/* Completed indicator line */}
        {task.completed && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
            style={{ background: "var(--success)" }}
          />
        )}

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          {/* Task title */}
          <h3
            className={`text-sm font-medium leading-snug flex-1 ${
              task.completed ? "line-through" : ""
            }`}
            style={{
              color: task.completed ? "var(--text-muted)" : "var(--text-primary)",
            }}
          >
            {task.title}
          </h3>

          {/* Edit button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: isHovered ? "var(--surface-secondary)" : "transparent",
              color: "var(--text-muted)",
            }}
            aria-label="Edit task"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {/* Completion status */}
          {task.completed && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                color: "#22c55e",
              }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Done
            </span>
          )}

          {/* Priority badge */}
          {priorityStyle && !task.completed && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
              style={{
                background: priorityStyle.bg,
                color: priorityStyle.color,
              }}
            >
              {priorityStyle.label}
            </span>
          )}

          {/* Due date */}
          {dueText && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md"
              style={{
                background: task.completed
                  ? "rgba(34, 197, 94, 0.1)"
                  : isOverdue
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(249, 115, 22, 0.1)",
                color: task.completed
                  ? "#22c55e"
                  : isOverdue
                  ? "#ef4444"
                  : "#f97316",
              }}
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

        {/* Hover gradient effect */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, var(--primary-muted) 0%, transparent 50%)",
              opacity: 0.3,
            }}
          />
        )}
      </motion.div>

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
