"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-sm transition-colors duration-300 dark:border-slate-700/50 dark:bg-slate-900/80">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{getDaypartGreeting()}</p>
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
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="hidden sm:block">
                  <div className="mb-1 h-4 w-24 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
                </div>
              </div>
            ) : (
              <>
                <div className="hidden flex-col items-end pr-3 text-right sm:flex">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{userName}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</span>
                </div>

                <button
                  ref={btnRef}
                  onClick={() => setShowUserMenu((value) => !value)}
                  className={clsx(
                    "group relative inline-flex items-center gap-2 rounded-xl border border-slate-300/50 bg-white/90 px-2 py-1.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600/50 dark:bg-slate-800/90 dark:hover:bg-slate-700/90",
                    showUserMenu && "ring-2 ring-blue-500/20 dark:ring-blue-400/20 bg-white dark:bg-slate-800",
                  )}
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                  aria-controls="user-menu"
                  aria-label="Open account menu"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-xs font-semibold text-white transition-transform group-hover:scale-[1.05]">
                    {userAvatar ? (
                      <Image src={userAvatar} alt={userName} width={40} height={40} className="h-full w-full rounded-full object-cover" unoptimized />
                    ) : (
                      getInitials(userName)
                    )}
                  </span>
                  <ChevronDown
                    className={clsx(
                      "h-4 w-4 text-slate-500 transition-transform duration-200 ease-out group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200",
                      showUserMenu && "-rotate-180",
                    )}
                    aria-hidden
                  />
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
                      className="absolute right-4 top-[56px] w-72 overflow-hidden rounded-xl border border-slate-200/50 bg-white/90 shadow-xl backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/90"
                    >
                      <div className="flex items-center gap-3 border-b border-slate-200/50 px-4 py-3 dark:border-slate-700/50 sm:hidden">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} width={40} height={40} className="h-10 w-10 rounded-full object-cover" unoptimized />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-sm font-semibold text-white">
                            {getInitials(userName)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{userName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{userEmail}</p>
                        </div>
                      </div>

                      <div className="p-1">
                        {menuLinks.map((link) => (
                          <button
                            key={link.key}
                            role="menuitem"
                            onClick={() => handleNavigate(link.href)}
                            className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-slate-200 dark:hover:bg-slate-700/80"
                          >
                            <span className="block font-medium">{link.label}</span>
                            {link.description && (
                              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{link.description}</span>
                            )}
                          </button>
                        ))}

                        <div className="mt-1 border-t border-slate-200/50 pt-1 dark:border-slate-700/50">
                          <button
                            role="menuitem"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="group relative w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50/80 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
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
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 sm:hidden"
        >
          {getDaypartGreeting()}
        </motion.p>
      </div>

      {showUserMenu && <div className="fixed inset-0 z-30" aria-hidden />}
    </header>
  );
}
