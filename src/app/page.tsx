'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center pt-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 relative">
        <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-4 transform transition duration-500 ease-in-out hover:scale-105 opacity-0 animate-fadeIn">
          Quản lý thời gian thông minh cùng <span className="text-blue-600">Daily Focus</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6 opacity-80 hover:opacity-100 transition-opacity animate-fadeIn animation-delay-200">
          Ứng dụng giúp bạn tập trung, quản lý công việc hiệu quả với Pomodoro, thống kê năng suất và hơn thế nữa.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-fadeIn animation-delay-400">
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
              Bắt đầu ngay
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-6 py-3 border border-gray-400 dark:border-gray-300 text-gray-700 dark:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300">
              Xem thử Dashboard
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 feature-card animate-fadeIn animation-delay-600">
            <h2 className="text-xl font-bold mb-2 text-blue-600">📋 Quản lý công việc</h2>
            <p className="text-gray-600 dark:text-gray-300">Thêm, sửa, xóa task với deadline rõ ràng.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 feature-card animate-fadeIn animation-delay-800">
            <h2 className="text-xl font-bold mb-2 text-green-600">⏱ Pomodoro Timer</h2>
            <p className="text-gray-600 dark:text-gray-300">Tập trung 25 phút – nghỉ 5 phút hiệu quả hơn mỗi ngày.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 feature-card animate-fadeIn animation-delay-1000">
            <h2 className="text-xl font-bold mb-2 text-purple-600">📊 Thống kê năng suất</h2>
            <p className="text-gray-600 dark:text-gray-300">Xem lại số task, phiên Pomodoro bạn đã hoàn thành.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 relative">
        <p className="animate-fadeIn animation-delay-1200">
          © 2025 Daily Focus – Made with ❤️ to boost your focus.
        </p>
      </footer>

      <style jsx>{`
        /* Custom animations */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        /* Improve the transition effect for the feature cards */
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
