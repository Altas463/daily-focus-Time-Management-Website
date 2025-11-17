'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/dashboard/pomodoro';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
      {!hideNav && (
        <aside className="hidden shrink-0 md:block">
          <Sidebar />
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {!hideNav && <Header />}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <style jsx>{`
        :global(html) { scroll-behavior: smooth; }
        :global(*::-webkit-scrollbar) { width: 8px; height: 8px; }
        :global(*::-webkit-scrollbar-track) { background: transparent; }
        :global(*::-webkit-scrollbar-thumb) { background: rgba(100, 116, 139, 0.3); border-radius: 9999px; }
        :global(*::-webkit-scrollbar-thumb:hover) { background: rgba(100, 116, 139, 0.5); }
      `}</style>
    </div>
  );
}
