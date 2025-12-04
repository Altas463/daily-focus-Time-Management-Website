'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Timer,
  BarChart3,
  BookOpen,
  Target,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

const groups = [
  {
    title: 'OVERVIEW',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'WORKSPACE',
    items: [
      { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/dashboard/projects', label: 'Project Hub', icon: FolderKanban },
      { href: '/dashboard/pomodoro', label: 'Pomodoro Timer', icon: Timer },
    ],
  },
  {
    title: 'INSIGHTS',
    items: [
      { href: '/dashboard/stats', label: 'Reports', icon: BarChart3 },
      { href: '/dashboard/review', label: 'Review & Reflect', icon: BookOpen },
    ],
  },
] as const;

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside className="hidden w-72 shrink-0 md:block bg-white border-r border-slate-200">
      <div className="sticky top-0 h-screen overflow-y-auto px-4 py-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-8 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Daily Focus
            </h2>
            <p className="text-xs text-slate-500">
              Productivity Hub
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.title}
              </h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        active 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-blue-600"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 ${
                        active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <span className={`flex-1 text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                        {item.label}
                      </span>

                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-200 ${
                          active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Pro Tip Card */}
        <div className="relative overflow-hidden rounded-xl bg-blue-600 p-4 text-white shadow-lg shadow-blue-200">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Pro Tip
              </span>
            </div>

            <p className="text-sm leading-relaxed text-blue-50">
              Try a Pomodoro session: 25 min focus + 5 min break for peak productivity.
            </p>

            <Link
              href="/dashboard/pomodoro"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-white hover:gap-2 transition-all"
            >
              Start Timer
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">
              Today&apos;s Progress
            </span>
            <span className="text-xs font-bold text-blue-600">
              75%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <span>3 of 4 tasks done</span>
            <span className="font-medium text-green-600">
              On track
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
