'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToDashboardLink() {
  return (
    <div className="mb-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-sm rounded-lg shadow transition">
        <ArrowLeft className="w-4 h-4" />
        Quay về Dashboard
      </Link>
    </div>
  );
}
