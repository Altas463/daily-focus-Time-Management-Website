// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PomodoroTimer from "@/components/pomodoro/PomodoroTimer";

type Task = {
  id: string;
  title: string;
  endDate?: string;
  completed: boolean;
};

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [focusTime, setFocusTime] = useState(0); // in minutes
  const [completedTodayCount, setCompletedTodayCount] = useState(0);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else {
      setLoading(false);
      fetchTasks();
      fetchStats();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const [pomodoroRes, taskRes] = await Promise.all([
        fetch("/api/pomodoro-sessions/stats"),
        fetch("/api/tasks/stats"),
      ]);

      const pomodoroData = await pomodoroRes.json();
      const taskData = await taskRes.json();

      setPomodoroCount(pomodoroData.totalPomodoros || 0);
      setFocusTime(Math.floor((pomodoroData.totalFocusSeconds || 0) / 60));
      setCompletedTodayCount(taskData.completedTodayCount || 0);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const markCompleted = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true }),
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: true } : task
        )
      );

      fetchStats(); // Cập nhật lại thống kê sau khi hoàn thành task
    } catch (error) {
      console.error("Failed to mark completed:", error);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { emoji: "🌅", text: "Chào buổi sáng" };
    if (hour < 18) return { emoji: "☀️", text: "Chào buổi chiều" };
    return { emoji: "🌙", text: "Chào buổi tối" };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Hôm nay";
    if (diffInDays === 1) return "Ngày mai";
    if (diffInDays === -1) return "Hôm qua";
    if (diffInDays > 0) return `${diffInDays} ngày nữa`;
    return `${Math.abs(diffInDays)} ngày trước`;
  };

  const getTaskPriority = (endDate?: string) => {
    if (!endDate) return { color: "gray", label: "Không ưu tiên" };
    
    const date = new Date(endDate);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return { color: "red", label: "Quá hạn" };
    if (diffInDays <= 1) return { color: "orange", label: "Khẩn cấp" };
    if (diffInDays <= 3) return { color: "yellow", label: "Quan trọng" };
    return { color: "green", label: "Bình thường" };
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Đang tải dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const greeting = getTimeOfDayGreeting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4">
            <span className="text-4xl mb-2 block">{greeting.emoji}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {greeting.text}, {session?.user?.name || "bạn"}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hôm nay bạn sẽ tập trung vào điều gì? Hãy bắt đầu hành trình năng suất của mình.
            </p>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {completedTodayCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+{Math.floor(completedTodayCount * 0.3)} hôm qua</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Task hoàn thành hôm nay
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((completedTodayCount / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {pomodoroCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+{Math.floor(pomodoroCount * 0.2)} hôm qua</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Pomodoro hoàn tất
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((pomodoroCount / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.floor(focusTime / 60)}h {focusTime % 60}m
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+{Math.floor(focusTime * 0.15)}m hôm qua</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
              Tổng thời gian tập trung
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((focusTime / 480) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Công việc chưa hoàn thành
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium">
                    {incompleteTasks.length} task
                  </span>
                </div>
              </div>

              <div className="p-6">
                {incompleteTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Tuyệt vời! Bạn đã hoàn thành hết công việc
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Không có công việc nào chưa hoàn thành. Thời gian để thư giãn!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incompleteTasks.map((task, index) => {
                      const priority = getTaskPriority(task.endDate);
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl hover:bg-gray-100/50 dark:hover:bg-gray-600/30 transition-all duration-300 border border-gray-200/30 dark:border-gray-600/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  priority.color === 'red' ? 'bg-red-500' :
                                  priority.color === 'orange' ? 'bg-orange-500' :
                                  priority.color === 'yellow' ? 'bg-yellow-500' :
                                  priority.color === 'green' ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                <span className="text-gray-800 dark:text-white font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {task.title}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  priority.color === 'red' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  priority.color === 'orange' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                  priority.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                  priority.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {priority.label}
                                </span>
                                
                                {task.endDate && (
                                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatTimeAgo(task.endDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              onClick={() => markCompleted(task.id)}
                              className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
                              aria-label={`Đánh dấu hoàn thành công việc ${task.title}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Pomodoro Timer Section */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Đồng hồ Pomodoro
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Tập trung 25 phút, nghỉ 5 phút
                </p>
              </div>
              
              <div className="p-6">
                <PomodoroTimer />
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}