'use client';

import { ReactNode } from 'react';

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
      className="relative min-h-screen grid lg:grid-cols-[1fr_minmax(320px,460px)] bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100"
    >
      <aside className="hidden lg:flex flex-col justify-between border-r border-gray-200 bg-white px-12 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-6">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${accentClass}`}>
            Daily Focus
          </span>
          <div className="space-y-4 text-balance text-gray-900 dark:text-gray-100">{hero}</div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tip: Tap <kbd className="rounded border border-gray-300 px-1 text-[10px]">Alt</kbd> +{" "}
          <kbd className="rounded border border-gray-300 px-1 text-[10px]">Enter</kbd> to submit forms quickly.
        </p>
      </aside>

      <section className="relative flex items-center justify-center px-6 py-12">
        {children}
      </section>

      <style jsx>{`
        @media (min-width: 1024px) {
          section > div {
            max-width: 420px;
          }
        }
      `}</style>
    </main>
  );
}

export default AuthPageShell;
