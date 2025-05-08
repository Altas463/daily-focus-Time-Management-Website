'use client';

import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4 hidden md:block">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Daily Focus</h2>
      <nav className="space-y-3">
        <Link href="/dashboard/tasks" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600">
          📋 Task
        </Link>
        <Link href="/dashboard/pomodoro" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600">
          ⏱️ Pomodoro
        </Link>
        <Link href="/dashboard/stats" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600">
          📊 Thống kê
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
