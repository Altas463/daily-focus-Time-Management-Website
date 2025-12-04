'use client';

import Navbar from '@/components/navbar/Navbar';
import Link from 'next/link';
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
  ArrowUpRight,
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                v2.0 is now live
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Focus on <br />
                <span className="text-blue-600">what matters</span>
              </h1>

              <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                The productivity platform that helps you achieve more with less stress.
                Simple, beautiful, effective.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/auth/register" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 h-auto">
                  Start for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4 h-auto"
                >
                  Explore Demo
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-8 border-t border-slate-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      U{i}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Loved by 50,000+ users</p>
                </div>
              </div>
            </div>

            {/* Right Column - Visual/Stats */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl -z-10 transform rotate-2"></div>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8 grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center hover:border-blue-100 transition-colors">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-xl text-slate-600">
              Powerful features designed with intention. No bloat, no distractions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Simple by design</h2>
            <p className="text-xl text-slate-600">Get started in three steps. No learning curve.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Create Tasks', desc: 'Add your tasks with priorities and deadlines. Keep it simple.' },
              { step: '02', title: 'Start Focusing', desc: 'Use the Pomodoro timer to work in focused intervals.' },
              { step: '03', title: 'Track Progress', desc: 'Review your analytics and celebrate your wins.' },
            ].map((item) => (
              <div key={item.step} className="relative pl-8 border-l-2 border-slate-100 hover:border-blue-500 transition-colors duration-300">
                <div className="text-6xl font-bold text-slate-100 absolute -top-4 left-6 -z-10 select-none">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Loved by thoughtful people</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
                <Quote className="w-8 h-8 text-blue-400 mb-6 opacity-50" />
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl p-12 lg:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to focus?</h2>
              <p className="text-xl text-blue-100 mb-10">
                Join thousands who have discovered the power of intentional work. Start free today.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Daily Focus</span>
              </div>
              <p className="text-slate-500 text-sm mb-6">
                Simple productivity for thoughtful people.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-500">All systems operational</span>
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'API'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-slate-900 mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Daily Focus. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              Made with <CheckCircle2 className="w-4 h-4 text-blue-600 mx-1" /> for focused work
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
