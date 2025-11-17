"use client";

import { FC, useState } from "react";
import { Task } from "@/types";
import TaskEditModal from "./TaskEditModal";
import { FiMoreHorizontal, FiClock } from "react-icons/fi";
import { formatDayMonth } from "@/utils/date";

type TaskCardProps = {
  task: Task;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
};

const TaskCard: FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const dueText = formatDayMonth(task.endDate);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
          task.completed
            ? "bg-emerald-50/50 border-emerald-200/50 dark:bg-emerald-500/10 dark:border-emerald-400/20"
            : "bg-white/80 border-slate-200/50 shadow-sm hover:shadow-md dark:bg-slate-800/80 dark:border-slate-700/50"
        }`}
      >
        <h3
          className={`text-sm font-semibold truncate ${
            task.completed
              ? "text-emerald-700/70 line-through dark:text-emerald-300/70"
              : "text-slate-900 dark:text-slate-100"
          }`}
        >
          {task.title}
        </h3>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
          aria-label="Edit task"
          role="button"
          tabIndex={0}
        >
          <FiMoreHorizontal className="text-lg" />
        </div>

        {dueText && (
          <div className="mt-3">
            <span
              className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 font-medium ${
                task.completed
                  ? "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "bg-amber-100/50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              }`}
            >
              <FiClock className="text-xs" />
              {dueText}
            </span>
          </div>
        )}
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
