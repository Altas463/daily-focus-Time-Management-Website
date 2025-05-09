'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra tên người dùng từ localStorage
    const storedName = localStorage.getItem('name');
    setUserName(storedName);
  }, []);  // Lấy tên người dùng từ localStorage mỗi khi component render

  const handleLogout = () => {
    // Xóa token và tên người dùng khỏi localStorage khi đăng xuất
    localStorage.removeItem('token');
    localStorage.removeItem('name');

    // Điều hướng về trang đăng nhập
    router.push('/auth/login');
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 dark:text-gray-300">
          👋 Xin chào, {userName || 'User'}
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
