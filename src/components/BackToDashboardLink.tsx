'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToDashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-slate-500 hover:text-primary transition-colors uppercase tracking-wider"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      <span>DASHBOARD</span>
    </Link>
  );
}
