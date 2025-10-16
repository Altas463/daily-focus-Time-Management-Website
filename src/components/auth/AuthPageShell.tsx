'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import type { LucideIcon } from 'lucide-react';
import { CalendarCheck2, ShieldCheck, Sparkles } from 'lucide-react';

type AuthPageShellProps = {
  hero: ReactNode;
  children: ReactNode;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Colour theme for the subtle accent column.
   */
  variant?: 'slate' | 'emerald';
};

type Highlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const highlights: Highlight[] = [
  {
    icon: Sparkles,
    title: 'Giao dien tinh gon',
    description: 'Tap trung vao nhung tac vu quan trong nhat ngay tu luc dang nhap.',
  },
  {
    icon: CalendarCheck2,
    title: 'Dong bo nhip song',
    description: 'Ke hoach ngay duoc dong bo va nhac nho thong minh.',
  },
  {
    icon: ShieldCheck,
    title: 'Bao mat vung chac',
    description: 'Du lieu cua ban luon duoc bao ve voi xac thuc hien dai.',
  },
];

const variantAccent: Record<NonNullable<AuthPageShellProps['variant']>, string> = {
  slate: 'bg-slate-900 text-white',
  emerald: 'bg-emerald-700 text-white',
};

export function AuthPageShell({
  hero,
  children,
  stageRef,
  onMouseMove,
  variant = 'slate',
}: AuthPageShellProps) {
  const accentClass = variantAccent[variant];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      <main
        ref={stageRef}
        onMouseMove={onMouseMove}
        className="px-6 pt-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="order-last md:order-first">
            <Link href="/" className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ring-gray-200 dark:ring-gray-800 ${accentClass}`}>
              Daily Focus
            </Link>
            <div className="mt-4 space-y-4 text-balance text-gray-900 dark:text-gray-100">
              {hero}
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-600 dark:text-gray-300 md:max-w-md">
              {highlights.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <section className="flex items-start justify-center">
            <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AuthPageShell;
