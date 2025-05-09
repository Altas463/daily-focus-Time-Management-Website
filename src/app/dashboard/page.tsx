'use client';

import { useAuth } from '@/lib/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/auth/login');  // Chuyển hướng về trang đăng nhập nếu chưa đăng nhập
    } else {
      setLoading(false); // Đã đăng nhập, tiếp tục hiển thị trang
    }
  }, [isLoggedIn, router]);

  if (loading) return <div>Loading...</div>; // Hiển thị loading cho đến khi kiểm tra xong

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🎯 Hôm nay bạn sẽ tập trung vào điều gì?</h2>

      {/* Task Hôm Nay */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">📋 Danh sách công việc hôm nay</h3>
        <ul className="space-y-2">
          {/* Sau này thay bằng map list task hôm nay */}
          <li className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-800 dark:text-white">Hoàn thành chức năng đăng nhập</span>
            <span className="text-sm text-gray-500">⏰ 10:00 - 11:00</span>
          </li>
          <li className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-800 dark:text-white">Thử nghiệm Pomodoro</span>
            <span className="text-sm text-gray-500">⏰ 14:00 - 15:00</span>
          </li>
        </ul>
      </section>

      {/* Pomodoro Nhanh */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">⏱ Pomodoro hiện tại</h3>
        <div className="text-center text-4xl text-blue-600 font-mono">25:00</div>
        <div className="text-center mt-4 space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">▶ Bắt đầu</button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">🔁 Reset</button>
        </div>
      </section>

      {/* Tổng kết nhanh */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Task hoàn thành hôm nay</h3>
          <p className="text-2xl font-bold text-green-500">3</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Pomodoro hoàn tất</h3>
          <p className="text-2xl font-bold text-blue-500">6</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">Tổng thời gian</h3>
          <p className="text-2xl font-bold text-purple-500">2h 30</p>
        </div>
      </section>
    </div>
  );
}
