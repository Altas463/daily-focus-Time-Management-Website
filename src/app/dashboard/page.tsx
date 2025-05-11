'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Đợi xác thực xong

    if (status === 'unauthenticated') {
      router.replace('/auth/login'); // Nếu chưa login, chuyển hướng
    } else {
      setLoading(false); // Nếu đã login thì render trang
    }
  }, [status, router]);

  if (loading || status === 'loading') return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        🎯 Xin chào, {session?.user?.name || 'bạn'}! Hôm nay bạn sẽ tập trung vào điều gì?
      </h2>

      {/* Task hôm nay */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
          📋 Danh sách công việc hôm nay
        </h3>
        <ul className="space-y-2">
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

      {/* Pomodoro */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">⏱ Pomodoro hiện tại</h3>
        <div className="text-center text-4xl text-blue-600 font-mono">25:00</div>
        <div className="text-center mt-4 space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            ▶ Bắt đầu
          </button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
            🔁 Reset
          </button>
        </div>
      </section>

      {/* Thống kê */}
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
