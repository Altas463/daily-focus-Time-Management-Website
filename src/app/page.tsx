'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  BarChart3,
  Zap,
  CheckCircle2,
  Star,
  Play,
  ChevronRight,
  Timer,
  Brain,
  Flame
} from 'lucide-react';

const features = [
  {
    title: 'Smart Task Management',
    description: 'Organize tasks with intelligent prioritization and deadline tracking that adapts to your workflow.',
    icon: Target,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Pomodoro Focus Timer',
    description: 'Stay in the zone with customizable focus sessions and strategic breaks for peak productivity.',
    icon: Timer,
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Progress Analytics',
    description: 'Visualize your productivity patterns with detailed charts and actionable insights.',
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Focus Streaks',
    description: 'Build momentum with daily streaks and achievements that keep you motivated.',
    icon: Flame,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Smart Reminders',
    description: 'Never miss a deadline with intelligent notifications delivered at the right time.',
    icon: Clock,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Deep Work Mode',
    description: 'Ambient soundscapes and distraction blockers for uninterrupted focus sessions.',
    icon: Brain,
    gradient: 'from-indigo-500 to-violet-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer at Figma',
    content: 'Daily Focus transformed how I work. The Pomodoro integration is seamless and the analytics help me understand my productivity patterns.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Senior Developer',
    content: 'Finally, a productivity app that doesn\'t get in the way. Clean, fast, and exactly what I need to stay focused on deep work.',
    avatar: 'MR',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Startup Founder',
    content: 'The streak feature keeps me accountable every day. I\'ve been more productive in the last month than the entire quarter before.',
    avatar: 'EW',
    rating: 5,
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Tasks Completed' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '4.9', label: 'App Store Rating' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-30" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid-hero">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass"
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Productivity Reimagined
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="display-text text-5xl lg:text-7xl">
                <span style={{ color: 'var(--text-primary)' }}>Focus on</span>
                <br />
                <span className="gradient-text">what matters</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>most</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                The modern productivity platform that helps you achieve more with less stress.
                Task management, focus timer, and analytics in one beautiful interface.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                  <Play className="w-5 h-5" />
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
                >
                  Explore Demo
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {['JD', 'AK', 'MR', 'SC'].map((initials, i) => (
                    <div
                      key={i}
                      className="avatar border-2"
                      style={{ borderColor: 'var(--background)', zIndex: 4 - i }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Loved by 50,000+ users
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Stats Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="card-interactive p-6 text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="display-text text-4xl font-bold gradient-text mb-2">
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

      {/* Features Section */}
      <section className="py-24 relative" style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0 dot-pattern opacity-20" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="badge badge-primary mb-4 mx-auto">
              <Zap className="w-3.5 h-3.5" />
              Features
            </div>
            <h2 className="display-text text-4xl lg:text-5xl mb-6">
              Everything you need to
              <br />
              <span className="gradient-text">stay productive</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Powerful features designed to help you focus, track progress, and achieve your goals.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid-features"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="card-interactive group p-6"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="badge badge-success mb-4 mx-auto">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Simple Process
            </div>
            <h2 className="display-text text-4xl lg:text-5xl mb-6">
              Get started in
              <br />
              <span className="gradient-text">three simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Tasks', desc: 'Add your tasks and set priorities, deadlines, and descriptions.' },
              { step: '02', title: 'Start Focusing', desc: 'Use the Pomodoro timer to work in focused intervals with breaks.' },
              { step: '03', title: 'Track Progress', desc: 'Review your analytics and celebrate your productivity wins.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div
                  className="display-text text-8xl font-bold mb-6 opacity-10"
                  style={{ color: 'var(--primary)' }}
                >
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
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

      {/* Testimonials Section */}
      <section className="py-24 relative" style={{ background: 'var(--surface)' }}>
        <div className="absolute inset-0 mesh-gradient opacity-50" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="badge mb-4 mx-auto">
              <Star className="w-3.5 h-3.5" />
              Testimonials
            </div>
            <h2 className="display-text text-4xl lg:text-5xl mb-6">
              Loved by
              <br />
              <span className="gradient-text">productive people</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid-testimonials"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                className="card p-8"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="avatar">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {testimonial.name}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-primary)', opacity: 0.9 }} />
        <div className="absolute inset-0 dot-pattern opacity-10" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="display-text text-4xl lg:text-6xl text-white">
              Ready to transform
              <br />
              your productivity?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of users who have already discovered the power of focused work.
              Start your journey today - it&apos;s free to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
                style={{
                  background: 'white',
                  color: 'var(--primary)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/30 text-white transition-all hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="display-text text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Daily Focus
              </h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                The modern productivity platform for focused work.
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
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'API Docs', 'Status'] },
              { title: 'Company', links: ['About', 'Contact', 'Privacy', 'Terms'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.toLowerCase().replace(' ', '-')}`}
                        className="text-sm transition-colors hover:opacity-80"
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
              &copy; {new Date().getFullYear()} Daily Focus. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Made with
              </span>
              <span style={{ color: 'var(--danger)' }}>&#9829;</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                for productivity enthusiasts
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
