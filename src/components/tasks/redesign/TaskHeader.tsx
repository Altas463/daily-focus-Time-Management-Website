"use client";

import { Plus } from "lucide-react";

interface TaskHeaderProps {
  onNewTask: () => void;
  tab: "board" | "planner";
  setTab: (tab: "board" | "planner") => void;
}

export default function TaskHeader({ onNewTask, tab, setTab }: TaskHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">Tasks & Planning</h1>
        <p className="text-slate-500 font-mono text-sm max-w-lg">
          {"// Design your workflow. Execute with precision."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex p-1 bg-surface-panel border border-border-subtle rounded-sm">
           <button
             onClick={() => setTab("board")}
             className={`px-4 py-1.5 text-xs font-mono font-bold rounded-sm transition-all ${
               tab === "board" 
                 ? "bg-white text-slate-900 shadow-sm" 
                 : "text-slate-500 hover:text-slate-700"
             }`}
           >
             BOARD_VIEW
           </button>
           <button
             onClick={() => setTab("planner")}
             className={`px-4 py-1.5 text-xs font-mono font-bold rounded-sm transition-all ${
               tab === "planner" 
                 ? "bg-white text-slate-900 shadow-sm" 
                 : "text-slate-500 hover:text-slate-700"
             }`}
           >
             TIME_BLOCKS
           </button>
        </div>

        <button 
          onClick={onNewTask}
          className="btn-tech-primary flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">NEW TASK</span>
        </button>
      </div>
    </div>
  );
}
