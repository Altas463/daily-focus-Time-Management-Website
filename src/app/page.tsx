'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Target, TrendingUp, Clock, BarChart3, ArrowRight, Sparkles, Star, Users } from 'lucide-react';

const featureHighlights = [
  {
    title: 'Effortlessly simple',
    description: 'Plan your day with an intuitive board that adapts to your workflow, not the other way around.',
    icon: Zap,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    title: 'Stay motivated daily',
    description: 'Watch your streaks grow and feel the momentum as you build consistent productive habits.',
    icon: TrendingUp,
    gradient: 'from-green-400 to-blue-500',
  },
  {
    title: 'Flow without interruption',
    description: 'Immerse yourself in deep work with our Pomodoro timer, smart templates, and seamless keyboard shortcuts.',
    icon: Target,
    gradient: 'from-purple-400 to-pink-500',
  },
];

const whatYouGet = [
  {
    title: 'Smart task organization',
    description: 'Organize your work effortlessly with drag-and-drop boards that keep priorities clear and deadlines visible.',
    icon: BarChart3,
    features: ['Drag & Drop', 'Priority Labels', 'Deadline Tracking'],
  },
  {
    title: 'Built-in focus timer',
    description: 'Alternate between focused work sessions and refreshing breaks, while automatically tracking your progress.',
    icon: Clock,
    features: ['Pomodoro Technique', 'Session History', 'Custom Breaks'],
  },
  {
    title: 'Actionable daily insights',
    description: 'Get a clear picture of your productivity with streaks, upcoming deadlines, and balanced focus time—all in one dashboard.',
    icon: TrendingUp,
    features: ['Progress Analytics', 'Streak Tracking', 'Time Distribution'],
  },
];

const quickLinks = [
  { href: '/dashboard', label: 'Explore the dashboard', icon: ArrowRight },
  { href: '/privacy', label: 'Read our privacy commitments', icon: Star },
  { href: '/terms', label: 'Review terms of service', icon: Check },
  { href: '/contact', label: 'Get in touch', icon: Users },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: 'Daily Focus completely transformed how I manage my design projects. The visual interface makes prioritization effortless.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Software Developer',
    content: 'The Pomodoro integration is brilliant. I\'ve doubled my code output while maintaining better work-life balance.',
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Tasks Completed' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '4.8★', label: 'App Rating' },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Focus better. Finish smarter.</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                <span className="block">Transform your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">focus into achievement</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl"
              >
                Daily Focus turns your intentions into accomplishments. Cut through the clutter, build sustainable habits, and watch your progress unfold day by day.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/auth/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Start for free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-lg transition-opacity"></div>
                </Link>

                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>View demo</span>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                </Link>
              </motion.div>
            </div>

            {/* Right side - Enhanced Product Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-2xl"></div>

                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Live Workspace Preview
                </div>

                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">K</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Kanban Board</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2 text-xs text-blue-700 dark:text-blue-300">To Do</div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 rounded p-2 text-xs text-purple-700 dark:text-purple-300">In Progress</div>
                      <div className="bg-green-50 dark:bg-green-950/30 rounded p-2 text-xs text-green-700 dark:text-green-300">Done</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">P</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Pomodoro Timer</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-cyan-100 dark:from-green-950/30 dark:to-cyan-950/30 rounded p-3 mt-3">
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300 text-center">25:00</div>
                      <div className="text-xs text-green-600 dark:text-green-400 text-center mt-1">Focus Session</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">S</div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">15 Day Streak! 🔥</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Why professionals choose Daily Focus</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Designed for ambitious individuals who value clarity, consistency, and meaningful progress over complexity.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {featureHighlights.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
                  <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to thrive</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Move seamlessly from planning to execution. Daily Focus keeps your priorities front and center, highlights what's coming next, and celebrates your progress every single day.
              </p>
              <div className="flex flex-wrap gap-3">
                {['✨ Plan with intention', '🎯 Stay consistent', '🏆 Celebrbrate wins'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6">
              {whatYouGet.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((feature) => (
                            <span key={feature} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by productive professionals</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">See what our users are saying about Daily Focus</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your productivity?</h2>
            <p className="text-xl mb-8 text-blue-100">Join thousands of professionals who've already mastered their focus.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get started free
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                Talk to sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Section */}
      <section className="relative py-16 px-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Have questions? We&apos;re here to help.</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              We believe in complete transparency. Learn how we protect your privacy, understand our service commitments,
              and connect with our team whenever you need support.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-200"
                  >
                    <span>{link.label}</span>
                    <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Daily Focus</h4>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Transform your focus into achievement.</p>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">DF</div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-slate-900 dark:text-white">Product</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Features</Link></li>
                <li><Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Pricing</Link></li>
                <li><Link href="/integrations" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-slate-900 dark:text-white">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">About</Link></li>
                <li><Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</Link></li>
                <li><Link href="/careers" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Careers</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} Daily Focus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

