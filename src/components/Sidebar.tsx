'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  {
    title: 'OVERVIEW',
    tone: 'primary',
    items: [{ href: '/dashboard', label: 'Dashboard' }],
  },
  {
    title: 'WORK',
    tone: 'work',
    items: [
      { href: '/dashboard/tasks', label: 'Tasks' },
      { href: '/dashboard/projects', label: 'Project Hub' },
      { href: '/dashboard/pomodoro', label: 'Pomodoro Timer' },
    ],
  },
  {
    title: 'REPORTS',
    tone: 'report',
    items: [
      { href: '/dashboard/stats', label: 'Reports' },
      { href: '/dashboard/review', label: 'Review & Reflect' },
    ],
  },
] as const;

const toneColors = {
  primary: 'bg-slate-900',
  work: 'bg-emerald-600',
  report: 'bg-blue-600',
} as const;

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <aside className="hidden w-72 shrink-0 md:block">
      <div className="sticky top-0 h-screen overflow-y-auto border-r border-slate-200/50 bg-white/80 backdrop-blur-sm px-5 py-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/80">
        <div className="mb-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Daily Focus</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Stay organized, stay focused</p>
        </div>

        <nav className="space-y-8">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? 'bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white shadow-lg shadow-blue-500/20'
                          : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${
                        active 
                          ? 'bg-white' 
                          : `${toneColors[group.tone]} opacity-40`
                      }`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="my-8 h-px w-full bg-slate-200/50 dark:bg-slate-700/50" />

        <div className="rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 p-4 dark:border-blue-400/20 dark:from-blue-500/10 dark:to-cyan-500/10">
          <div className="mb-2 flex items-start justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">
              💡 Pro tip
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Use Pomodoro sessions: 25 min focus + 5 min break. Perfect for deep work.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


