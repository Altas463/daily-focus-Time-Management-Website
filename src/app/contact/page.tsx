import Link from 'next/link';

const faqs = [
  {
    q: 'How quickly do you reply to support requests?',
    a: 'We respond within one business day, often much sooner. Priority support is available on paid plans.',
  },
  {
    q: 'Can I request a demo for my team?',
    a: 'Yes. Schedule a walkthrough and we will tailor it to your workflow and questions.',
  },
  {
    q: 'Where can I suggest new features?',
    a: 'Use the contact form or submit feedback directly from the dashboard. We review every idea.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 py-16 md:grid-cols-2 md:items-start">
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Contact</p>
          <h1 className="text-4xl font-semibold">We would love to hear from you</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Have a question about Daily Focus, found a bug, or need help rolling out to your team?
            Send us a note and we will get back to you promptly.
          </p>

          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <p className="font-semibold">Email</p>
              <Link href="mailto:support@dailyfocus.app" className="text-blue-600 hover:underline dark:text-blue-400">
                support@dailyfocus.app
              </Link>
            </div>
            <div>
              <p className="font-semibold">Live sessions</p>
              <p>Book a 30-minute onboarding call and we will tailor Daily Focus to your workflow.</p>
              <Link href="https://cal.com" className="text-blue-600 hover:underline dark:text-blue-400">
                Schedule a call →
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <form className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="grid gap-4">
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700 dark:text-gray-200">Name</span>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700 dark:text-gray-200">Email</span>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium text-gray-700 dark:text-gray-200">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Tell us how we can help."
                  required
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900"
              >
                Send message
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Frequently asked</h2>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {faqs.map((faq) => (
                <li key={faq.q}>
                  <p className="font-medium text-gray-900 dark:text-white">{faq.q}</p>
                  <p>{faq.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
