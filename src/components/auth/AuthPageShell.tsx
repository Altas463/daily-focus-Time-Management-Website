'use client';

import { ReactNode } from 'react';
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
    <main
      ref={stageRef}
      onMouseMove={onMouseMove}
      className="relative isolate min-h-screen grid bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-black dark:text-gray-100 lg:grid-cols-[minmax(360px,1fr)_minmax(320px,460px)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-normal dark:opacity-100">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-100 blur-3xl dark:bg-emerald-900/40" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-purple-200 blur-[110px] dark:bg-blue-900/30" />
      </div>
      <aside className="relative hidden overflow-hidden border-r border-white/40 bg-white/60 px-12 py-16 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/10 dark:from-emerald-500/10 dark:via-white/[0.04] dark:to-transparent" />
        <div className="relative space-y-8">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-inset ring-white/40 dark:ring-white/10 ${accentClass}`}>
            Daily Focus
          </span>
          <div className="space-y-4 text-balance text-gray-900 dark:text-gray-100">{hero}</div>
          <ul className="space-y-4 text-sm">
            {highlights.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.06]">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm dark:bg-emerald-500">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="rounded-2xl border border-white/50 bg-white/80 px-6 py-5 text-xs text-gray-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">
            Tip: Bam <kbd className="rounded border border-gray-300/70 px-1 text-[10px] text-gray-700 dark:border-white/20 dark:text-gray-200">Alt</kbd> +{' '}
            <kbd className="rounded border border-gray-300/70 px-1 text-[10px] text-gray-700 dark:border-white/20 dark:text-gray-200">Enter</kbd> de gui form nhanh hon.
          </div>
        </div>
      </aside>

      <section className="relative flex items-center justify-center px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="pointer-events-none absolute inset-0 bg-white/65 backdrop-blur-xl dark:bg-gray-950/60" />
        <div className="relative w-full max-w-md">
          {children}
        </div>
      </section>

      <style jsx>{`
        main {
          --mx: 50%;
          --my: 50%;
        }

        main::after {
          content: '';
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.85;
          background: radial-gradient(40rem circle at var(--mx) var(--my), rgba(14, 165, 233, 0.14), transparent 65%);
          transition: background 180ms ease;
        }

        :global(.dark) main::after {
          background: radial-gradient(42rem circle at var(--mx) var(--my), rgba(16, 185, 129, 0.22), transparent 70%);
        }
      `}</style>
    </main>
  );
}

export default AuthPageShell;
