
import { BarChart3 } from "lucide-react";

interface TaskStatsProps {
  total: number;
  completed: number;
  active: number;
}

export default function TaskStats({ total, completed, active }: TaskStatsProps) {
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-6 px-4 py-2 border border-border-subtle rounded-sm bg-surface-panel/50 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <span className="label-tech text-[10px]">PROGRESS</span>
      </div>
      
      <div className="h-4 w-px bg-border-subtle" />

      <div className="flex gap-4">
        <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Total</span>
            <span className="text-xs font-mono font-bold">{total}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Active</span>
            <span className="text-xs font-mono font-bold text-amber-600">{active}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Done</span>
            <span className="text-xs font-mono font-bold text-emerald-600">{completed}</span>
        </div>
      </div>

      <div className="items-center gap-2 hidden sm:flex">
         <div className="h-2 w-24 bg-surface-base border border-border-subtle rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
         </div>
         <span className="text-[10px] font-mono font-bold text-slate-400">{progress}%</span>
      </div>
    </div>
  );
}
