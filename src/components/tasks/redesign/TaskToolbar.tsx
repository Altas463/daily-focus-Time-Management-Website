"use client";

import { Search, LayoutTemplate } from "lucide-react";

interface TaskToolbarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filter: "all" | "dueSoon" | "overdue";
  setFilter: (val: "all" | "dueSoon" | "overdue") => void;
  onApplyTemplate: (templateIndex: number) => void;
}

const filterOptions = [
    { key: "all", label: "All" },
    { key: "dueSoon", label: "Upcoming" },
    { key: "overdue", label: "Overdue" },
] as const;

export default function TaskToolbar({ 
    searchTerm, 
    setSearchTerm, 
    filter, 
    setFilter,
    onApplyTemplate
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search & Filter Group */}
        <div className="flex flex-1 w-full sm:w-auto items-center gap-3">
            <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-base border border-border-default rounded-sm py-1.5 pl-8 pr-3 text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
            </div>
            
            <div className="flex items-center bg-surface-base border border-border-default rounded-sm p-0.5">
               {filterOptions.map(opt => (
                   <button
                        key={opt.key}
                        onClick={() => setFilter(opt.key)}
                        className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-colors ${
                            filter === opt.key 
                            ? "bg-slate-100 text-slate-900" 
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                   >
                       {opt.label}
                   </button>
               ))}
            </div>
        </div>

        {/* Templates (Quick Actions) */}
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase hidden md:inline">Quick Add:</span>
            <div className="flex gap-2">
                {["Daily Plan", "Recap"].map((label, idx) => (
                    <button 
                        key={label}
                        onClick={() => onApplyTemplate(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-border-default hover:border-primary hover:text-primary text-slate-500 rounded-sm text-xs font-mono transition-colors"
                    >
                        <LayoutTemplate className="w-3 h-3" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
