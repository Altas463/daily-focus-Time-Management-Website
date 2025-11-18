'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, ArrowRight, Star, Brain, Timer, Coffee } from 'lucide-react';

const featureHighlights = [
  {
    title: 'AI-Powered Focus',
    description: 'Intelligent optimization adapts to your natural productivity rhythms for perfect work sessions.',
    icon: Brain,
  },
  {
    title: 'Deep Work Sessions',
    description: 'Immersive time-blocking with environmental sounds and distraction-blocking technology.',
    icon: Timer,
  },
  {
    title: 'Smart Energy Management',
    description: 'Advanced scheduling based on your natural energy cycles and cognitive performance patterns.',
    icon: Coffee,
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: 'Daily Focus transformed my creative process. I&apos;m producing my best work in half the time.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Software Developer',
    content: 'The AI scheduling is revolutionary. It knows exactly when I should be coding vs. in meetings.',
    rating: 5,
  },
];

const stats = [
  { value: '98%', label: 'Focus Accuracy' },
  { value: '3.5x', label: 'Productivity Boost' },
  { value: '87%', label: 'Work Satisfaction' },
  { value: '4.9★', label: 'User Rating' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Hero Section - Synchronized Grid Layout */}
      <section className="px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid-hero">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full border glass-morphism">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  AI-Powered Productivity
                </span>
              </div>

              <h1 className="display-text text-5xl lg:text-7xl leading-tight">
                <span style={{ color: 'var(--text-primary)' }}>Master</span>
                <br />
                <span style={{ color: 'var(--accent)' }}>Your Focus</span>
                <br />
                <span style={{ color: 'var(--secondary)' }}>Evolution</span>
              </h1>

              <p className="text-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Experience the convergence of artificial intelligence and human potential.
                Transform chaos into synchronized productivity harmony.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 interactive-card"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <ArrowRight className="mr-2 w-5 h-5" />
                  Start Evolution
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg border-2 glass-morphism transition-all duration-200 interactive-card"
                  style={{
                    borderColor: 'var(--border-glow)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Explore Experience
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-xl glass-morphism interactive-card"
                >
                  <div className="display-text text-3xl font-black mb-2" style={{ color: 'var(--accent)' }}>
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

      {/* Features Section - Synchronized Grid */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="display-text text-4xl lg:text-5xl mb-6">
              <span style={{ color: 'var(--secondary)' }}>Intelligent</span> Design
              <br />
              <span style={{ color: 'var(--accent)' }}>Meets</span> Human Potential
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every feature engineered through extensive research into cognitive psychology,
              behavioral economics, and productivity science.
            </p>
          </motion.div>

          <div className="grid-features">
            {featureHighlights.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl glass-morphism interactive-card"
                  style={{ backgroundColor: 'var(--surface-secondary)' }}
                >
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-6"
                       style={{
                         backgroundColor: 'var(--surface)',
                         border: `2px solid var(--border-glow)`
                       }}>
                    <Icon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                  </div>

                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Synchronized Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="display-text text-4xl lg:text-5xl mb-6">
              <span style={{ color: 'var(--accent)' }}>Stories</span> of
              <br />
              <span style={{ color: 'var(--secondary)' }}>Transformation</span>
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Real results from professionals who&apos;ve revolutionized their productivity
            </p>
          </motion.div>

          <div className="grid-testimonials">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl glass-morphism interactive-card"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 mr-1" style={{ color: 'var(--yellow)' }} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xl leading-relaxed mb-8 italic" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4" style={{
                    backgroundColor: 'var(--surface-secondary)',
                    border: `2px solid var(--accent)`
                  }}></div>
                  <div>
                    <div className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                      {testimonial.name}
                    </div>
                    <div className="font-medium" style={{ color: 'var(--text-muted)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Clean & Simple */}
      <section className="px-6 py-20" style={{ backgroundColor: 'var(--secondary)' }}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="display-text text-4xl lg:text-6xl text-white font-black">
              Begin Your
              <br />
              Focus Evolution
              <br />
              Today
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join professionals who&apos;ve discovered their true productive potential
              through intelligent design and AI-powered workflow optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/auth/register"
                className="px-12 py-5 bg-white text-xl font-black rounded-2xl transition-all duration-200 inline-flex items-center justify-center interactive-card"
                style={{ color: 'var(--secondary)' }}
              >
                <TrendingUp className="mr-3 w-6 h-6" />
                Start Free Evolution
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>

              <Link
                href="/contact"
                className="px-12 py-5 border-2 border-white text-xl font-black rounded-2xl text-white transition-all duration-200 inline-flex items-center justify-center glass-morphism interactive-card"
              >
                Discover Harmony
                <Zap className="ml-3 w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Synchronized Grid Layout */}
      <footer className="px-6 py-16 border-t" style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)'
      }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid-footer mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="display-text text-3xl mb-4 font-black" style={{ color: 'var(--text-primary)' }}>
                Daily Focus
              </h3>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                Where intelligent design meets human potential in perfect harmony
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Experience</h4>
              <div className="flex flex-wrap justify-center gap-6">
                {['Features', 'Pricing', 'Testimonials', 'Blog'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-lg font-medium transition-colors block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-right"
            >
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Legal</h4>
              <div className="flex flex-wrap justify-end gap-6">
                {['Privacy', 'Terms', 'Contact', 'Support'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-lg font-medium transition-colors block"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t"
               style={{ borderColor: 'var(--border)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Daily Focus. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Powered by Intelligence
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}