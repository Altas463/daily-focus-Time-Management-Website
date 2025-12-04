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
    title: 'Clean Interface',
    description: 'Focus on the most important tasks right from login.',
  },
  {
    icon: CalendarCheck2,
    title: 'Synced Rhythm',
    description: 'Daily plans are synced and smart reminders notify you.',
  },
  {
    icon: ShieldCheck,
    title: 'Strong Security',
    description: 'Your data is always protected with modern authentication.',
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
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main
        ref={stageRef}
        onMouseMove={onMouseMove}
        className="px-6 pt-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div className="order-last md:order-first">
            <Link href="/" className={`inline-flex rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ring-slate-200 ${accentClass}`}>
              Daily Focus
            </Link>
            <div className="mt-4 space-y-4 text-balance text-slate-900">
              {hero}
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-600 md:max-w-md">
              {highlights.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <section className="flex items-start justify-center">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              {children}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AuthPageShell;
