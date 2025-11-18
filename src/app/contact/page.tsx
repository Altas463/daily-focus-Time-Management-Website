import Link from 'next/link';

const faqs = [
  {
    q: 'How quickly will you respond to my message?',
    a: 'We typically reply within one business day, often much sooner. Paid plans include priority support for even faster responses.',
  },
  {
    q: 'Can I get a personalized demo for my team?',
    a: 'Absolutely! Schedule a free walkthrough and we\'ll customize it to match your team\'s workflow and answer your specific questions.',
  },
  {
    q: 'Where can I share feature ideas or feedback?',
    a: 'Use the contact form or send feedback directly from your dashboard. We read and consider every suggestion from our community.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto grid max-w-5xl gap-16 px-6 py-16 md:grid-cols-2 md:items-start">
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Get in touch</p>
          <h1 className="text-4xl font-semibold">We&apos;d love to hear from you</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Whether you have questions about Daily Focus, discovered something that needs fixing, 
            or want help bringing your team on board—we&apos;re here and ready to help.
          </p>

          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
            <div>
              <p className="font-semibold">Email</p>
              <Link href="mailto:support@dailyfocus.app" className="text-blue-600 hover:underline dark:text-blue-400">
                support@dailyfocus.app
              </Link>
            </div>
            <div>
              <p className="font-semibold">Personalized onboarding</p>
              <p>Book a free 30-minute call and we&apos;ll tailor Daily Focus to perfectly fit your workflow.</p>
              <Link href="https://cal.com" className="text-blue-600 hover:underline dark:text-blue-400">
                Schedule your session →
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
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Common questions</h2>
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
