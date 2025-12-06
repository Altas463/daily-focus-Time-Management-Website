"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = pathname?.startsWith("/auth");
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isAuthPage || isDashboard) return null;

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border-subtle py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-5 h-5 bg-slate-900 rounded-sm flex items-center justify-center text-white font-mono text-xs font-bold group-hover:bg-primary transition-colors">
            DF
          </div>
          <span className="font-bold tracking-tight text-slate-900">DAILY FOCUS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-sm font-medium text-slate-500">
             <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
             <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
             <Link href="/manifesto" className="hover:text-primary transition-colors">Manifesto</Link>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="/auth/login" className="text-sm font-mono font-bold text-slate-600 hover:text-primary transition-colors">
               LOGIN
             </Link>
             <Link
               href="/auth/register"
               className="btn-tech-primary py-1.5 px-4 text-xs"
             >
               GET STARTED
             </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border-subtle p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
             <Link href="#features" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Features</Link>
             <Link href="#pricing" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
             <Link href="/manifesto" className="text-sm font-medium text-slate-600" onClick={() => setMobileMenuOpen(false)}>Manifesto</Link>
             <hr className="border-border-subtle" />
             <div className="flex flex-col gap-3">
               <Link href="/auth/login" className="btn-tech-secondary justify-center text-center" onClick={() => setMobileMenuOpen(false)}>
                 LOGIN
               </Link>
               <Link href="/auth/register" className="btn-tech-primary justify-center text-center" onClick={() => setMobileMenuOpen(false)}>
                 GET STARTED
               </Link>
             </div>
        </div>
      )}
    </nav>
  );
}
