'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-gray-900 shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-white">
          🎯 Daily Focus
        </Link>

        <div className="space-x-4">
          <Link href="/auth/login" className="text-gray-700 dark:text-gray-300 hover:underline">
            Đăng nhập
          </Link>
          <Link href="/auth/register" className="text-gray-700 dark:text-gray-300 hover:underline">
            Đăng ký
          </Link>
          <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
