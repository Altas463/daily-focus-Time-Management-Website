'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isGoogleUser = session?.user?.email?.endsWith('@gmail.com');
  const userName = isGoogleUser ? session?.user?.name : 'User';
  const userEmail = session?.user?.email;
  const userAvatar = session?.user?.image;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: '/' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Chào buổi sáng';
    if (hour < 18) return '☀️ Chào buổi chiều';
    return '🌙 Chào buổi tối';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Logo & Title */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                  Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  {getCurrentTimeGreeting()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Section - User Info & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {status === 'loading' ? (
              <div className="flex items-center gap-3">
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="animate-pulse hidden sm:block">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                </div>
              </div>
            ) : (
              <>
                {/* User Info */}
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {userName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {userEmail}
                  </span>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={userName ?? 'User Avatar'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(userName ?? '')}
                      </div>
                    )}
                    <svg 
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                      >
                        {/* User Info in Mobile */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                          <div className="flex items-center gap-3">
                            {userAvatar ? (
                              <Image
                                src={userAvatar}
                                alt={userName ?? 'User Avatar'}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600"
                                unoptimized
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {getInitials(userName ?? '')}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Thông tin cá nhân
                          </button>
                          
                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Cài đặt
                          </button>

                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Trợ giúp
                          </button>

                          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              disabled={isLoggingOut}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 disabled:opacity-50"
                            >
                              {isLoggingOut ? (
                                <>
                                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Đang đăng xuất...
                                </>
                              ) : (
                                <>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                  Đăng xuất
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Mobile Greeting */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-2 sm:hidden"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getCurrentTimeGreeting()}
          </p>
        </motion.div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      <style jsx>{`
        /* Custom scrollbar for dropdown if needed */
        .dropdown-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .dropdown-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </header>
  );
}