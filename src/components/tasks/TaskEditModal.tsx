"use client";

import { FC, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiSave, FiTrash2, FiX, FiCalendar } from "react-icons/fi";
import { Task } from "@/types";
import { formatDayMonth } from "@/utils/date";

type Props = {
  task: Task;
  onClose: () => void;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
};

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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 overflow-y-auto p-6">
      <div className="relative w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md rounded-full w-8 h-8 flex items-center justify-center z-50"
          aria-label="Đóng"
        >
          <FiX />
        </button>
        {/* Modal content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 p-8 pt-10 shadow-lg dark:border-gray-800">
          {/* Title */}
          <div className="mb-8">
            <label className="block text-base font-bold text-blue-600 dark:text-blue-400 mb-3 tracking-wide">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề task..."
              className="w-full text-2xl font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-900 border-0 border-b-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 rounded-t-md transition"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-base font-bold text-blue-600 dark:text-blue-400 mb-3 tracking-wide">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm mô tả..."
              className="w-full p-4 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 resize-none transition"
            />
          </div>

          {/* Time pickers */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Start Date */}
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-4 flex flex-col gap-2 relative">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <FiCalendar className="text-base text-blue-400 dark:text-blue-300" />
                  Bắt đầu
                </span>
                <button
                  onClick={() => setShowStartPicker(!showStartPicker)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100/70 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition font-medium"
                >
                  <span>{formatDayMonth(startDate) || 'Chon ngay'}</span>
                </button>
                {showStartPicker && (
                  <div className="absolute z-40 mt-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      inline
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      calendarClassName="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                )}
              </div>
              {/* End Date */}
              <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-4 flex flex-col gap-2 relative">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <FiCalendar className="text-base text-pink-400 dark:text-pink-300" />
                  Kết thúc
                </span>
                <button
                  onClick={() => setShowEndPicker(!showEndPicker)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100/70 dark:bg-gray-900/70 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-200/80 dark:hover:bg-gray-800/80 transition font-medium"
                >
                  <span>{formatDayMonth(endDate) || 'Chon ngay'}</span>
                </button>
                {showEndPicker && (
                  <div className="absolute z-40 mt-2">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      inline
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      calendarClassName="rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 items-center mt-8">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition font-semibold"
            >
              <FiTrash2 />
              Xoá
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center gap-2 px-7 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60 shadow-sm transition font-semibold"
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
