import Link from 'next/link';

const sections = [
  {
    heading: 'Information we collect',
    body: [
      'Account details such as name, email address, and authentication identifiers.',
      'Workspace content that you intentionally add: tasks, notes, or Pomodoro entries.',
      'Usage analytics that help us understand feature adoption and prioritise improvements.',
    ],
  },
  {
    heading: 'How we use your data',
    body: [
      'Operate and improve Daily Focus, including performance monitoring and debugging.',
      'Send essential service messages and respond to support requests.',
      'Deliver optional product updates when you explicitly opt in.',
    ],
  },
  {
    heading: 'Data retention and deletion',
    body: [
      'You can export or delete your workspace at any time from the dashboard settings.',
      'Backups are retained for up to 30 days to prevent accidental data loss.',
      'When you close your account we remove personal data from active systems within 7 days.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Privacy notice</p>
          <h1 className="text-4xl font-semibold">How Daily Focus handles your data</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We design Daily Focus with privacy in mind. This page explains what information we collect,
            how it is used, and the options available to you.
          </p>
        </header>

        <main className="space-y-10">
          {sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.heading}</h2>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {section.body.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Questions or requests</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can update most privacy preferences from the dashboard settings page. If you have a specific
              request or need additional detail, please reach us directly via the{' '}
              <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact form</Link>.
            </p>
          </section>
        </main>

        <footer className="text-xs text-gray-500 dark:text-gray-400">
          Last updated {new Date().getFullYear()} - Daily Focus commits to reviewing this policy at least once per year.
        </footer>
      </div>
    </div>
  );
}
