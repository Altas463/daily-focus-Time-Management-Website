'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, ArrowRight, Star } from 'lucide-react';

const featureHighlights = [
  {
    title: 'Effortlessly simple',
    description: 'Plan your day with an intuitive board that adapts to your workflow, not the other way around.',
    icon: Zap,
  },
  {
    title: 'Stay motivated daily',
    description: 'Watch your streaks grow and feel the momentum as you build consistent productive habits.',
    icon: TrendingUp,
  },
  {
    title: 'Flow without interruption',
    description: 'Immerse yourself in deep work with our Pomodoro timer, smart templates, and seamless keyboard shortcuts.',
    icon: Target,
  },
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
    content: 'The Pomodoro integration is brilliant. I&apos;ve doubled my code output while maintaining better work-life balance.',
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
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--cream) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, var(--sage) 0%, transparent 50%)`,
        }}></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Elegant tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-block mb-8"
            >
              <div className="px-6 py-3 rounded-full border" style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-secondary)'
              }}>
                <div className="flex items-center gap-2 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                  <span>Craft Your Productivity Symphony</span>
                </div>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="display-text text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Transform Your
              <div className="block mt-2" style={{ color: 'var(--primary)' }}>
                Daily Focus
              </div>
              Into Lasting
              <div className="block mt-2" style={{ color: 'var(--accent)' }}>
                Achievement
              </div>
            </motion.h1>

            {/* Refined description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl mb-12 leading-relaxed"
              style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}
            >
              Where thoughtful design meets powerful productivity. Daily Focus transforms your workflow from chaos to clarity, one focused day at a time.
            </motion.p>

            {/* Elegant CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/auth/register"
                className="group px-10 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  boxShadow: 'var(--shadow-lg)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-dark)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                Begin Your Journey
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="group px-10 py-4 rounded-lg font-medium text-lg border-2 transition-all duration-300 transform hover:scale-105"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'var(--surface)';
                }}
              >
                Explore Gracefully
                <div className="inline-block ml-2 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subtle Stats Section */}
      <section className="relative py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <div className="display-text text-3xl md:text-4xl" style={{ color: 'var(--primary)' }}>
                  {stat.value}
                </div>
                <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6" style={{ backgroundColor: 'var(--surface-secondary)' }}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="display-text text-4xl md:text-5xl mb-6">
              Where <span style={{ color: 'var(--primary)' }}>Thoughtfulness</span> Meets
              <br />
              <span style={{ color: 'var(--accent)' }}>Productivity</span>
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
              Every feature is crafted with intention, helping you achieve more while doing less.
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-3">
            {featureHighlights.map((feature, index) => {
              const Icon = feature.icon;
              const colors = ['var(--warm)', 'var(--accent)', 'var(--primary)'];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative p-8 rounded-2xl transition-all duration-300 hover:scale-105"
                       style={{
                         backgroundColor: 'var(--surface)',
                         border: `1px solid var(--border)`,
                         boxShadow: 'var(--shadow)'
                       }}>
                    {/* Icon with elegant background */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 transition-all duration-300 group-hover:scale-110"
                         style={{ backgroundColor: colors[index] }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="display-text text-4xl md:text-5xl mb-6">
              <span style={{ color: 'var(--primary)' }}>Voices</span> of
              <br />
              <span style={{ color: 'var(--accent)' }}>Transformation</span>
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Real experiences from people who've changed their relationship with productivity
            </p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="p-10 rounded-3xl transition-all duration-300 hover:scale-102"
                     style={{
                       backgroundColor: 'var(--surface)',
                       border: `1px solid var(--border)`,
                       boxShadow: 'var(--shadow-md)'
                     }}>
                  {/* Rating stars */}
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 mr-1" style={{ color: 'var(--warm)' }} fill="currentColor" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-xl leading-relaxed mb-8 italic" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full mr-4" style={{ backgroundColor: 'var(--surface-secondary)' }}></div>
                    <div>
                      <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                        {testimonial.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, white 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, white 0%, transparent 50%)`
          }}></div>
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="display-text text-4xl md:text-5xl mb-8 text-white">
              Begin Your
              <br />
              Focus Journey
              <br />
              Today
            </h2>
            <p className="text-xl mb-12 text-white/90 max-w-2xl mx-auto">
              Join thousands of professionals who&apos;ve transformed their relationship with productivity through thoughtful, intentional focus.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register"
                className="px-12 py-5 bg-white text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{ color: 'var(--primary)' }}
              >
                Start Your Free Trial
              </Link>
              <Link
                href="/contact"
                className="px-12 py-5 border-2 border-white text-lg font-semibold rounded-xl text-white transition-all duration-300 transform hover:scale-105 hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="relative py-16 px-6 border-t" style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface-secondary)'
      }}>
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="display-text text-3xl mb-4" style={{ color: 'var(--text-primary)' }}>
              Daily Focus
            </h3>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Where thoughtful design meets meaningful productivity
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-8 md:mb-0">
              <Link href="/privacy" className="transition-colors hover:scale-105" style={{ color: 'var(--text-muted)' }}>
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:scale-105" style={{ color: 'var(--text-muted)' }}>
                Terms
              </Link>
              <Link href="/contact" className="transition-colors hover:scale-105" style={{ color: 'var(--text-muted)' }}>
                Contact
              </Link>
            </div>
            <div className="text-center" style={{ color: 'var(--text-muted)' }}>
              <p>© {new Date().getFullYear()} Daily Focus. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

