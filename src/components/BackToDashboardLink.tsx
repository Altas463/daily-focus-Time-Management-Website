'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Quay v? Dashboard</span>
    </Link>
  );
}
