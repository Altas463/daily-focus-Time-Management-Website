'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  console.log('Current pathname:', pathname);

  const hideNav = pathname === '/dashboard/pomodoro';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {!hideNav && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!hideNav && <Header />}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
