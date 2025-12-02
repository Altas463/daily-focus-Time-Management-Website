'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Clock,
  BarChart3,
  CheckCircle2,
  Star,
  Timer,
  Brain,
  Flame,
  Quote,
  ArrowUpRight
} from 'lucide-react';

const features = [
  {
    title: 'Smart Task Management',
    description: 'Organize your work with intelligent prioritization. Focus on what moves the needle.',
    icon: Target,
  },
  {
    title: 'Pomodoro Focus Sessions',
    description: 'Stay in flow with timed focus sessions. Work smarter, not harder.',
    icon: Timer,
  },
  {
    title: 'Progress Analytics',
    description: 'Understand your productivity patterns with clear, actionable insights.',
    icon: BarChart3,
  },
  {
    title: 'Focus Streaks',
    description: 'Build momentum with daily streaks. Small wins compound into big results.',
    icon: Flame,
  },
  {
    title: 'Smart Reminders',
    description: 'Never miss a deadline. Get gentle nudges at the right moment.',
    icon: Clock,
  },
  {
    title: 'Deep Work Mode',
    description: 'Eliminate distractions. Create space for your most important work.',
    icon: Brain,
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    company: 'Figma',
    content: 'Daily Focus changed how I approach my work. The simplicity is refreshing—no clutter, just clarity.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Engineering Lead',
    company: 'Stripe',
    content: 'Finally, a productivity tool that respects my time. Clean interface, powerful features, zero friction.',
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'Founder',
    company: 'Basecamp',
    content: 'The streak feature keeps me accountable without being annoying. It just works beautifully.',
    avatar: 'EW',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Tasks Done' },
  { value: '98%', label: 'Satisfaction' },
  { value: '4.9', label: 'Rating' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen grain" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* Hero Section - Editorial Style */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid-hero">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-8"
            >
              {/* Accent line */}
              <div className="accent-line" />

              {/* Headline */}
              <h1 className="display-text text-5xl lg:text-6xl xl:text-7xl">
                <span style={{ color: 'var(--text-primary)' }}>Focus on</span>
                <br />
                <span style={{ color: 'var(--primary)' }}>what matters</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-lg lg:text-xl max-w-md leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                The productivity platform that helps you achieve more with less stress.
                Simple, beautiful, effective.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/auth/register" className="btn-primary inline-flex items-center justify-center gap-2">
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/dashboard"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  Explore Demo
                </Link>
              </div>

              {/* Social proof - Minimal */}
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  {['JD', 'AK', 'MR', 'SC'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2"
                      style={{
                        background: `hsl(${20 + i * 15}, 70%, ${55 + i * 5}%)`,
                        borderColor: 'var(--background)',
                        zIndex: 4 - i
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Loved by 50,000+ users
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="card p-6 text-center"
                >
                  <div
                    className="display-text text-3xl lg:text-4xl mb-1"
                    style={{ color: 'var(--primary)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Grid */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <div className="accent-line mb-6" />
            <h2 className="display-text text-3xl lg:text-4xl mb-4">
              Everything you need,
              <br />
              <span style={{ color: 'var(--primary)' }}>nothing you don&apos;t</span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Powerful features designed with intention. No bloat, no distractions.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid-features"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:bg-white/50"
                  style={{ border: '1px solid transparent' }}
                  whileHover={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="icon-box mb-5 transition-transform duration-300 group-hover:scale-105"
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it Works - Editorial Numbers */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-20"
          >
            <div className="accent-line mb-6" />
            <h2 className="display-text text-3xl lg:text-4xl mb-4">
              Simple by design
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Get started in three steps. No learning curve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {[
              { step: '01', title: 'Create Tasks', desc: 'Add your tasks with priorities and deadlines. Keep it simple.' },
              { step: '02', title: 'Start Focusing', desc: 'Use the Pomodoro timer to work in focused intervals.' },
              { step: '03', title: 'Track Progress', desc: 'Review your analytics and celebrate your wins.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div
                  className="editorial-heading text-7xl lg:text-8xl mb-4"
                  style={{ color: 'var(--primary)', opacity: 0.15 }}
                >
                  {item.step}
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial Style */}
      <section className="py-24 lg:py-32" style={{ background: 'var(--surface-secondary)' }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <div className="accent-line mb-6" />
            <h2 className="display-text text-3xl lg:text-4xl mb-4">
              Loved by
              <br />
              <span style={{ color: 'var(--primary)' }}>thoughtful people</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid-testimonials"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                className="card p-8"
              >
                <Quote
                  className="w-8 h-8 mb-6"
                  style={{ color: 'var(--primary)', opacity: 0.3 }}
                />

                <p
                  className="text-lg mb-8 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {testimonial.content}
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: 'var(--primary)' }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Warm, Inviting */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card p-12 lg:p-16 text-center"
            style={{ background: 'var(--primary)', border: 'none' }}
          >
            <h2 className="display-text text-3xl lg:text-4xl text-white mb-4">
              Ready to focus?
            </h2>
            <p className="text-lg text-white/80 max-w-md mx-auto mb-8">
              Join thousands who have discovered the power of intentional work. Start free today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-xl transition-all bg-white hover:bg-gray-50"
                style={{ color: 'var(--primary)' }}
              >
                Get Started Free
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer
        className="py-16 border-t"
        style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Daily Focus
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                Simple productivity for thoughtful people.
              </p>
              <div className="flex items-center gap-2">
                <div className="status-dot online" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  All systems operational
                </span>
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'API'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms'] },
            ].map((section) => (
              <div key={section.title}>
                <h4
                  className="font-semibold mb-4 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.toLowerCase().replace(' ', '-')}`}
                        className="text-sm transition-colors hover:opacity-70"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Daily Focus. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Made with <CheckCircle2 className="w-3.5 h-3.5 mx-1" style={{ color: 'var(--accent)' }} /> for focused work
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
