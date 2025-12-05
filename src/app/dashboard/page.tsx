"use client";

import { useSession } from "next-auth/react";
import { usePomodoro } from "@/hooks/usePomodoro";
import Link from "next/link";
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
import { useEffect, useState } from "react";
import { Task } from "@/types";

export default function DashboardPage() {
  const { data: session } = useSession();
  const {
    secondsLeft,
    isRunning,
    mode,
    start,
    pause,
    reset,
  } = usePomodoro(25, 5);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

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
        setIsLoadingTasks(false);
      }
    }
    fetchTasks();
  }, []);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const taskQueue = tasks.filter((t) => !t.completed).slice(0, 3);
  
  const todaySchedule = tasks.filter((t) => {
    if (!t.startDate) return false;
    const date = new Date(t.startDate);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {getDaypartGreeting()}, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-500 font-mono text-sm">
            {"// SYSTEM_STATUS: OPTIMAL"}
          </p>
        </div>
        <Link href="/dashboard/tasks">
          <button className="btn-tech-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </Link>
      </div>

      {/* Main Grid - Masonry-ish */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Focus Control (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Timer Card */}
          <div className="bento-card bg-surface-base border-primary/20 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${mode === 'work' ? 'bg-primary' : 'bg-amber-500'}`}></div>
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${mode === 'work' ? 'text-primary' : 'text-amber-500'}`} />
                <span className="label-tech">FOCUS TIMER</span>
              </div>
              <div className={`px-2 py-0.5 text-xs font-mono rounded-sm ${mode === 'work' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-600'}`}>
                {mode === 'work' ? 'WORK MODE' : 'BREAK MODE'}
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-mono font-bold tracking-tighter text-slate-900">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-xs font-mono text-slate-400 mt-2">
                {isRunning ? 'SESSION IN PROGRESS' : 'READY TO START'}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={isRunning ? pause : start}
                className="flex-1 btn-tech-primary flex items-center justify-center gap-2"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? "PAUSE" : "START"}
              </button>
              <button 
                onClick={reset}
                className="btn-tech-secondary px-3"
                title="Reset Timer"
              >
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
              <Link href="/dashboard/tasks">
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {isLoadingTasks ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs">LOADING_TASKS...</div>
              ) : taskQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-mono text-xs">NO_ACTIVE_TASKS</div>
              ) : (
                taskQueue.map((task) => (
                  <div key={task.id} className="group flex items-start gap-3 p-3 bg-surface-panel border border-border-subtle hover:border-border-strong rounded-sm transition-colors cursor-pointer">
                    <div className={`mt-1 w-4 h-4 border rounded-sm transition-colors ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-primary'}`}></div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {task.priority && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-sm uppercase">
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <Link href="/dashboard/tasks" className="block w-full">
                <button className="w-full py-2 border border-dashed border-border-default text-slate-400 text-sm font-mono hover:border-primary hover:text-primary transition-colors rounded-sm">
                  + ADD TASK
                </button>
              </Link>
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
              {isLoadingTasks ? (
                 <div className="text-center py-4 text-slate-400 font-mono text-xs">LOADING...</div>
              ) : todaySchedule.length === 0 ? (
                <div className="text-center py-4 text-slate-400 font-mono text-xs">NO_SCHEDULED_TASKS</div>
              ) : (
                todaySchedule.map((task) => (
                  <div key={task.id} className="flex gap-3 text-sm">
                    <span className="font-mono text-slate-400">
                      {task.startDate ? new Date(task.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                    <span className="font-medium text-slate-700 truncate">{task.title}</span>
                  </div>
                ))
              )}
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
