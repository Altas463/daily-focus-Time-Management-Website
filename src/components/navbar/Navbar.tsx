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
    { href: '/auth/login', label: 'Đăng nhập' },
    { href: '/auth/register', label: 'Đăng ký' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/70 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand (no icon) */}
          <Link href="/" className="select-none text-lg font-semibold tracking-tight text-gray-900 transition hover:opacity-90 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 dark:from-white dark:via-white dark:to-white">
              Daily Focus
            </span>
          </Link>

          {/* Links */}
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="group relative px-1 py-1 text-gray-700 transition dark:text-gray-300">
                <span className={isActive(l.href) ? 'text-gray-900 dark:text-white' : 'group-hover:text-gray-900 dark:group-hover:text-white'}>
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

      {/* Scroll progress bar (subtle, adds a modern touch) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-emerald-500 transition-[width] duration-150"
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
          background: linear-gradient(90deg, #3b82f6, #a855f7, #10b981);
          border-radius: 9999px;
          transition: width 0.25s ease;
        }
        .group:hover .nav-underline { width: 100%; }
      `}</style>
    </nav>
  );
}
