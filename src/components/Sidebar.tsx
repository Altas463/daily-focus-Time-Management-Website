'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  {
    title: 'TỔNG QUAN',
    tone: 'primary',
    items: [{ href: '/dashboard', label: 'Dashboard' }],
  },
  {
    title: 'LÀM VIỆC',
    tone: 'work',
    items: [
      { href: '/dashboard/tasks', label: 'Quản lý Task' },
      { href: '/dashboard/pomodoro', label: 'Pomodoro Timer' },
    ],
  },
  {
    title: 'BÁO CÁO',
    tone: 'report',
    items: [{ href: '/dashboard/stats', label: 'Thống kê' }],
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
      <div className="sticky top-0 h-screen overflow-y-auto border-r border-gray-200 bg-white px-5 py-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Focus</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Productivity Dashboard</p>
        </div>

        <nav className="space-y-8">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  {group.title}
                </h3>
                <div aria-hidden className="ml-3 h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'group relative grid grid-cols-[4px,1fr] items-center rounded-lg border px-0 py-0 transition',
                        active
                          ? 'border-gray-900 bg-gray-900 text-white shadow-sm dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'h-full rounded-l-lg transition-colors',
                          active ? toneColors[group.tone] : 'bg-gray-200 dark:bg-gray-700',
                        ].join(' ')}
                        aria-hidden
                      />

                      <div className="flex items-center justify-between px-4 py-3">
                        <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                          {item.label}
                        </span>
                        {active && (
                          <span
                            aria-hidden
                            className={`h-1.5 w-6 rounded-full ${toneColors[group.tone]} dark:opacity-90`}
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="my-8 h-px w-full bg-gray-200 dark:bg-gray-800" />

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
              Gợi ý hôm nay
            </span>
            <span className="h-1 w-8 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden />
          </div>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            Thử hoàn thành một vòng Pomodoro: 25 phút tập trung và 5 phút nghỉ ngắn để duy trì nhịp làm việc.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
