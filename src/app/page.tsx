"use client";

import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  BarChart3,
  LayoutGrid,
  Shield,
  Check,
  Code2,
  PenTool,
  GraduationCap,
  Zap,
  Terminal,
  Cpu,
  Globe,
  Lock,
} from "lucide-react";
import clsx from "clsx";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface-panel border border-border-subtle">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="label-tech text-[10px] tracking-widest text-emerald-600">SYSTEM OPERATIONAL</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
              PRECISION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                PRODUCTIVITY
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-md font-mono leading-relaxed">
              {"// Command center for high-performance work."}
              <br />
              Eliminate noise. Execute with clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/auth/register"
                className="btn-tech-primary inline-flex items-center justify-center gap-2 group"
              >
                INITIALIZE SYSTEM
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="btn-tech-secondary inline-flex items-center justify-center gap-2"
              >
                LIVE DEMO
              </Link>
            </div>
            
            <div className="text-xs font-mono text-slate-400 pt-4 flex items-center gap-4">
               <span>✓ NO CREDIT CARD</span>
               <span>✓ LOCAL-FIRST DATA</span>
               <span>✓ OPEN SOURCE</span>
            </div>
          </div>

          {/* Hero Visual: "Terminal" Interface */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-950 rounded-lg shadow-2xl overflow-hidden border border-slate-800">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <div className="ml-4 text-[10px] font-mono text-slate-500">daily-focus — -zsh — 80x24</div>
              </div>
              <div className="p-6 font-mono text-sm text-slate-300 space-y-2">
                <div className="flex gap-2">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-slate-100">daily-focus start --mode=deep-work</span>
                </div>
                <div className="text-slate-500 pt-1">Initializing environment...</div>
                <div className="text-slate-500">Loading modules: [timer, soundscape, tasks]... OK</div>
                <div className="pt-2 text-emerald-400">
                  SESSION_ACTIVE: 25:00
                </div>
                <div className="pl-4 border-l-2 border-slate-800 space-y-1 my-2">
                   <div className="flex justify-between">
                     <span>[ ] Review implementation plan</span>
                     <span className="text-amber-500">PRIORITY_HIGH</span>
                   </div>
                   <div className="flex justify-between text-slate-600">
                     <span>[x] Design system audit</span>
                     <span>DONE</span>
                   </div>
                </div>
                <div className="flex gap-2 pt-2 animate-pulse">
                  <span className="text-emerald-400">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="w-2.5 h-4 bg-slate-500 block"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF */}
      <section className="py-12 border-y border-border-default bg-surface-base/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-mono font-bold text-slate-400 mb-8 uppercase tracking-widest">Trusted by builders at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Simple Text Logos for specific "Tech" feel */}
             {["ACME_CORP", "STRATOS", "HYPER_LOOP", "NEXUS_AI", "QUANTUM_LABS"].map((brand) => (
                <div key={brand} className="text-lg font-display font-bold text-slate-600">{brand}</div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. PROBLEM / SOLUTION */}
      <section className="py-24 bg-surface-base">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <h2 className="text-3xl font-bold">Chaos vs. Order</h2>
                <p className="text-slate-500 text-lg leading-relaxed">
                   Most workflows are fragmented. Notifications, scattered notes, and inconsistent tools break your flow.
                   <br/><br/>
                   <strong className="text-slate-900">Daily Focus</strong> architects a protected environment for your mind. It&apos;s not just a to-do list; it&apos;s a cognitive operating system.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="p-4 bg-red-50 rounded-sm border border-red-100">
                      <div className="text-xs font-mono font-bold text-red-600 mb-2">WITHOUT SYSTEM</div>
                      <ul className="space-y-2 text-sm text-red-800/80">
                         <li className="flex gap-2"><span>×</span> Context switching</li>
                         <li className="flex gap-2"><span>×</span> Notification overload</li>
                         <li className="flex gap-2"><span>×</span> Shallow work</li>
                      </ul>
                   </div>
                   <div className="p-4 bg-emerald-50 rounded-sm border border-emerald-100">
                      <div className="text-xs font-mono font-bold text-emerald-600 mb-2">WITH DAILY FOCUS</div>
                      <ul className="space-y-2 text-sm text-emerald-800/80">
                         <li className="flex gap-2"><span>✓</span> Deep focus blocks</li>
                         <li className="flex gap-2"><span>✓</span> Intentional planning</li>
                         <li className="flex gap-2"><span>✓</span> Flow state on demand</li>
                      </ul>
                   </div>
                </div>
             </div>
             
             <div className="relative h-[400px] bg-surface-panel border border-border-subtle rounded-sm p-8 flex flex-col items-center justify-center text-center">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)] bg-[length:24px_24px]"></div>
                 <Zap className="w-16 h-16 text-amber-500 mb-6" />
                 <h3 className="text-2xl font-bold mb-2">Reclaim Your Attention</h3>
                 <p className="text-slate-500 max-w-xs mx-auto">Average knowledge worker is interrupted every 11 minutes. It takes 25 minutes to refocus.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES BENTO GRID */}
      <section className="py-24 bg-surface-panel border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
             <div className="inline-flex items-center gap-2 mb-4">
               <Terminal className="w-4 h-4 text-primary" />
               <span className="label-tech">SYSTEM MODULES</span>
             </div>
            <h2 className="text-3xl font-display font-bold mb-4">Core Architecture</h2>
            <div className="h-1 w-24 bg-primary"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* Large Card: Intelligence */}
            <div className="md:col-span-2 bento-card relative overflow-hidden group">
              <div className="absolute top-4 right-4 p-2 bg-surface-base border border-border-subtle rounded-sm group-hover:border-primary transition-colors">
                <LayoutGrid className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workspace Intelligence</h3>
              <p className="text-slate-500 font-mono text-sm max-w-md">
                Adaptive layouts that respond to your workflow. Organize tasks, projects, and timers in a unified command center.
              </p>
              <div className="mt-auto pt-8 flex gap-2">
                <div className="h-24 flex-1 bg-surface-base border border-border-subtle rounded-sm translate-y-4 group-hover:translate-y-2 transition-transform"></div>
                <div className="h-24 w-1/3 bg-primary/5 border border-primary/20 rounded-sm translate-y-8 group-hover:translate-y-4 transition-transform delay-75"></div>
              </div>
            </div>

            {/* Tall Card: Rhythm */}
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
                    <div className={clsx("h-2 flex-1 rounded-sm", i % 2 === 0 ? 'bg-primary' : 'bg-slate-200')}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Standard Card: Analytics */}
            <div className="bento-card">
              <div className="mb-4 p-2 w-fit bg-surface-base border border-border-subtle rounded-sm">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Analytics</h3>
              <p className="text-slate-500 font-mono text-sm">
                Real-time performance metrics and streak tracking. Visualise your productivity velocity.
              </p>
            </div>

            {/* Standard Card: Privacy */}
            <div className="bento-card">
              <div className="mb-4 p-2 w-fit bg-surface-base border border-border-subtle rounded-sm">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Data Privacy</h3>
              <p className="text-slate-500 font-mono text-sm">
                Local-first architecture. Your data stays on your device. Zero telemetry by default.
              </p>
            </div>

            {/* Wide Card: Keyboard */}
            <div className="md:col-span-2 bento-card flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Keyboard First</h3>
                <p className="text-slate-500 font-mono text-sm">
                  Navigate the entire system without leaving the home row. Speed is a feature.
                </p>
              </div>
              <div className="flex gap-2">
                {['CMD', 'K', 'ENTER'].map((key) => (
                  <div key={key} className="px-3 py-2 bg-surface-base border-b-2 border-border-default rounded-sm font-mono text-xs font-bold text-slate-600">
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. USE CASES */}
      <section className="py-24 bg-surface-base">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <span className="label-tech mb-4 block">ADAPTIVE WORKFLOWS</span>
             <h2 className="text-3xl font-display font-bold">Built for Builders</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {/* Developer */}
             <div className="p-6 border border-border-subtle hover:border-primary transition-colors rounded-sm group relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl -z-10 group-hover:from-blue-100 transition-colors"></div>
                <Code2 className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">For Developers</h3>
                <p className="text-slate-500 font-mono text-sm">
                   Match your pomodoros to your commits. Time block your deep coding sessions and block generic web noise.
                </p>
             </div>

             {/* Student */}
             <div className="p-6 border border-border-subtle hover:border-primary transition-colors rounded-sm group relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-3xl -z-10 group-hover:from-amber-100 transition-colors"></div>
                <GraduationCap className="w-8 h-8 text-amber-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">For Students</h3>
                <p className="text-slate-500 font-mono text-sm">
                   Structure your study sessions. Use the 50/10 rule. Track your thesis progress visually.
                </p>
             </div>

             {/* Creative */}
             <div className="p-6 border border-border-subtle hover:border-primary transition-colors rounded-sm group relative">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-3xl -z-10 group-hover:from-rose-100 transition-colors"></div>
                <PenTool className="w-8 h-8 text-rose-600 mb-4" />
                <h3 className="text-lg font-bold mb-2">For Creatives</h3>
                <p className="text-slate-500 font-mono text-sm">
                   Enter flow state on demand with ambient soundscapes. Keep your task queue invisible but accessible.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section className="py-24 bg-surface-panel border-t border-border-subtle">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
               {/* Head */}
               <div className="lg:col-span-1">
                  <h2 className="text-3xl font-bold mb-4">Invest in your output.</h2>
                  <p className="text-slate-500 font-mono text-sm mb-8 leading-relaxed">
                     Daily Focus is a tool that pays for itself in a single focused hour. Start for free, upgrade for power.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-mono text-slate-600">30-day money-back guarantee</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-mono text-slate-600">Cancel anytime</span>
                     </div>
                  </div>
               </div>

               {/* Cards */}
               <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                  {/* Free */}
                  <div className="bg-surface-base p-6 rounded-sm border border-border-default hover:border-slate-300 transition-colors">
                     <div className="text-sm font-mono font-bold text-slate-500 mb-2">STARTER</div>
                     <div className="text-4xl font-bold mb-6">$0</div>
                     <ul className="space-y-3 mb-8">
                        <li className="flex gap-3 text-sm text-slate-700">
                           <Check className="w-4 h-4 text-primary" />
                           Basic Pomodoro Timer
                        </li>
                        <li className="flex gap-3 text-sm text-slate-700">
                           <Check className="w-4 h-4 text-primary" />
                           Task Management
                        </li>
                        <li className="flex gap-3 text-sm text-slate-700">
                           <Check className="w-4 h-4 text-primary" />
                           3 Projects
                        </li>
                     </ul>
                     <Link href="/auth/register" className="btn-tech-secondary w-full justify-center">Get Started</Link>
                  </div>

                  {/* Pro */}
                  <div className="bg-slate-900 p-6 rounded-sm border border-slate-800 text-white relative shadow-xl transform md:-translate-y-4">
                     <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-sm">Recommended</div>
                     <div className="text-sm font-mono font-bold text-slate-400 mb-2">PRO SYSTEM</div>
                     <div className="text-4xl font-bold mb-6">$12<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                     <ul className="space-y-3 mb-8">
                        <li className="flex gap-3 text-sm text-slate-300">
                           <Check className="w-4 h-4 text-emerald-400" />
                           Unlimited Projects
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <Check className="w-4 h-4 text-emerald-400" />
                           Advanced Analytics
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <Check className="w-4 h-4 text-emerald-400" />
                           Custom Soundscapes
                        </li>
                        <li className="flex gap-3 text-sm text-slate-300">
                           <Check className="w-4 h-4 text-emerald-400" />
                           Priority Support
                        </li>
                     </ul>
                     <Link href="/auth/register" className="btn-tech-primary w-full justify-center border-transparent">Initialize Pro</Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 7. CTA & FOOTER */}
      <footer className="mt-auto border-t border-border-subtle bg-surface-base">
         <div className="py-24 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to execute?</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-8 font-mono">
               Join 10,000+ engineers, designers, and students in the flow state.
            </p>
            <Link
                href="/auth/register"
                className="btn-tech-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
              >
                Access Command Center
                <ArrowRight className="w-5 h-5" />
            </Link>
         </div>

        <div className="border-t border-border-subtle py-12">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 bg-primary rounded-sm"></div>
               <span className="font-bold tracking-tight">DAILY FOCUS</span>
             </div>
             
             <div className="flex gap-8 font-mono text-xs text-slate-500">
               <Link href="#" className="hover:text-primary transition-colors">/MANIFESTO</Link>
               <Link href="#" className="hover:text-primary transition-colors">/CHANGELOG</Link>
               <Link href="#" className="hover:text-primary transition-colors">/SOURCE</Link>
               <Link href="#" className="hover:text-primary transition-colors">/PRIVACY</Link>
             </div>
   
             <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
               <Cpu className="w-3 h-3" />
               SYSTEM v2.0.4.STABLE
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
