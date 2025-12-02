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
    <aside className="hidden w-72 shrink-0 md:block">
      <div
        className="sticky top-0 h-screen overflow-y-auto px-4 py-6"
        style={{
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-8 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--primary)' }}
          >
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Daily Focus
            </h2>
            <p
              className="text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              Productivity Hub
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <h3
                className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em]"
                style={{ color: 'var(--text-muted)' }}
              >
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
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                      style={{
                        background: active
                          ? 'var(--primary-muted)'
                          : 'transparent',
                        color: active
                          ? 'var(--primary)'
                          : 'var(--text-secondary)',
                      }}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                          style={{ background: 'var(--primary)' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}

                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: active
                            ? 'var(--primary)'
                            : 'var(--surface-secondary)',
                          color: active ? 'white' : 'inherit',
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <span
                        className={`flex-1 text-sm ${active ? 'font-semibold' : 'font-medium'}`}
                        style={{
                          color: active ? 'var(--text-primary)' : 'inherit',
                        }}
                      >
                        {item.label}
                      </span>

                      <ChevronRight
                        className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-50 group-hover:translate-x-0"
                        style={{
                          opacity: active ? 0.7 : undefined,
                          transform: active ? 'translateX(0)' : undefined,
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div
          className="my-6 h-px"
          style={{ background: 'var(--border)' }}
        />

        {/* Pro Tip Card */}
        <div
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background: 'var(--primary)',
          }}
        >
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
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
                Pro Tip
              </span>
            </div>

            <p className="text-sm leading-relaxed text-white/90">
              Try a Pomodoro session: 25 min focus + 5 min break for peak productivity.
            </p>

            <Link
              href="/dashboard/pomodoro"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-white hover:gap-2 transition-all"
            >
              Start Timer
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className="mt-4 p-4 rounded-xl"
          style={{
            background: 'var(--surface-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--text-muted)' }}
            >
              Today&apos;s Progress
            </span>
            <span
              className="text-xs font-bold"
              style={{ color: 'var(--primary)' }}
            >
              75%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--border)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'var(--primary)' }}
            />
          </div>

          <div
            className="flex items-center justify-between mt-3 text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span>3 of 4 tasks done</span>
            <span className="font-medium" style={{ color: 'var(--accent)' }}>
              On track
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
