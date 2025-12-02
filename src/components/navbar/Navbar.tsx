'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/auth/login', label: 'Sign In' },
  { href: '/auth/register', label: 'Sign Up', primary: true },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setScrolled(y > 20);
      const doc = document.documentElement;
      const h = doc.scrollHeight - doc.clientHeight;
      setProgress(h > 0 ? (doc.scrollTop / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                   style={{ background: 'var(--gradient-primary)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-lg font-bold tracking-tight transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                Daily Focus
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    link.primary
                      ? 'btn-primary'
                      : isActive(link.href)
                        ? ''
                        : 'hover:bg-white/5'
                  }`}
                  style={
                    link.primary
                      ? {}
                      : {
                          color: isActive(link.href)
                            ? 'var(--text-primary)'
                            : 'var(--text-secondary)',
                        }
                  }
                >
                  {link.primary ? (
                    <span className="flex items-center gap-2">
                      {link.label}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <>
                      {link.label}
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: 'var(--primary)' }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors md:hidden"
              style={{
                background: mobileMenuOpen ? 'var(--surface-secondary)' : 'transparent',
                color: 'var(--text-primary)',
              }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress */}
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-150"
          style={{
            width: `${progress}%`,
            background: 'var(--gradient-primary)',
          }}
          aria-hidden
        />
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-16 inset-x-4 z-50 rounded-2xl p-6 md:hidden"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        link.primary
                          ? 'btn-primary justify-center'
                          : ''
                      }`}
                      style={
                        link.primary
                          ? {}
                          : {
                              color: isActive(link.href)
                                ? 'var(--text-primary)'
                                : 'var(--text-secondary)',
                              background: isActive(link.href)
                                ? 'var(--surface-secondary)'
                                : 'transparent',
                            }
                      }
                    >
                      {link.primary ? (
                        <span className="flex items-center gap-2">
                          {link.label}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <>
                          <span>{link.label}</span>
                          {isActive(link.href) && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: 'var(--primary)' }}
                            />
                          )}
                        </>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Extra info in mobile menu */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                  Focus on what matters most
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
