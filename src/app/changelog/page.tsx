"use client";

import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";

const releases = [
  {
    version: "2.0.4",
    date: "2024-12-04",
    type: "STABLE",
    changes: [
      "GLOBAL: Refactored dashboard to new 'Bento Grid' layout.",
      "UI: Implemented 'Architectural Productivity' design system.",
      "FEAT: Added 'Workspace Intelligence' module.",
      "FIX: Improved Pomodoro timer accuracy on background tab throttling.",
    ]
  },
  {
    version: "2.0.0",
    date: "2024-11-20",
    type: "MAJOR",
    changes: [
      "CORE: Complete rewrite of state management engine.",
      "FEAT: Added persistent tasks and project boards.",
      "UI: Dark mode overhaul.",
    ]
  },
  {
    version: "1.5.0",
    date: "2024-10-15",
    type: "FEATURE",
    changes: [
      "FEAT: Added 'Focus Soundscapes' (Brown Noise, White Noise).",
      "UX: Simplified navigation structure.",
    ]
  }
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-6">
         <div className="max-w-3xl mx-auto space-y-12">
            <header>
               <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-mono mb-6">
                 <ArrowLeft className="w-3 h-3" /> RETURN_HOME
               </Link>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">System Changelog</h1>
               <p className="text-slate-500 font-mono">
                  {"// Tracking the evolution of the Daily Focus system."}
               </p>
            </header>

            <div className="space-y-12 relative border-l border-border-default ml-3 pl-8">
               {releases.map((release) => (
                  <div key={release.version} className="relative">
                     <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-surface-base border-2 border-primary"></span>
                     
                     <div className="flex items-center gap-4 mb-4">
                        <h2 className="text-2xl font-bold font-mono">{release.version}</h2>
                        <span className="px-2 py-0.5 bg-surface-panel border border-border-subtle rounded-sm text-[10px] font-mono font-bold text-slate-500 uppercase">
                           {release.date}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-sm text-[10px] font-mono font-bold uppercase">
                           {release.type}
                        </span>
                     </div>

                     <ul className="space-y-3">
                        {release.changes.map((change, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                              <Tag className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                              <span className="font-mono">{change}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
               ))}
            </div>
         </div>
      </main>

      <footer className="py-8 border-t border-border-subtle bg-surface-base text-center">
         <div className="font-mono text-xs text-slate-400">
           DAILY FOCUS © 2024
         </div>
      </footer>
    </div>
  );
}
