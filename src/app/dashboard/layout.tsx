'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/dashboard/pomodoro';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
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
        :global(*::-webkit-scrollbar) { width: 6px; height: 6px; }
        :global(*::-webkit-scrollbar-thumb) { background: #cbd5e1; border-radius: 9999px; }
        :global(*::-webkit-scrollbar-thumb:hover) { background: #94a3b8; }
        :global(*::-webkit-scrollbar-track) { background: transparent; }
      `}</style>
    </div>
  );
}
