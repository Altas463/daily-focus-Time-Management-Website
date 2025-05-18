'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  const isGoogleUser = session?.user?.email?.endsWith('@gmail.com');
  const userName = isGoogleUser ? session?.user?.name : 'User';

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 flex justify-between items-center transition-all duration-300">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
        📊 Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
          <span className="text-lg">👋</span>
          {status === 'loading' ? 'Đang tải...' : `Xin chào, ${userName}`}
        </span>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 active:scale-95 transition duration-200 shadow-sm cursor-pointer"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
