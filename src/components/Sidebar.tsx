'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: '🏠',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      href: '/dashboard/tasks',
      label: 'Quản lý Task',
      icon: '📋',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      href: '/dashboard/pomodoro',
      label: 'Pomodoro Timer',
      icon: '⏱️',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      href: '/dashboard/stats',
      label: 'Thống kê',
      icon: '📊',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 p-6 hidden md:block shadow-xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">🎯</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Daily Focus
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Productivity Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-3">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                active
                  ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {/* Icon container */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                active
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
              }`}>
                <span className={`text-lg ${active ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                  {item.icon}
                </span>
              </div>

              {/* Label */}
              <div className="flex-1">
                <span className={`font-semibold transition-colors duration-300 ${
                  active 
                    ? 'text-white' 
                    : 'text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              </div>

              {/* Active indicator */}
              {active && (
                <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
              )}

              {/* Hover effect */}
              {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-12 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl p-4 border border-blue-100 dark:border-gray-600/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">💡</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              Mẹo hôm nay
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            Sử dụng kỹ thuật Pomodoro để tăng hiệu quả làm việc: 25 phút tập trung, 5 phút nghỉ.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;