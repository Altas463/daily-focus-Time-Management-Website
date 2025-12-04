"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Plus,
  MoreHorizontal,
  Clock,
  Calendar,
  ArrowUpRight
} from "lucide-react";
import { getDaypartGreeting } from "@/utils/date";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {getDaypartGreeting()}, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-500 font-mono text-sm">
            // SYSTEM_STATUS: OPTIMAL
          </p>
        </div>
        <button className="btn-tech-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Main Grid - Masonry-ish */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Focus Control (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timer Card */}
          <div className="bento-card bg-surface-base border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="label-tech">FOCUS TIMER</span>
              </div>
              <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded-sm">
                WORK MODE
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-mono font-bold tracking-tighter text-slate-900">
                25:00
              </div>
              <div className="text-xs font-mono text-slate-400 mt-2">
                SESSION 3/4
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 btn-tech-primary flex items-center justify-center gap-2"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? "PAUSE" : "START"}
              </button>
              <button className="btn-tech-secondary px-3">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bento-card p-4">
              <span className="label-tech mb-2">STREAK</span>
              <div className="text-2xl font-mono font-bold">12</div>
              <div className="text-xs text-slate-400">DAYS</div>
            </div>
            <div className="bento-card p-4">
              <span className="label-tech mb-2">FOCUS</span>
              <div className="text-2xl font-mono font-bold">4.5</div>
              <div className="text-xs text-slate-400">HOURS</div>
            </div>
          </div>
        </div>

        {/* Column 2: Active Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bento-card h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-slate-400" />
                <span className="label-tech">TASK QUEUE</span>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { title: "Refactor Authentication Flow", tag: "DEV", urgent: true },
                { title: "Update Documentation", tag: "DOCS", urgent: false },
                { title: "Design System Review", tag: "DESIGN", urgent: false },
              ].map((task, i) => (
                <div key={i} className="group flex items-start gap-3 p-3 bg-surface-panel border border-border-subtle hover:border-border-strong rounded-sm transition-colors cursor-pointer">
                  <div className="mt-1 w-4 h-4 border border-slate-300 rounded-sm group-hover:border-primary transition-colors"></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-slate-900">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-sm">
                        {task.tag}
                      </span>
                      {task.urgent && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-red-50 text-red-600 rounded-sm">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-2 border border-dashed border-border-default text-slate-400 text-sm font-mono hover:border-primary hover:text-primary transition-colors rounded-sm">
                + ADD TASK
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Insights/Calendar (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bento-card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="label-tech">SCHEDULE</span>
            </div>
            <div className="space-y-4">
              {[
                { time: "10:00", title: "Team Sync" },
                { time: "14:00", title: "Deep Work" },
                { time: "16:30", title: "Wrap Up" },
              ].map((event, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="font-mono text-slate-400">{event.time}</span>
                  <span className="font-medium text-slate-700">{event.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card bg-slate-900 text-white border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <span className="label-tech text-slate-400">PRO TIP</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300">
              Use <span className="font-mono text-primary">CMD+K</span> to quickly access your task queue without leaving the keyboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
