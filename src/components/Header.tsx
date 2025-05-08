'use client';

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 dark:text-gray-300">👋 Xin chào, User</span>
        <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg">Đăng xuất</button>
      </div>
    </header>
  );
}
