"use client";

import { FC, useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  completed: boolean;
};

type TaskCardProps = {
  task: Task;
  onToggleComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<Task>) => void;
};

function formatDateForInput(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

const TaskCard: FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description || "",
    startDate: formatDateForInput(task.startDate || ""),
    endDate: formatDateForInput(task.endDate || ""),
  });

  const handleSave = () => {
    onUpdate?.(task.id, { ...editedTask });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg shadow space-y-2">
        <input
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          placeholder="Tiêu đề task"
        />
        <textarea
          className="w-full p-2 rounded border dark:bg-gray-800"
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          placeholder="Mô tả"
        />

        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Ngày bắt đầu
            </p>
            <input
              type="datetime-local"
              className="w-full p-2 rounded border dark:bg-gray-800"
              value={editedTask.startDate}
              onChange={(e) =>
                setEditedTask({ ...editedTask, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Ngày kết thúc
            </p>
            <input
              type="datetime-local"
              className="w-full p-2 rounded border dark:bg-gray-800"
              value={editedTask.endDate}
              onChange={(e) =>
                setEditedTask({ ...editedTask, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            💾 Lưu
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ✖ Huỷ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-start gap-4">
      <div>
        <h3
          className={`text-lg font-semibold ${
            task.completed
              ? "line-through text-gray-400 dark:text-gray-500"
              : "text-gray-800 dark:text-white"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
        )}
        {task.startDate && (
          <p className="text-sm text-green-500 mt-1">
            📅 Bắt đầu:{" "}
            {new Date(task.startDate).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
        {task.endDate && (
          <p className="text-sm text-orange-500 mt-1">
            📅 Deadline:{" "}
            {new Date(task.endDate).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
      <div className="space-x-2 flex-shrink-0">
        <button
          onClick={() => onToggleComplete?.(task.id)}
          className={`px-3 py-1 rounded-lg text-white text-sm ${
            task.completed
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {task.completed ? "↩ Hoàn tác" : "✔ Hoàn thành"}
        </button>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
        >
          ✏️ Sửa
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
