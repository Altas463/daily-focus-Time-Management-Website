'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function BackToDashboardLink() {
  return (
    <div className="group">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/30 text-white/90 hover:text-white text-sm font-medium rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        {/* Animated arrow */}
        <div className="relative overflow-hidden">
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-sm"></div>
        </div>
        
        {/* Text with subtle animation */}
        <span className="relative">
          Quay về Dashboard
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded blur-sm"></div>
        </span>

        {/* Home icon that appears on hover */}
        <Home className="w-0 opacity-0 group-hover:w-4 group-hover:opacity-60 transition-all duration-300" />

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur"></div>
      </Link>
    </div>
  );
}