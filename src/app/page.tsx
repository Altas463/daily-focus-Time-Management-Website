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
    <div className="relative min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <section className="relative px-6 pt-32 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-40 h-96 w-96 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center relative z-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-blue-50/50 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
            >
              ✨ Focus better. Finish smarter.
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent"
            >
              Transform your focus into achievement.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
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
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-cyan-500"
              >
                Start for free
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700"
              >
                View the demo
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-first md:order-none"
          >
            <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-8 shadow-xl dark:border-slate-700/50 dark:bg-slate-800/80">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">✓ Inside your workspace</div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-3">
                  <span className="h-1 w-1 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span>Visual Kanban board with drag-and-drop</span>
                </li>
                <li className="flex gap-3">
                  <span className="h-1 w-1 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                  <span>Built-in Pomodoro timer with session history</span>
                </li>
                <li className="flex gap-3">
                  <span className="h-1 w-1 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Daily streaks and upcoming deadline alerts</span>
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureHighlights.map((feature, idx) => {
              const colors = ['from-blue-500/10', 'from-purple-500/10', 'from-cyan-500/10'];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-8 shadow-sm transition hover:shadow-lg hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors[idx]} mb-4`}>
                    <span className="text-xl">{"🎯💡⚡"[idx]}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:items-center">
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
          <div className="grid gap-5">
            {whatYouGet.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1 dark:border-slate-700/50 dark:bg-slate-800/80"
              >
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/50 bg-gradient-to-b from-white to-slate-50/50 px-6 py-16 dark:border-slate-700/50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Have questions? We&apos;re here to help.</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            We believe in complete transparency. Learn how we protect your privacy, understand our service commitments, 
            and connect with our team whenever you need support.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
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
          <div className="border-t border-slate-200/50 pt-6 dark:border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex gap-6">
                <Link href="/privacy" className="transition hover:text-slate-900 dark:hover:text-slate-200">Privacy</Link>
                <Link href="/terms" className="transition hover:text-slate-900 dark:hover:text-slate-200">Terms</Link>
                <Link href="/contact" className="transition hover:text-slate-900 dark:hover:text-slate-200">Contact</Link>
              </div>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

