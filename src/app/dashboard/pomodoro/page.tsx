"use client";

import BackToDashboardLink from "@/components/BackToDashboardLink";
import FocusSoundscape from "@/components/pomodoro/FocusSoundscape";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";
import { useEffect, useState } from "react";
import { Task } from "@/types";
import { CheckSquare, ArrowRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export default function PomodoroPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Focus Mode</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Deep Work Session</h1>
        <p className="text-slate-500 font-mono text-sm">
          {"// Eliminate distractions and execute your high-priority tasks."}
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Timer (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bento-card h-full flex items-center justify-center p-8 bg-surface-base border-primary/20">
             <PomodoroTimer focusMode={false} />
          </div>
        </div>

        {/* Column 2: Task Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bento-card h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span className="label-tech">SESSION QUEUE</span>
              </div>
              <Link href="/dashboard/tasks">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs">LOADING_TASKS...</div>
              ) : incompleteTasks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border-default rounded-sm">
                  <p className="text-slate-500 font-mono text-xs mb-2">NO TASKS IN QUEUE</p>
                  <Link href="/dashboard/tasks" className="text-primary text-xs font-bold hover:underline">
                    + ADD TASKS
                  </Link>
                </div>
              ) : (
                incompleteTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`group p-4 border rounded-sm transition-all cursor-pointer ${
                      index === 0 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-surface-panel border-border-subtle hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-4 h-4 border rounded-sm flex items-center justify-center ${
                        index === 0 ? "border-primary" : "border-slate-300"
                      }`}>
                        {index === 0 && <div className="w-2 h-2 bg-primary rounded-[1px]" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${index === 0 ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-mono">
                            {task.description}
                          </p>
                        )}
                        {index === 0 && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                            <span>Current Focus</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="pt-4 mt-4 border-t border-border-subtle">
               <Link href="/dashboard/tasks" className="block w-full">
                <button className="w-full py-2 border border-dashed border-border-default text-slate-400 text-sm font-mono hover:border-primary hover:text-primary transition-colors rounded-sm">
                  + MANAGE TASKS
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Column 3: Environment (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <FocusSoundscape />

          <div className="bento-card bg-slate-900 text-white border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <span className="label-tech text-slate-400">SESSION STATS</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="text-2xl font-mono font-bold">3</div>
                 <div className="text-[10px] font-mono text-slate-500 uppercase">Completed</div>
               </div>
               <div>
                 <div className="text-2xl font-mono font-bold">1.5h</div>
                 <div className="text-[10px] font-mono text-slate-500 uppercase">Focus Time</div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
