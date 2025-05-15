"use client";

import { FC, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSave, FiTrash2, FiX, FiCalendar } from "react-icons/fi";
import { Task } from "@/types";

type Props = {
  task: Task;
  onClose: () => void;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
};

function formatShortDate(date: Date | null) {
  if (!date) return "Chọn ngày";
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
  };
  return date.toLocaleDateString("vi-VN", options);
}

const TaskEditModal: FC<Props> = ({ task, onClose, onUpdate, onDelete }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [startDate, setStartDate] = useState<Date | null>(
    task.startDate ? new Date(task.startDate) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    task.endDate ? new Date(task.endDate) : null
  );

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // Đóng picker khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startPickerRef.current &&
        !startPickerRef.current.contains(event.target as Node)
      ) {
        setShowStartPicker(false);
      }
      if (
        endPickerRef.current &&
        !endPickerRef.current.contains(event.target as Node)
      ) {
        setShowEndPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStartDate(task.startDate ? new Date(task.startDate) : null);
    setEndDate(task.endDate ? new Date(task.endDate) : null);
  }, [task]);

  const handleSave = () => {
    onUpdate?.(task.id, {
      title,
      description,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xoá task này?")) {
      onDelete?.(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-start z-50 overflow-y-auto p-6">
      <div className="relative w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md rounded-full w-8 h-8 flex items-center justify-center z-50"
          aria-label="Đóng"
        >
          <FiX />
        </button>
        {/* Modal content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 pt-8">
          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề task..."
            className="w-full text-2xl font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 mb-6"
          />

          {/* Description */}
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thêm mô tả..."
            className="w-full p-3 mb-6 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none resize-none"
          />

          {/* Time pickers */}
          <div className="flex gap-4 mb-6">
            <div className="relative" ref={startPickerRef}>
              <button
                onClick={() => setShowStartPicker(!showStartPicker)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiCalendar />
                <span>{formatShortDate(startDate)}</span>
              </button>
              {showStartPicker && (
                <div className="absolute z-20 mt-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    calendarClassName="rounded-md shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              )}
            </div>

            <div className="relative" ref={endPickerRef}>
              <button
                onClick={() => setShowEndPicker(!showEndPicker)}
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FiCalendar />
                <span>{formatShortDate(endDate)}</span>
              </button>
              {showEndPicker && (
                <div className="absolute z-20 mt-2">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    inline
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    calendarClassName="rounded-md shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
            >
              <FiTrash2 />
              Xoá
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center gap-2 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <FiSave />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
