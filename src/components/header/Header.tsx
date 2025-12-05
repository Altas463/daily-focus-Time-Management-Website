"use client";

import { useSession } from "next-auth/react";
import { Bell, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";

  return (
    <header className="h-16 border-b border-border-subtle bg-surface-base flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Context */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-px bg-border-default"></div>
        <div className="flex flex-col">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Workspace</span>
          <span className="text-sm font-bold text-slate-900">Main Command</span>
        </div>
      </div>

      {/* Center: Search (Visual -> Functional Input) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-panel border border-border-default rounded-sm w-96 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search commands... (CMD+K)"
          className="bg-transparent border-none outline-none text-sm font-mono text-slate-700 placeholder:text-slate-400 w-full"
        />
      </div>

      {/* Right: User & Actions */}
      <div className="flex items-center gap-6">
        <button 
          className="relative text-slate-400 hover:text-slate-600 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-surface-base"></span>
        </button>

        <Link href="/dashboard/profile" className="flex items-center gap-3 pl-6 border-l border-border-subtle hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{userName}</div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">PRO PLAN</div>
          </div>
          <div className="w-8 h-8 bg-slate-100 border border-border-default rounded-sm overflow-hidden">
            {/* Avatar placeholder or image */}
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
              {userName[0]}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
