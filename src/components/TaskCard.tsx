'use client';

import { FC } from 'react';

type Task = {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  completed: boolean;
};

type TaskCardProps = {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const TaskCard: FC<TaskCardProps> = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-start gap-4">
      <div>
        <h3
          className={`text-lg font-semibold ${
            task.completed
              ? 'line-through text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-white'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{task.description}</p>
        )}
        {task.deadline && (
          <p className="text-sm text-orange-500 mt-1">📅 Deadline: {task.deadline}</p>
        )}
      </div>
      <div className="space-x-2 flex-shrink-0">
        <button
          onClick={() => onToggleComplete?.(task.id)}
          className={`px-3 py-1 rounded-lg text-white text-sm ${
            task.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {task.completed ? '↩ Hoàn tác' : '✔ Hoàn thành'}
        </button>
        <button
          onClick={() => onDelete?.(task.id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
        >
          🗑 Xoá
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
