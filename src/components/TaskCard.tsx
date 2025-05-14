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

  const handleCancel = () => {
    setEditedTask({
      title: task.title,
      description: task.description || "",
      startDate: formatDateForInput(task.startDate || ""),
      endDate: formatDateForInput(task.endDate || ""),
    });
    setIsEditing(false);
  };

  const formatDescription = (description: string) => {
    return description.split("\n").map((line, index) => (
      <p key={index} className="text-sm text-gray-500 dark:text-gray-400">
        {line}
      </p>
    ));
  };

  return (
    <div className="relative p-5 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3 group">
      <div className="flex justify-between items-center">
        <div>
          {/* Tiêu đề task */}
          {isEditing ? (
            <input
              className="text-lg font-semibold text-gray-800 dark:text-white w-full bg-transparent border-b dark:border-gray-500 focus:outline-none"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />
          ) : (
            <h3
              className={`text-lg font-semibold ${
                task.completed
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-800 dark:text-white"
              }`}
            >
              {task.title}
            </h3>
          )}

          {isEditing ? (
            <textarea
              className="w-full p-2 mt-2 bg-transparent text-gray-800 dark:text-white border-b dark:border-gray-500 focus:outline-none"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              rows={4}
              placeholder="Mô tả"
            />
          ) : (
            task.description && formatDescription(task.description)
          )}
        </div>

        {/* Nút chỉnh sửa khi hover */}
        <div className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 flex gap-2 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
              >
                💾 Lưu
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg"
              >
                ✖ Huỷ
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Thông tin ngày */}
      <div className="text-sm space-y-1 mt-3">
        {isEditing ? (
          <div className="flex gap-4">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium">
                Bắt đầu
              </label>
              <input
                type="datetime-local"
                id="startDate"
                className="w-full p-2 mt-2 bg-transparent text-gray-800 dark:text-white border-b dark:border-gray-500 focus:outline-none"
                value={editedTask.startDate}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium">
                Kết thúc
              </label>
              <input
                type="datetime-local"
                id="endDate"
                className="w-full p-2 mt-2 bg-transparent text-gray-800 dark:text-white border-b dark:border-gray-500 focus:outline-none"
                value={editedTask.endDate}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, endDate: e.target.value })
                }
              />
            </div>
          </div>
        ) : (
          <>
            {task.startDate && (
              <p className="text-green-600 dark:text-green-400">
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
              <p className="text-orange-600 dark:text-orange-400">
                ⏰ Deadline:{" "}
                {new Date(task.endDate).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </>
        )}
      </div>

      {/* Dòng trạng thái task */}
      <div className="mt-4">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            task.completed
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
          }`}
        >
          {task.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
