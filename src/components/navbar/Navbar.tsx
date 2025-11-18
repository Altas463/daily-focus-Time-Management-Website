'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 8);
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      setProgress(h > 0 ? (doc.scrollTop / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/auth/login', label: 'Sign In' },
    { href: '/auth/register', label: 'Sign Up' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-700/50 shadow-sm backdrop-blur-sm'
          : 'bg-white/50 dark:bg-slate-950/50 border-transparent backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="select-none text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent transition hover:opacity-80">
            Daily Focus
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium sm:flex">
            {links.map((l) => (
              <Link 
                key={l.href} 
                href={l.href} 
                className={`group relative px-1 py-1 transition ${
                  isActive(l.href)
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <span>{l.label}</span>
                <span className={`nav-underline ${isActive(l.href) ? 'w-full' : ''}`} />
              </Link>
            ))}
          </div>

          <div className="sm:hidden" />
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-transparent transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <style jsx>{`
        .nav-underline {
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 2px;
          width: 0;
          background: currentColor;
          border-radius: 9999px;
          transition: width 0.25s ease;
        }
        .group:hover .nav-underline { width: 100%; }
      `}</style>
    </nav>
  );
}
