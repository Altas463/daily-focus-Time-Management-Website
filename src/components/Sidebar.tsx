'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  CheckSquare,
  Timer,
  BarChart3,
  Settings,
  User} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutGrid, label: 'Overview', href: '/dashboard' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: Timer, label: 'Focus', href: '/dashboard/pomodoro' },
  { icon: BarChart3, label: 'Stats', href: '/dashboard/stats' },
];

const bottomItems = [
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-20 flex flex-col items-center py-6 bg-surface-panel border-r border-border-subtle fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative group flex items-center justify-center w-full aspect-square rounded-sm transition-all duration-200",
                isActive 
                  ? "bg-surface-base border border-border-default text-primary shadow-sm" 
                  : "text-slate-400 hover:bg-surface-base hover:text-slate-600"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-sm"
                />
              )}

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs font-mono rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="flex flex-col gap-4 w-full px-2 mt-auto">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative group flex items-center justify-center w-full aspect-square rounded-sm transition-all duration-200",
                isActive 
                  ? "bg-surface-base border border-border-default text-primary" 
                  : "text-slate-400 hover:bg-surface-base hover:text-slate-600"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
