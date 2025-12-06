"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-6">
      {/* Central Icon */}
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface-panel border border-border-subtle shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
      </div>
      
      {/* Text Info */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-display font-bold text-slate-900 tracking-widest uppercase">
          Initializing
        </h2>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
           <span>ESTABLISHING_CONNECTION</span>
           <span className="animate-pulse">...</span>
        </div>
      </div>

      {/* Loading Bar Visual */}
      <div className="w-48 h-1 bg-surface-panel rounded-full overflow-hidden mt-2 border border-border-subtle">
        <div className="h-full bg-primary animate-pulse w-2/3 rounded-full" />
      </div>
    </div>
  );
}
