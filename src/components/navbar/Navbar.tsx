'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md shadow-md transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-white hover:scale-105 transition-transform duration-300 flex items-center gap-2">
          <span className="text-3xl animate-pulse">🎯</span>
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Daily Focus
          </span>
        </Link>

        <div className="space-x-6 text-base font-medium">
          <Link
            href="/auth/login"
            className="text-gray-700 dark:text-gray-300 relative group transition-colors duration-300"
          >
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Đăng nhập
            </span>
            <span className="nav-underline" />
          </Link>

          <Link
            href="/auth/register"
            className="text-gray-700 dark:text-gray-300 relative group transition-colors duration-300"
          >
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Đăng ký
            </span>
            <span className="nav-underline" />
          </Link>

          <Link
            href="/dashboard"
            className="text-gray-700 dark:text-gray-300 relative group transition-colors duration-300"
          >
            <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              Dashboard
            </span>
            <span className="nav-underline" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .nav-underline {
          position: absolute;
          bottom: -3px;
          left: 0;
          height: 2px;
          width: 0%;
          background: linear-gradient(to right, #3b82f6, #9333ea); /* from blue to purple */
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .group:hover .nav-underline {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}
