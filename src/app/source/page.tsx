"use client";

import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { Github } from "lucide-react";

export default function SourcePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-6 flex items-center justify-center">
         <div className="max-w-md w-full text-center space-y-8">
            <Github className="w-16 h-16 mx-auto text-slate-800" />
            <h1 className="text-3xl font-display font-bold">Open Source Core</h1>
            <p className="text-slate-500">
               The core logic of Daily Focus is available on GitHub. We believe in transparency and community-driven development.
            </p>
            
            <div className="p-4 bg-surface-panel border border-border-subtle rounded-sm font-mono text-xs text-slate-600 break-all">
               https://github.com/daily-focus/core
            </div>

            <div className="flex justify-center gap-4">
               <Link href="/" className="btn-tech-secondary">
                  Back Home
               </Link>
               <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-tech-primary">
                  View on GitHub
               </a>
            </div>
         </div>
      </main>

      <footer className="py-8 border-t border-border-subtle bg-surface-base text-center">
         <div className="font-mono text-xs text-slate-400">
           DAILY FOCUS © 2024
         </div>
      </footer>
    </div>
  );
}
