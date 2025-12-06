"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full bento-card border-none shadow-2xl bg-surface-base p-8 text-center space-y-6 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)] bg-[length:24px_24px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-sm flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">404</h1>
            <div className="inline-block px-2 py-1 bg-red-100/50 border border-red-200 rounded-sm text-red-700 font-mono text-xs font-bold uppercase tracking-widest mb-6">
                SYSTEM ERROR: ROUTE MISSING
            </div>

            <p className="text-slate-500 font-mono text-sm leading-relaxed mb-8">
                The requested module could not be located in the current build. It may have been deprecated or moved.
            </p>

            <Link
                href="/"
                className="btn-tech-primary inline-flex items-center gap-2 w-full justify-center"
            >
                <ArrowLeft className="w-4 h-4" />
                RETURN TO COMMAND
            </Link>
            
            <div className="mt-6 pt-6 border-t border-border-default w-full">
                <div className="font-mono text-[10px] text-slate-400">
                    ERR_CODE: PAGE_NOT_FOUND
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
