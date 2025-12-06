"use client";

import { FC, useState } from "react";
import { Task } from "@/types";
import { MoreHorizontal, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { formatDayMonth } from "@/utils/date";
import TaskEditModal from "../TaskEditModal"; // Relative path to parent

type TaskCardProps = {
  task: Task;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
};

const TaskCard: FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const dueText = formatDayMonth(task.endDate);
  
  const isOverdue = task.endDate && new Date(task.endDate) < new Date() && !task.completed;

  // Simplified priority indication via sidebar color
  const getBorderColor = () => {
      if (task.completed) return "bg-emerald-500";
      switch(task.priority) {
          case 'high': return "bg-red-500";
          case 'medium': return "bg-amber-500";
          default: return "bg-slate-300";
      }
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative flex items-start gap-3 p-3 bg-white hover:bg-slate-50 border border-border-subtle hover:border-border-default rounded-sm cursor-pointer transition-all shadow-sm hover:shadow-md"
      >
        {/* Status Line */}
        <div className={`w-1 self-stretch rounded-full ${getBorderColor()} opacity-60 group-hover:opacity-100 transition-opacity`} />

        <div className="flex-1 min-w-0">
             <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-medium leading-relaxed truncate pr-2 ${task.completed ? "text-slate-400 line-through decoration-slate-300" : "text-slate-700"}`}>
                    {task.title}
                </h3>
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded-sm text-slate-400 transition-all"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </button>
             </div>

             {/* Metadata */}
             <div className="flex items-center gap-3 mt-1.5 h-5">
                {task.completed && (
                   <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      COMPLETED
                   </div>
                )}
                
                {!task.completed && dueText && (
                   <div className={`flex items-center gap-1 text-[10px] font-mono font-medium ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                      {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {dueText}
                   </div>
                )}

                {/* Priority Label for screen readers / visual clarity if needed */}
                {!task.completed && task.priority && task.priority !== 'low' && (
                    <div className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-wider border ${
                        task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                        {task.priority}
                    </div>
                )}
             </div>
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
