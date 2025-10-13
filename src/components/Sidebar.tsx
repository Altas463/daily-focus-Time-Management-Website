'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

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

  const isActive = (href: string) => (href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href));

  const tones = {
    primary: 'from-blue-500 via-fuchsia-500 to-emerald-500',
    work: 'from-emerald-500 via-teal-500 to-green-500',
    report: 'from-fuchsia-500 via-purple-500 to-blue-500',
  } as const;

  return (
    <aside className="hidden w-72 shrink-0 md:block">
      <div className="sticky top-0 h-screen overflow-y-auto border-r border-black/5 bg-white/70 px-5 py-6 backdrop-blur-xl shadow-sm dark:border-white/10 dark:bg-white/5">
        {/* Brand */}
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Daily Focus</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Productivity Dashboard</p>
        </div>

        {/* Groups */}
        <nav className="space-y-8">
          {groups.map((g) => (
            <div key={g.title} className="relative">
              {/* Section header */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  {g.title}
                </h3>
                {/* neutral hairline to reduce color noise */}
                <div aria-hidden className="ml-3 h-[2px] flex-1 rounded bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
              </div>

              <div className="space-y-2">
                {g.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'group relative grid grid-cols-[4px,1fr] items-center rounded-2xl border px-0 py-0 transition',
                        active
                          ? 'border-black/5 bg-gray-900 text-white shadow-lg dark:border-white/10 dark:bg-white dark:text-gray-900'
                          : 'border-transparent text-gray-700 hover:bg-gray-100/70 dark:text-gray-200 dark:hover:bg-white/10',
                      ].join(' ')}
                    >
                      {/* left bar: colored only when active, neutral on rest */}
                      <div
                        className={[
                          'h-full rounded-l-2xl transition-opacity',
                          active
                            ? `bg-gradient-to-b ${tones[g.tone]} opacity-90`
                            : 'bg-gray-200/60 dark:bg-gray-700/50 opacity-70 group-hover:opacity-90',
                        ].join(' ')}
                        aria-hidden
                      />

                      {/* content */}
                      <div className="relative flex items-center justify-between px-4 py-3">
                        <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        {/* active indicator: thin gradient pill (only on active) */}
                        {active && (
                          <span aria-hidden className={`h-1.5 w-10 rounded-full bg-gradient-to-r ${tones[g.tone]} opacity-90`} />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

        {/* Tip card (text-only) */}
        <div className="rounded-2xl border border-black/5 bg-white/70 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.12em] text-gray-500 dark:text-gray-400">MẸO HÔM NAY</span>
            <span className="h-1 w-10 rounded-full bg-gray-300 dark:bg-white/20" aria-hidden />
          </div>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            Thử chu kỳ Pomodoro: 25 phút tập trung và 5 phút nghỉ. Bắt đầu bằng một task nhỏ để tạo đà.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
