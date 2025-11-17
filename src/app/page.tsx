'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';

const featureHighlights = [
  {
    title: 'Effortlessly simple',
    description: 'Plan your day with an intuitive board that adapts to your workflow, not the other way around.',
  },
  {
    title: 'Stay motivated daily',
    description: 'Watch your streaks grow and feel the momentum as you build consistent productive habits.',
  },
  {
    title: 'Flow without interruption',
    description: 'Immerse yourself in deep work with our Pomodoro timer, smart templates, and seamless keyboard shortcuts.',
  },
];

const whatYouGet = [
  {
    title: 'Smart task organization',
    description: 'Organize your work effortlessly with drag-and-drop boards that keep priorities clear and deadlines visible.',
  },
  {
    title: 'Built-in focus timer',
    description: 'Alternate between focused work sessions and refreshing breaks, while automatically tracking your progress.',
  },
  {
    title: 'Actionable daily insights',
    description: 'Get a clear picture of your productivity with streaks, upcoming deadlines, and balanced focus time—all in one dashboard.',
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
              Transform your focus into achievement.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
            >
              Daily Focus turns your intentions into accomplishments. Cut through the clutter, build sustainable habits,
              and watch your progress unfold day by day.
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
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Why professionals choose Daily Focus</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Designed for ambitious individuals and teams who value clarity, consistency, and meaningful progress over complexity.
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
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Everything you need to thrive</h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
              Move seamlessly from planning to execution. Daily Focus keeps your priorities front and center,
              highlights what&apos;s coming next, and celebrates the progress you make every single day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
              {['Plan with intention', 'Stay consistent', 'Celebrate wins'].map((tag) => (
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Have questions? We&apos;re here to help.</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            We believe in complete transparency. Learn how we protect your privacy, understand our service commitments, 
            and connect with our team whenever you need support.
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
            <p className="mt-1 text-gray-600 dark:text-gray-400">Achieve more, stress less.</p>
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

