"use client";

import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 px-6">
         <div className="max-w-3xl mx-auto space-y-12">
            <header>
               <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-mono mb-6">
                 <ArrowLeft className="w-3 h-3" /> RETURN_HOME
               </Link>
               <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Data Privacy Protocol</h1>
               <div className="flex items-center gap-2 text-emerald-600 font-mono text-sm">
                  <Lock className="w-4 h-4" />
                  <span>LOCAL_FIRST_ENCRYPTION: ACTIVE</span>
               </div>
            </header>

            <div className="bg-surface-panel border border-border-subtle p-6 rounded-sm mb-8">
               <p className="font-mono text-sm text-slate-600">
                  <strong>TL;DR:</strong> We do not sell your data. We do not track you across the web. Your productivity data (tasks, projects, logs) is stored locally on your device or encrypted before syncing.
               </p>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:font-display">
               <h3>1. Data Collection</h3>
               <p>
                  We collect only the minimum necessary information to provide the service:
               </p>
               <ul>
                  <li>Account information (email, name) for authentication.</li>
                  <li>Application state (tasks, timer logs) for sync functionality (if enabled).</li>
                  <li>Payment information (processed securely by Stripe, we never see your card details).</li>
               </ul>

               <h3>2. Local Storage</h3>
               <p>
                  By default, <strong>Daily Focus</strong> operates on a local-first basis. This means your data is primarily stored in your browser&apos;s `localStorage` and `IndexedDB`.
               </p>

               <h3>3. Third-Party Services</h3>
               <p>
                  We use the following third-party services:
               </p>
               <ul>
                  <li><strong>NextAuth</strong> for authentication.</li>
                  <li><strong>Vercel</strong> for hosting and infrastructure.</li>
               </ul>
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
