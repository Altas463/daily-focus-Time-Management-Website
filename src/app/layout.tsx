import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Focus',
  description: 'Ứng dụng quản lý thời gian cá nhân với Pomodoro',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
