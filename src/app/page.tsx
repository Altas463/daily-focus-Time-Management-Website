'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

const featureHighlights = [
  {
    title: 'Simple by default',
    description: 'Plan your day with a lightweight board and let Daily Focus handle the structure.',
  },
  {
    title: 'Keep streaks visible',
    description: 'See how many days in a row you stayed on track to maintain momentum.',
  },
  {
    title: 'Focus without friction',
    description: 'Use the Pomodoro timer, quick task templates, and keyboard shortcuts to stay in flow.',
  },
];

const whatYouGet = [
  {
    title: 'Task management',
    description: 'Organise work by status, due date, and urgency. Drag and drop across columns with confidence.',
  },
  {
    title: 'Pomodoro timer',
    description: 'Switch between focus and break intervals, track progress, and log completed sessions automatically.',
  },
  {
    title: 'Daily insights',
    description: 'Review streaks, upcoming deadlines, and balanced focus time from a single dashboard.',
  },
];

const quickLinks = [
  { href: '/dashboard', label: 'Explore the dashboard' },
  { href: '/privacy', label: 'Read our privacy commitments' },
  { href: '/terms', label: 'Review terms of service' },
  { href: '/contact', label: 'Get in touch' },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Navbar />

      <section className="px-6 pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              Focus better. Finish smarter.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-4 text-5xl font-bold leading-tight md:text-6xl"
            >
              Structure your day without the noise.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Daily Focus helps you plan, execute, and review what matters. Reduce clutter, maintain healthy workflows,
              and keep your goals visible at a glance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-gray-900"
              >
                Start for free
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:-translate-y-0.5 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              >
                View the demo dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-first md:order-none"
          >
            <div className="mx-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Inside your workspace</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  Visual Kanban board with drag-and-drop
                </li>
                <li className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  Built-in Pomodoro timer with session history
                </li>
                <li className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
                  Daily streaks and upcoming deadline alerts
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white px-6 py-20 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Why teams rely on Daily Focus</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Purpose-built for solo executives, product squads, and remote teams who want clarity without complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Everything you need to stay on track</h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              Switch seamlessly between planning and doing. Daily Focus keeps context close, surfaces what is due next,
              and highlights the progress you are making every week.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
              {['Plan smarter', 'Track consistently', 'Celebrate progress'].map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 px-3 py-1 dark:border-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {whatYouGet.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white px-6 py-16 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Curious about the details?</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            We believe in transparency. Learn how we protect your data, how we operate, and how you can reach us.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-blue-600 dark:text-blue-400 sm:flex-row">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-12 text-center dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-4">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Focus</h4>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Stay organised. Stay present.</p>
          </div>
          <div className="mb-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Daily Focus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
