'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, ArrowRight, Star, Sparkles, Layers, Grid3x3, ArrowDownRight, ArrowUpRight, Brain, Timer, Coffee } from 'lucide-react';

const featureHighlights = [
  {
    title: 'Intelligent Flow State',
    description: 'AI-powered focus optimization adapts to your natural productivity rhythms, creating perfect work sessions.',
    icon: Brain,
    delay: 0.2,
  },
  {
    title: 'Deep Work Sessions',
    description: 'Immersive time-blocking with environmental sounds and distraction-blocking technology.',
    icon: Timer,
    delay: 0.4,
  },
  {
    title: 'Energy Management',
    description: 'Smart scheduling based on your natural energy cycles and cognitive performance patterns.',
    icon: Coffee,
    delay: 0.6,
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

const floatingElements = [
  { icon: Sparkles, position: 'top-20 left-10', delay: 0, color: 'var(--accent)' },
  { icon: Layers, position: 'top-40 right-20', delay: 1, color: 'var(--secondary)' },
  { icon: Grid3x3, position: 'bottom-40 left-20', delay: 2, color: 'var(--gold)' },
  { icon: ArrowUpRight, position: 'bottom-20 right-10', delay: 3, color: 'var(--mint)' },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 animate-float"
             style={{ background: 'radial-gradient(circle, var(--secondary) 0%, transparent 70%)' }}></div>
        <div className="absolute top-60 right-32 w-96 h-96 rounded-full opacity-15 animate-float"
             style={{
               background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
               animationDelay: '2s'
             }}></div>
        <div className="absolute bottom-40 left-40 w-64 h-64 rounded-full opacity-10 animate-float"
             style={{
               background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)',
               animationDelay: '4s'
             }}></div>

        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, var(--border) 35px, var(--border) 70px)`,
            backgroundSize: '200% 200%',
            animation: 'shimmer 15s linear infinite'
          }}></div>
        </div>

        {/* Floating Icons */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className={`absolute ${element.position}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: element.delay }}
            >
              <Icon
                className="w-6 h-6 animate-pulse-glow"
                style={{ color: element.color }}
              />
            </motion.div>
          );
        })}
      </div>

      <Navbar />

      {/* Complex Hero Section with Overlapping Elements */}
      <section className="relative px-6 pt-32 pb-40">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            {/* Side decorative elements */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute left-0 top-0 hidden lg:block"
            >
              <div className="w-1 h-32 animate-pulse-glow" style={{ backgroundColor: 'var(--accent)' }}></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 0.8, x: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute right-0 top-20 hidden lg:block"
            >
              <div className="w-1 h-24 animate-pulse-glow" style={{ backgroundColor: 'var(--secondary)' }}></div>
            </motion.div>

            {/* Main hero content with asymmetric layout */}
            <div className="grid-asymmetric items-center">
              {/* Left Column - Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="col-span-2"
              >
                {/* Floating tag */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center px-4 py-2 mb-8 rounded-full border glass-morphism"
                >
                  <Sparkles className="w-4 h-4 mr-2" style={{ color: 'var(--accent)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    AI-Powered Productivity Evolution
                  </span>
                </motion.div>

                {/* Complex headline with staggered animation */}
                <h1 className="display-text leading-none mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-black"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Master
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-5xl md:text-6xl lg:text-7xl mt-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    Your Focus
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-4xl md:text-5xl lg:text-6xl mt-2"
                    style={{
                      color: 'var(--accent)',
                      textShadow: '0 0 30px rgba(246, 135, 179, 0.3)'
                    }}
                  >
                    Revolution
                  </motion.div>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="text-xl md:text-2xl mb-12 leading-relaxed"
                  style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}
                >
                  Experience the convergence of artificial intelligence and human potential.
                  Transform chaos into synchronized productivity harmony.
                </motion.p>

                {/* Complex CTA Layout */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="relative group"
                  >
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg transition-all duration-400 neon-border interactive-card"
                      style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
                    >
                      <ArrowRight className="mr-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Begin Evolution
                      <span className="ml-2 animate-pulse-glow" style={{ color: 'var(--accent)' }}>●</span>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Link
                      href="/dashboard"
                      className="group flex items-center justify-center px-10 py-5 rounded-xl font-bold text-lg border-2 glass-morphism transition-all duration-400"
                      style={{
                        borderColor: 'var(--border-glow)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <ArrowDownRight className="mr-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      Explore Experience
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Interactive Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="col-span-1 lg:col-span-2 relative"
              >
                <div className="relative">
                  {/* Floating stats cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 4).map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          delay: 1.7 + index * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: 'var(--shadow-glow)'
                        }}
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
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Features Section */}
      <section className="relative overlap-layout px-6 py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="display-text text-5xl md:text-6xl mb-6">
              <span style={{ color: 'var(--primary)' }}>Intelligent</span> Design
              <br />
              <span style={{ color: 'var(--accent)' }}>Meets</span> Human
              <br />
              <span style={{ color: 'var(--secondary)' }}>Potential</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every feature engineered through extensive research into cognitive psychology,
              behavioral economics, and productivity science.
            </p>
          </motion.div>

          {/* Complex Feature Grid */}
          <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 grid grid-cols-3 gap-8 opacity-20">
              <div className="col-span-1 h-full rounded-2xl" style={{ backgroundColor: 'var(--surface-secondary)' }}></div>
              <div className="col-span-1 h-full rounded-2xl" style={{ backgroundColor: 'var(--surface-tertiary)' }}></div>
              <div className="col-span-1 h-full rounded-2xl" style={{ backgroundColor: 'var(--surface-secondary)' }}></div>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3">
              {featureHighlights.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: feature.delay,
                      type: "spring",
                      stiffness: 80
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -12,
                      scale: 1.02,
                      boxShadow: 'var(--shadow-accent)'
                    }}
                    className="group relative p-8 rounded-2xl glass-morphism interactive-card"
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: `1px solid var(--border-glow)`
                    }}
                  >
                    {/* Floating icon background */}
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                         style={{ backgroundColor: 'var(--accent)' }}></div>

                    {/* Icon container */}
                    <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                         style={{
                           backgroundColor: 'var(--surface-secondary)',
                           boxShadow: 'var(--shadow-glow)'
                         }}>
                      <Icon className="w-8 h-8" style={{ color: 'var(--accent)' }} />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-3xl transition-all duration-300"
                        style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 group-hover:text-xl transition-all duration-300"
                       style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                        Discover more
                      </span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                                   style={{ color: 'var(--accent)' }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Diagonal Testimonials Section */}
      <section className="relative diagonal-section px-6 py-32" style={{ backgroundColor: 'var(--surface-secondary)' }}>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="display-text text-5xl md:text-6xl mb-6">
              <span style={{ color: 'var(--accent)' }}>Stories</span> of
              <br />
              <span style={{ color: 'var(--primary)' }}>Transformation</span>
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Real results from professionals who&apos;ve revolutionized their productivity
            </p>
          </motion.div>

          {/* Asymmetric testimonial layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, x: index === 0 ? -60 : 60, y: 40 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 1,
                  delay: index * 0.3,
                  type: "spring"
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="relative p-8 lg:p-12 rounded-3xl glass-morphism interactive-card"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: `1px solid var(--border-glow)`
                }}
              >
                {/* Decorative corner elements */}
                <div className="absolute top-4 left-4 w-2 h-2 rounded-full animate-pulse-glow"
                     style={{ backgroundColor: 'var(--accent)' }}></div>
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse-glow"
                     style={{ backgroundColor: 'var(--secondary)' }}></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full animate-pulse-glow"
                     style={{ backgroundColor: 'var(--secondary)' }}></div>
                <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full animate-pulse-glow"
                     style={{ backgroundColor: 'var(--accent)' }}></div>

                {/* Rating */}
                <div className="flex mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.3 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-6 h-6 mr-2" style={{ color: 'var(--gold)' }} fill="currentColor" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote with animated underline */}
                <div className="relative mb-8">
                  <p className="text-2xl leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1, delay: index * 0.3 + 0.5 }}
                    viewport={{ once: true }}
                    className="h-1 mt-4 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  ></motion.div>
                </div>

                {/* Author section with hover effects */}
                <div className="flex items-center group">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full mr-4 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--surface-tertiary)',
                      border: `2px solid var(--accent)`
                    }}
                  ></motion.div>
                  <div>
                    <div className="font-bold text-xl group-hover:text-2xl transition-all duration-300"
                         style={{ color: 'var(--text-primary)' }}>
                      {testimonial.name}
                    </div>
                    <div className="font-medium transition-colors duration-300"
                         style={{ color: 'var(--text-muted)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave CTA Section */}
      <section className="relative wave-section px-6 py-32 overflow-hidden" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="relative mx-auto max-w-6xl text-center">
          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 opacity-30"
          >
            <Zap className="w-12 h-12" style={{ color: 'var(--gold)' }} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 opacity-30"
          >
            <Target className="w-10 h-10" style={{ color: 'var(--accent-light)' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <h2 className="display-text text-4xl md:text-6xl mb-8 text-white font-black">
              Begin Your
              <br />
              <span className="animate-pulse-glow">Focus Revolution</span>
              <br />
              Today
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
              Join the movement of professionals who&apos;ve discovered their true productive potential
              through intelligent design and AI-powered workflow optimization.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth/register"
                  className="group px-12 py-6 bg-white text-xl font-black rounded-2xl transition-all duration-400 flex items-center justify-center"
                  style={{ color: 'var(--primary)' }}
                >
                  <TrendingUp className="mr-3 w-6 h-6" />
                  Start Free Evolution
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/contact"
                  className="group px-12 py-6 border-3 border-white text-xl font-black rounded-2xl text-white transition-all duration-400 flex items-center justify-center glass-morphism"
                >
                  Discover Harmony
                  <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Complex Footer with Interactive Elements */}
      <footer className="relative py-20 px-6 border-t" style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface-secondary)'
      }}>
        <div className="mx-auto max-w-7xl">
          {/* Complex footer layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="text-center md:text-left"
            >
              <h3 className="display-text text-3xl mb-4 font-black" style={{ color: 'var(--text-primary)' }}>
                Daily Focus
              </h3>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Where intelligent design meets human potential in perfect harmony
              </p>
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Layers className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Experience</h4>
              <div className="flex flex-wrap justify-center gap-6">
                {['Features', 'Pricing', 'Testimonials', 'Blog'].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-lg font-medium transition-colors hover:scale-105 block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center md:text-right"
            >
              <h4 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Legal</h4>
              <div className="flex flex-wrap justify-center md:justify-end gap-6">
                {['Privacy', 'Terms', 'Contact', 'Support'].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-lg font-medium transition-colors hover:scale-105 block"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom section with hover effects */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t"
               style={{ borderColor: 'var(--border)' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center md:text-left mb-6 md:mb-0"
            >
              <p style={{ color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Daily Focus. All rights reserved.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Powered by Intelligence
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}