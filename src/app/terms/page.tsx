const sections = [
  {
    heading: 'Using Daily Focus',
    items: [
      'You must be at least 16 years old to create an account or have parental consent.',
      'You are responsible for content added to your workspace and for keeping login credentials secure.',
      'Beta features may change without notice; we will clearly mark anything experimental.',
    ],
  },
  {
    heading: 'Payments and cancellation',
    items: [
      'Subscriptions renew automatically unless cancelled at least 24 hours before the renewal date.',
      'You can downgrade or cancel any paid plan from the billing screen and continue using the free tier.',
      'Fees are non-refundable except where required by local law.',
    ],
  },
  {
    heading: 'Acceptable use',
    items: [
      'Do not upload malicious code, attempt to disrupt the service, or access data that is not yours.',
      'Respect intellectual property rights when storing and sharing content through Daily Focus.',
      'We may suspend access if activity violates these terms or applicable regulations.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Terms of service</p>
          <h1 className="text-4xl font-semibold">The essentials for using Daily Focus</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please read these terms carefully. They describe your rights, responsibilities, and the commitments
            we make to deliver a reliable experience.
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Changes to these terms</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              When we update these terms we will highlight the change in the dashboard banner and update the revision
              date below. Continued use of Daily Focus means you accept the latest version.
            </p>
          </section>
        </main>

        <footer className="text-xs text-gray-500 dark:text-gray-400">
          Effective {new Date().getFullYear()} · We welcome feedback about these terms at support@dailyfocus.app.
        </footer>
      </div>
    </div>
  );
}
