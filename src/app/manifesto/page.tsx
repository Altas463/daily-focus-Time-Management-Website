"use client";

import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-6">
         <div className="max-w-3xl mx-auto space-y-12">
            <header>
               <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-mono mb-6">
                 <ArrowLeft className="w-3 h-3" /> RETURN_HOME
               </Link>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">The Deep Work Manifesto</h1>
               <div className="h-1 w-24 bg-primary rounded-full"></div>
            </header>

            <div className="prose prose-slate max-w-none">
               <p className="lead text-xl text-slate-600 font-serif italic">
                  &quot;In an economy where attention is currency, ability to focus is the ultimate competitive advantage.&quot;
               </p>

               <h3>1. Depth over Width</h3>
               <p>
                  We believe that the most valuable work happens when you are deeply immersed in a single task. Multitasking is a myth that degrades cognitive performance. We build tools that enforce single-tasking.
               </p>

               <h3>2. Environment Dictates Performance</h3>
               <p>
                  Willpower is a finite resource. Relying on willpower to resist distractions is a losing strategy. Instead, we must architect our digital environments to make focus the default state and distraction difficult.
               </p>

               <h3>3. Rhythm and Rest</h3>
               <p>
                  Humans are not machines. We operate on ultradian rhythms. High-intensity focus must be balanced with deliberate rest. Our 25/5 and 50/10 cycles are designed to sustain energy over the long haul, preventing burnout.
               </p>
               
               <h3>4. Metrics Matter</h3>
               <p>
                  You cannot improve what you do not measure. By tracking our deep work hours, we gain insight into our true capacity and can optimize our schedules for peak performance.
               </p>
            </div>

            <div className="pt-12 border-t border-border-default">
               <p className="font-mono text-sm text-slate-500 mb-6">
                  Ready to commit to depth?
               </p>
               <Link href="/auth/register" className="btn-tech-primary inline-flex items-center justify-center gap-2">
                  JOIN THE MOVEMENT
               </Link>
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
