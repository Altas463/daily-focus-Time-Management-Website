import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionWrapper } from '@/components/SessionWrapper';
import 'react-datepicker/dist/react-datepicker.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Focus',
  description: 'Personal time management app with Pomodoro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
