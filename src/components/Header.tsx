'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  // Kiểm tra nếu người dùng đăng nhập bằng Google
  const isGoogleUser = session?.user?.email?.endsWith('@gmail.com');  // Hoặc cách kiểm tra khác nếu cần

  // Lấy tên người dùng tùy vào loại tài khoản
  const userName = isGoogleUser ? session?.user?.name : 'User';

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' }); // Đăng xuất và quay lại trang login
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 dark:text-gray-300">
          👋 Xin chào, {status === 'loading' ? '...' : userName}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
