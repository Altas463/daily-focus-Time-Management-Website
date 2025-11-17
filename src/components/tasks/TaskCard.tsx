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
        className="relative p-4 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition"
      >
        <h3
          className={`text-sm font-medium ${
            task.completed
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-800 dark:text-white"
          }`}
        >
          {task.title}
        </h3>

        {/* Button to open modal in top right with modern icon */}
         <div
           onClick={(e) => {
             e.stopPropagation();
             setShowModal(true);
           }}
           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
           aria-label="Edit task"
          role="button"
          tabIndex={0}
        >
          <FiMoreHorizontal />
        </div>

        {/* Show time in the bottom corner, change color based on completion status */}
        {dueText && (
          <div className="mt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1
                ${
                  task.completed
                    ? "bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-200"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200"
                }
              `}
            >
              <FiClock />
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
