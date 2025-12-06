"use client";

import Link from "next/link";
import { ArrowLeft, FileWarning } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans overflow-hidden relative">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Random Code Fragments Background (Visual Noise) */}
      <div className="absolute top-0 left-0 right-0 p-4 opacity-10 font-mono text-xs text-green-500 select-none pointer-events-none overflow-hidden h-full">
         {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} style={{ transform: `translateX(${Math.random() * 100}px)` }}>
               {`0x${Math.random().toString(16).slice(2, 10).toUpperCase()} // MEMORY_FAULT_DETECTED`}
             </div>
         ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        <div className="max-w-2xl w-full">
            {/* Header: Glitch Context */}
            <div className="flex items-center gap-3 mb-8 text-amber-500 border-b border-amber-500/20 pb-4">
                <FileWarning className="w-5 h-5" />
                <span className="font-mono text-sm tracking-widest uppercase">Navigation_Failure_Event_404</span>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-600">
                        VO<span className="text-amber-500">I</span>D
                    </h1>
                    
                    <div className="space-y-4">
                        <p className="text-xl text-slate-400 font-light">
                            The signal was lost. The coordinates you entered point to an empty sector.
                        </p>
                        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-sm font-mono text-sm text-slate-500">
                            <span className="text-red-400">Error:</span> Route handler returned null response.
                            <br/>
                            <span className="text-emerald-400">Advice:</span> Re-align vector to verified coordinates.
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link 
                            href="/" 
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold tracking-wide rounded-sm hover:bg-slate-200 transition-all uppercase"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Return to Base
                        </Link>
                        
                        <div className="flex gap-2">
                             {[
                                { label: "Manifesto", href: "/manifesto" },
                                { label: "Changelog", href: "/changelog" },
                             ].map(item => (
                                 <Link 
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-3 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 rounded-sm text-sm font-mono transition-colors"
                                 >
                                     {item.label}
                                 </Link>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Visual Graphic */}
                <div className="relative aspect-square bg-slate-900 rounded-lg border border-slate-800 p-8 flex flex-col items-center justify-center overflow-hidden group">
                     <div className="absolute inset-0 bg-grid-slate-800/50 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                     <div className="relative w-32 h-32 border-2 border-slate-700 rounded-full flex items-center justify-center group-hover:border-amber-500/50 transition-colors duration-500">
                        <div className="w-24 h-24 border border-slate-700 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-amber-500/30"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 left-1/2 -ml-1 shadow-[0_0_10px_red]"></div>
                     </div>
                     <div className="mt-8 font-mono text-xs text-slate-600 text-center">
                        SCANNING_SECTOR... <br/>
                        <span className="text-red-500 font-bold">NEGATIVE_CONTACT</span>
                     </div>
                </div>
            </div>
        </div>
      </div>
      
      <footer className="py-6 px-6 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase">
         <div>Daily Focus // System Error Handler</div>
         <div>Code: 404_NOT_FOUND</div>
      </footer>
    </div>
  );
}
