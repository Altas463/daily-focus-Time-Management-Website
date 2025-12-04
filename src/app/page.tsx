'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  BarChart3,
  LayoutGrid,
  Shield,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Section - Split Screen */}
      <section className="pt-32 pb-16 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Value Prop */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface-panel border border-border-subtle">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="label-tech text-xs tracking-widest">SYSTEM ONLINE v2.0</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
              PRECISION <br />
              <span className="text-primary">PRODUCTIVITY</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-md font-mono leading-relaxed">
              {"// A command center for high-performance work."}
              <br />
              Eliminate noise. Execute with clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register" className="btn-tech-primary inline-flex items-center justify-center gap-2">
                Initialize
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link href="/dashboard" className="btn-tech-secondary inline-flex items-center justify-center gap-2">
                Live Demo
              </Link>
            </div>
          </div>

          {/* Right: Mini App Demo (Visual) */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-lg -z-10 transform rotate-2 border border-border-subtle"></div>
            <div className="bg-surface-base border border-border-default rounded-lg shadow-2xl p-6 max-w-md mx-auto lg:ml-auto">
              {/* Fake App Header */}
              <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="font-mono text-xs text-slate-400">FOCUS_MODE: ACTIVE</div>
              </div>

              {/* Fake Timer */}
              <div className="text-center mb-8">
                <div className="font-mono text-6xl font-bold tracking-tighter text-slate-900">
                  24:59
                </div>
                <div className="text-xs font-mono text-primary mt-2 uppercase tracking-widest">
                  Session In Progress
                </div>
              </div>

              {/* Fake Task List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface-panel border border-border-subtle rounded-sm">
                  <div className="w-4 h-4 border border-primary bg-primary/10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary"></div>
                  </div>
                  <span className="font-mono text-sm line-through text-slate-400">Review Architecture</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-base border border-primary rounded-sm shadow-sm">
                  <div className="w-4 h-4 border border-primary"></div>
                  <span className="font-mono text-sm font-bold">Implement Design System</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-panel border border-border-subtle rounded-sm opacity-60">
                  <div className="w-4 h-4 border border-slate-300"></div>
                  <span className="font-mono text-sm">Deploy to Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section className="py-24 bg-surface-panel border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">SYSTEM MODULES</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Large Card */}
            <div className="md:col-span-2 bento-card relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-surface-base border border-border-subtle rounded-sm">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workspace Intelligence</h3>
              <p className="text-slate-500 font-mono text-sm max-w-md">
                Adaptive layouts that respond to your workflow. Organize tasks, notes, and timers in a unified command center.
              </p>
              <div className="mt-auto pt-8 flex gap-2">
                <div className="h-24 flex-1 bg-surface-base border border-border-subtle rounded-sm translate-y-4 group-hover:translate-y-2 transition-transform"></div>
                <div className="h-24 w-1/3 bg-primary/5 border border-primary/20 rounded-sm translate-y-8 group-hover:translate-y-4 transition-transform delay-75"></div>
              </div>
            </div>

            {/* Tall Card */}
            <div className="md:row-span-2 bento-card bg-surface-base">
              <div className="mb-4 p-2 w-fit bg-surface-panel border border-border-subtle rounded-sm">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Focus Rhythm</h3>
              <p className="text-slate-500 font-mono text-sm mb-8">
                Scientifically tuned work/break intervals.
              </p>
              <div className="space-y-4 mt-auto">
                {[25, 5, 25, 5, 25, 15].map((min, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-mono text-xs w-8 text-right text-slate-400">{min}m</span>
                    <div className={`h-2 flex-1 rounded-sm ${i % 2 === 0 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Card */}
            <div className="bento-card">
              <div className="mb-4 p-2 w-fit bg-surface-base border border-border-subtle rounded-sm">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Analytics</h3>
              <p className="text-slate-500 font-mono text-sm">
                Real-time performance metrics and streak tracking.
              </p>
            </div>

            {/* Standard Card */}
            <div className="bento-card">
              <div className="mb-4 p-2 w-fit bg-surface-base border border-border-subtle rounded-sm">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Data Privacy</h3>
              <p className="text-slate-500 font-mono text-sm">
                Local-first architecture. Your data stays yours.
              </p>
            </div>

            {/* Wide Card */}
            <div className="md:col-span-2 bento-card flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Keyboard First</h3>
                <p className="text-slate-500 font-mono text-sm">
                  Navigate the entire system without leaving the home row.
                </p>
              </div>
              <div className="hidden md:flex gap-2">
                {['CMD', 'K', 'ENTER'].map((key) => (
                  <div key={key} className="px-3 py-2 bg-surface-base border-b-2 border-border-default rounded-sm font-mono text-xs font-bold">
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal Technical */}
      <footer className="mt-auto py-12 border-t border-border-subtle bg-surface-base">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-sm"></div>
            <span className="font-bold tracking-tight">DAILY FOCUS</span>
          </div>
          
          <div className="flex gap-8 font-mono text-xs text-slate-500">
            <Link href="#" className="hover:text-primary transition-colors">/MANIFESTO</Link>
            <Link href="#" className="hover:text-primary transition-colors">/CHANGELOG</Link>
            <Link href="#" className="hover:text-primary transition-colors">/SOURCE</Link>
          </div>

          <div className="font-mono text-xs text-slate-400">
            BUILD 2024.12.04
          </div>
        </div>
      </footer>
    </div>
  );
}
