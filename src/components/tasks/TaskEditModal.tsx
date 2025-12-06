"use client";

import { FC, useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Save, Trash2, X, Calendar, Clock } from "lucide-react";
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

  // Focus title on mount
  // const titleRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   titleRef.current?.focus();
  // }, []);

  const startPickerRef = useRef<HTMLDivElement>(null);
  const endPickerRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
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
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete?.(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-base border border-border-default shadow-2xl rounded-sm flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
           <div>
               <span className="label-tech mb-1 block">EDIT_TASK_ID: {task.id.slice(0, 8)}</span>
               <h2 className="text-xl font-display font-bold text-slate-900">Task Details</h2>
           </div>
           <button
            onClick={onClose}
            className="p-2 hover:bg-surface-panel text-slate-400 hover:text-slate-600 rounded-sm transition-colors"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
               Title Statement
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold font-display text-slate-800 bg-transparent border-b-2 border-border-default focus:border-primary outline-none py-2 placeholder-slate-300 transition-colors"
              placeholder="Task title..."
            />
          </div>

          {/* Time Controls */}
          <div className="grid md:grid-cols-2 gap-6">
             {/* Start Date */}
             <div className="relative" ref={startPickerRef}>
                <label className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2 block">
                   Start Timeline
                </label>
                <button
                  onClick={() => setShowStartPicker(!showStartPicker)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface-panel border border-border-default hover:border-emerald-500/50 rounded-sm transition-all group"
                > 
                   <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span className="font-mono text-sm font-bold text-slate-700">
                         {startDate ? formatDayMonth(startDate.toISOString()) : "Unscheduled"}
                      </span>
                   </div>
                   {startDate && <span className="text-[10px] font-mono text-slate-400">{startDate.getFullYear()}</span>}
                </button>
                
                {showStartPicker && (
                  <div className="absolute top-full left-0 z-50 mt-2 p-2 bg-white border border-border-default shadow-xl rounded-sm">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                          setStartDate(date);
                          setShowStartPicker(false);
                      }}
                      inline
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </div>
                )}
             </div>

             {/* End Date */}
             <div className="relative" ref={endPickerRef}>
                <label className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider mb-2 block">
                   Due Deadline
                </label>
                <button
                  onClick={() => setShowEndPicker(!showEndPicker)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-surface-panel border border-border-default hover:border-red-500/50 rounded-sm transition-all group"
                > 
                   <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="font-mono text-sm font-bold text-slate-700">
                         {endDate ? formatDayMonth(endDate.toISOString()) : "No Deadline"}
                      </span>
                   </div>
                   {endDate && <span className="text-[10px] font-mono text-slate-400">{endDate.getFullYear()}</span>}
                </button>
                
                {showEndPicker && (
                  <div className="absolute top-full left-0 z-50 mt-2 p-2 bg-white border border-border-default shadow-xl rounded-sm">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                          setEndDate(date);
                          setShowEndPicker(false);
                      }}
                      inline
                      showTimeSelect
                      dateFormat="Pp"
                    />
                  </div>
                )}
             </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
               Directives / Notes
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task details..."
              className="w-full p-4 bg-surface-panel border border-border-default rounded-sm text-sm font-mono text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-surface-panel/30 flex justify-between items-center rounded-b-sm">
             <button
               onClick={handleDelete}
               className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-sm transition-colors uppercase tracking-wider"
             >
               <Trash2 className="w-4 h-4" />
               Delete Entity
             </button>

             <div className="flex gap-3">
               <button
                 onClick={onClose}
                 className="btn-tech-secondary px-6"
               >
                 Cancel
               </button>
               <button
                 onClick={handleSave}
                 disabled={!title.trim()}
                 className="btn-tech-primary px-6 flex items-center gap-2"
               >
                 <Save className="w-4 h-4" />
                 Save Changes
               </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
