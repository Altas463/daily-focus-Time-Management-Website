'use client';

import { usePathname } from 'next/navigation';
import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname === '/dashboard/pomodoro';

  // Subtle spotlight that follows mouse (keeps the same vibe)
  const stageRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  };

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute inset-0 [background:radial-gradient(700px_circle_at_var(--mx,50%)_var(--my,50%),rgba(99,102,241,0.12),transparent_40%)]" />
      </div>

      {!hideNav && (
        <aside className="relative z-10 hidden shrink-0 md:block">
          <Sidebar />
        </aside>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {!hideNav && <Header />}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Content container card style optional: keep pages free to design their own */}
          {children}
        </main>
      </div>

      <style jsx>{`
        /* Smooth scrolling and minimal scrollbar */
        :global(html) { scroll-behavior: smooth; }
        :global(*::-webkit-scrollbar) { width: 8px; height: 8px; }
        :global(*::-webkit-scrollbar-thumb) { background: rgba(100,100,100,0.25); border-radius: 9999px; }
        :global(*::-webkit-scrollbar-thumb:hover) { background: rgba(100,100,100,0.35); }
      `}</style>
    </div>
  );
}
