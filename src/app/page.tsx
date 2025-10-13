'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative px-6 pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700  dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              Tối giản — Tập trung — Hiệu quả
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 text-balance text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
            >
              Daily Focus
              <span className="block text-3xl font-medium text-gray-600 dark:text-gray-300 md:text-4xl">
                Quản lý thời gian theo cách hiện đại
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Giao diện tinh gọn giúp bạn tập trung vào công việc quan trọng và theo dõi tiến độ một cách rõ ràng.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black dark:bg-white dark:text-gray-900"
              >
                Bắt đầu ngay
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                Xem thử Dashboard
              </Link>
            </motion.div>

            {/* quick tags (an toàn, không yêu cầu feature mới) */}
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              {['Tập trung', 'Nhịp làm việc rõ ràng', 'Giao diện sạch', 'Dark/Light Mode'].map((i) => (
                <li key={i} className="rounded-full border border-gray-200 px-3 py-1 dark:border-white/10">
                  {i}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* visual preview only */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-first md:order-none"
          >
            <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Bản xem trước</span>
                <span>Giao diện</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg border border-gray-200/80 bg-gray-50 dark:border-white/10 dark:bg-white/10" />
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
                {['Rõ ràng', 'Tối giản', 'Nhất quán'].map((l) => (
                  <div key={l} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/10">
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES — nội dung tĩnh, không đòi hỏi tính năng */}
      <section className="relative border-t border-gray-200 bg-white px-6 py-20 dark:border-white/10 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Nguyên tắc thiết kế</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Những nguyên tắc cốt lõi định hình trải nghiệm — không hứa hẹn tính năng, chỉ nói về cách tiếp cận.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                t: 'Tối giản có chủ đích',
                d: 'Chỉ giữ lại phần cần thiết để hỗ trợ sự tập trung và giảm nhiễu.',
              },
              {
                t: 'Khả đọc & phân cấp',
                d: 'Sử dụng khoảng trắng, cỡ chữ, và tương phản để dẫn dắt ánh nhìn.',
              },
              {
                t: 'Nhất quán',
                d: 'Mẫu card, lưới, và tương tác lặp lại hợp lý giúp làm quen nhanh.',
              },
            ].map((f) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE — mẹo chung, không yêu cầu hệ thống thực thi */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Mẹo sử dụng hiệu quả</h2>
          </div>

          <ul className="mx-auto grid max-w-3xl gap-4 text-sm text-gray-700 dark:text-gray-300">
            {[
              'Chia nhỏ việc lớn thành bước có thể hoàn thành trong 20–30 phút.',
              'Ghi chú ngắn gọn mục tiêu trước mỗi phiên làm việc.',
              'Đặt giờ nghỉ ngắn đều đặn để duy trì sự tỉnh táo.',
              'Tắt thông báo không cần thiết trên hệ điều hành khi cần tập trung.',
            ].map((tip) => (
              <li key={tip} className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-12 text-center dark:border-white/10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4">
            <h4 className="text-2xl font-bold">Daily Focus</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Gọn gàng, rõ ràng, dễ tập trung.</p>
          </div>
          <div className="mb-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Daily Focus</p>
        </div>
      </footer>
    </div>
  );
}
