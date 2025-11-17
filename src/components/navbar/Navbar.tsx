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
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled
          ? 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm'
          : 'bg-white dark:bg-gray-950 border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand (no icon) */}
          <Link href="/" className="select-none text-lg font-semibold tracking-tight text-gray-900 transition hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
            Daily Focus
          </Link>

          {/* Links */}
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group relative px-1 py-1 text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                <span className={isActive(l.href) ? 'text-gray-900 dark:text-white' : ''}>
                  {l.label}
                </span>
                <span className={`nav-underline ${isActive(l.href) ? 'w-full' : ''}`} />
              </Link>
            ))}
          </div>

          {/* (Optional) Mobile minimal menu placeholder - hidden for now to keep ultra-clean */}
          <div className="sm:hidden" />
        </div>
      </div>

      {/* Scroll progress */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-blue-500 transition-[width] duration-150 dark:bg-blue-400"
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
