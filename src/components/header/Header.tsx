﻿"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getDaypartGreeting } from "@/utils/date";

type MenuLink = {
  key: string;
  label: string;
  href: string;
  description?: string;
};

const menuLinks: MenuLink[] = [
  { key: "profile", label: "Profile", href: "/dashboard/profile", description: "Review your account details" },
  { key: "settings", label: "Settings", href: "/dashboard/settings", description: "Configure notifications & preferences" },
  { key: "help", label: "Help Center", href: "/dashboard/help", description: "Browse FAQs and contact support" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userAvatar = session?.user?.image || "";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
  };

  const handleNavigate = (href: string) => {
    setShowUserMenu(false);
    router.push(href);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!showUserMenu) return;
      const menuNode = menuRef.current;
      const buttonNode = btnRef.current;
      if (menuNode && !menuNode.contains(event.target as Node) && buttonNode && !buttonNode.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [showUserMenu]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
              <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">{getDaypartGreeting()}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {status === "loading" ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="hidden sm:block">
                  <div className="mb-1 h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-300 dark:bg-gray-700" />
                </div>
              </div>
            ) : (
              <>
                <div className="hidden flex-col items-end sm:flex">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{userName}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</span>
                </div>

                <button
                  ref={btnRef}
                  onClick={() => setShowUserMenu((value) => !value)}
                  className="rounded-xl px-2 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:text-gray-200 dark:hover:bg-gray-800"
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                  aria-controls="user-menu"
                >
                  Menu {showUserMenu ? "[-]" : "[+]"}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      ref={menuRef}
                      id="user-menu"
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-4 top-[64px] w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3 dark:border-white/10 sm:hidden">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} width={40} height={40} className="h-10 w-10 rounded-full object-cover" unoptimized />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
                            {getInitials(userName)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                        </div>
                      </div>

                      <div className="p-1">
                        {menuLinks.map((link) => (
                          <button
                            key={link.key}
                            role="menuitem"
                            onClick={() => handleNavigate(link.href)}
                            className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <span className="block font-medium">{link.label}</span>
                            {link.description && (
                              <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{link.description}</span>
                            )}
                          </button>
                        ))}

                        <div className="mt-1 border-t border-black/5 pt-1 dark:border-white/10">
                          <button
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="group relative w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            {isLoggingOut ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current" />
                                Logging out...
                              </span>
                            ) : (
                              "Log out"
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-2 text-xs text-gray-500 dark:text-gray-400 sm:hidden"
        >
          {getDaypartGreeting()}
        </motion.p>
      </div>

      {showUserMenu && <div className="fixed inset-0 z-30" aria-hidden />}
    </header>
  );
}
