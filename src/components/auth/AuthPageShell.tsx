'use client';

import { ReactNode } from 'react';

type AuthPageShellProps = {
  hero: ReactNode;
  children: ReactNode;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * Visual flavour for the background gradients.
   * `blue` matches the login screen, `green` matches the register screen.
   */
  variant?: 'blue' | 'green';
};

const variantStyles = {
  blue: {
    gradient:
      'from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-indigo-950',
    spotlightColor: 'rgba(59,130,246,0.15)',
    topBlob:
      'bg-[conic-gradient(from_120deg,rgba(99,102,241,0.25),rgba(168,85,247,0.15),transparent_60%)]',
    bottomBlob:
      'bg-[conic-gradient(from_0deg,rgba(34,197,94,0.18),rgba(6,182,212,0.18),transparent_60%)]',
  },
  green: {
    gradient:
      'from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-emerald-950',
    spotlightColor: 'rgba(16,185,129,0.18)',
    topBlob:
      'bg-[conic-gradient(from_120deg,rgba(16,185,129,0.25),rgba(20,184,166,0.15),transparent_60%)]',
    bottomBlob:
      'bg-[conic-gradient(from_0deg,rgba(59,130,246,0.18),rgba(34,197,94,0.18),transparent_60%)]',
  },
} as const;

export function AuthPageShell({
  hero,
  children,
  stageRef,
  onMouseMove,
  variant = 'blue',
}: AuthPageShellProps) {
  const styles = variantStyles[variant];

  return (
    <main
      ref={stageRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen grid lg:grid-cols-2 bg-white dark:bg-gray-950 overflow-hidden"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div
          className={`absolute inset-0 [background:radial-gradient(600px_circle_at_var(--mx,50%)_var(--my,50%),${styles.spotlightColor},transparent_40%)]`}
        />
        <div
          className={`absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl animate-aurora ${styles.topBlob}`}
        />
        <div
          className={`absolute -bottom-24 -right-24 h-[24rem] w-[24rem] rounded-full blur-3xl animate-aurora ${styles.bottomBlob} [animation-delay:3s]`}
        />
      </div>

      <aside className="relative hidden lg:flex flex-col">
        <div className="relative z-10 mt-auto mb-24 px-12">{hero}</div>
      </aside>

      <section className="relative z-10 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
        {children}
      </section>

      <style jsx>{`
        @keyframes aurora {
          0% {
            transform: rotate(0deg) scale(1);
            filter: blur(32px);
          }
          50% {
            transform: rotate(180deg) scale(1.05);
            filter: blur(40px);
          }
          100% {
            transform: rotate(360deg) scale(1);
            filter: blur(32px);
          }
        }
        @media (min-width: 1024px) {
          section > div:hover {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </main>
  );
}

export default AuthPageShell;
