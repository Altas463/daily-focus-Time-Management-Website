'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center pt-24 relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="floating-element absolute top-40 right-20 w-32 h-32 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-xl" style={{animationDelay: '2s'}}></div>
          <div className="floating-element absolute bottom-40 left-20 w-24 h-24 bg-indigo-200/30 dark:bg-indigo-500/20 rounded-full blur-xl" style={{animationDelay: '4s'}}></div>
          <div className="floating-element absolute bottom-20 right-10 w-16 h-16 bg-pink-200/30 dark:bg-pink-500/20 rounded-full blur-xl" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 opacity-0 animate-fadeIn">
              ✨ Nâng cao năng suất của bạn
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight opacity-0 animate-fadeIn animation-delay-200">
              Quản lý thời gian
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
                thông minh
              </span>
              <br />
              cùng Daily Focus
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed opacity-0 animate-fadeIn animation-delay-400">
            Ứng dụng giúp bạn <span className="font-semibold text-blue-600 dark:text-blue-400">tập trung hoàn toàn</span>, 
            quản lý công việc hiệu quả với Pomodoro, thống kê năng suất và nhiều tính năng hữu ích khác.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 opacity-0 animate-fadeIn animation-delay-600">
            <Link href="/auth/register">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 font-semibold text-lg">
                <span className="flex items-center justify-center gap-2">
                  Bắt đầu ngay
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 font-semibold text-lg">
                Xem thử Dashboard
              </button>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-0 animate-fadeIn animation-delay-800">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">25min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Phiên tập trung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">5min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian nghỉ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Khả năng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 opacity-0 animate-fadeIn animation-delay-1000">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto opacity-0 animate-fadeIn animation-delay-1100">
              Mọi công cụ bạn cần để tối ưu hóa thời gian và tăng năng suất làm việc
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Task Management */}
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 feature-card opacity-0 animate-fadeIn animation-delay-1200">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quản lý công việc</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Tổ chức task một cách khoa học với deadline rõ ràng, độ ưu tiên và trạng thái hoàn thành.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Thêm, sửa, xóa task dễ dàng
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Đặt deadline và nhắc nhở
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Phân loại theo độ ưu tiên
                </li>
              </ul>
            </div>

            {/* Pomodoro Timer */}
            <div className="group bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-green-900/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 feature-card opacity-0 animate-fadeIn animation-delay-1400">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⏱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Pomodoro Timer</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Áp dụng kỹ thuật Pomodoro đã được chứng minh khoa học để tăng sự tập trung tối đa.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  25 phút tập trung hoàn toàn
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  5 phút nghỉ ngơi hiệu quả
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Âm thanh thông báo tùy chỉnh
                </li>
              </ul>
            </div>

            {/* Analytics */}
            <div className="group bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-purple-900/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 feature-card opacity-0 animate-fadeIn animation-delay-1600">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Thống kê năng suất</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Theo dõi tiến độ với biểu đồ trực quan, phân tích xu hướng và cải thiện hiệu suất.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Biểu đồ thời gian thực
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Báo cáo hàng tuần/tháng
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  So sánh xu hướng năng suất
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Social Proof Section */}
      {/* <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12 opacity-0 animate-fadeIn animation-delay-1800">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Được tin dùng bởi hàng nghìn người
            </h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-yellow-500">
                <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                <span className="text-gray-600 dark:text-gray-300 font-medium">4.9/5</span>
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-2xl text-blue-600">2,500+</span> người dùng hài lòng
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-2xl text-green-600">50k+</span> task đã hoàn thành
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-12 text-center bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6 opacity-0 animate-fadeIn animation-delay-2000">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daily Focus</h4>
            <p className="text-gray-600 dark:text-gray-400">Tối ưu hóa thời gian, tối đa hóa kết quả</p>
          </div>
          
          <div className="flex justify-center gap-6 mb-8 opacity-0 animate-fadeIn animation-delay-2100">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 opacity-0 animate-fadeIn animation-delay-2200">
            © 2025 Daily Focus – Made with ❤️ to boost your focus.
          </p>
        </div>
      </footer>

      <style jsx>{`
        /* Enhanced animations */
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floating {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .floating-element {
          animation: floating 6s ease-in-out infinite;
        }

        /* Animation delays */
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1100 { animation-delay: 1.1s; }
        .animation-delay-1200 { animation-delay: 1.2s; }
        .animation-delay-1400 { animation-delay: 1.4s; }
        .animation-delay-1600 { animation-delay: 1.6s; }
        .animation-delay-1800 { animation-delay: 1.8s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2100 { animation-delay: 2.1s; }
        .animation-delay-2200 { animation-delay: 2.2s; }

        /* Enhanced feature card hover effects */
        .feature-card {
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        /* Responsive improvements */
        @media (max-width: 768px) {
          .floating-element {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}