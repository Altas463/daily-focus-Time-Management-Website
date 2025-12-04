'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/dashboard/pomodoro-fullscreen'; // Example of hiding nav

  return (
    <div className="flex min-h-screen bg-surface-base">
      {!hideNav && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 pl-20 transition-all duration-300">
        {!hideNav && <Header />}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
