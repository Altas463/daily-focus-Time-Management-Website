const sections = [
  {
    heading: 'Using Daily Focus responsibly',
    items: [
      'You must be 16 or older to create an account, or have parental permission if you\'re younger.',
      'Keep your login details secure and take responsibility for what you add to your workspace.',
      'Some features are in beta and may change—we\'ll always let you know what\'s experimental.',
    ],
  },
  {
    heading: 'Billing and subscriptions',
    items: [
      'Paid plans renew automatically unless you cancel at least 24 hours before your next billing date.',
      'Downgrade or cancel anytime from your billing settings—your free features remain active.',
      'Fees are non-refundable except where required by applicable law.',
    ],
  },
  {
    heading: 'Community guidelines',
    items: [
      'Don\'t upload harmful code, try to disrupt our service, or access data that isn\'t yours.',
      'Respect intellectual property rights when sharing content through Daily Focus.',
      'We may suspend access if activities violate these terms or applicable laws.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Terms of service</p>
          <h1 className="text-4xl font-semibold">Our commitment to you</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            These terms outline our shared understanding—your rights and responsibilities, and the promises 
            we make to provide you with a reliable, secure experience.
          </p>
        </header>

        <main className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.heading}</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Keeping these terms current</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              When we update these terms, we&apos;ll highlight the changes in your dashboard and update the date below.
              Continuing to use Daily Focus means you accept the latest version.
            </p>
          </section>
        </main>

        <footer className="text-xs text-gray-500 dark:text-gray-400">
          Effective {new Date().getFullYear()} — Your thoughts on these terms are always welcome at support@dailyfocus.app.
        </footer>
      </div>
    </div>
  );
}
