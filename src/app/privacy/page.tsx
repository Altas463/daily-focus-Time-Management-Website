import Link from 'next/link';

const sections = [
  {
    heading: 'What information we collect',
    body: [
      'Your account details like name and email address to create and manage your profile.',
      'The content you choose to add to your workspace: tasks, notes, and Pomodoro sessions.',
      'Usage insights that help us understand how you use Daily Focus and improve your experience.',
    ],
  },
  {
    heading: 'How we use your information',
    body: [
      'To deliver and enhance Daily Focus, including monitoring performance and fixing issues.',
      'To send important service updates and respond when you reach out for support.',
      'To share product news and updates when you\'ve chosen to receive them.',
    ],
  },
  {
    heading: 'Your data, your control',
    body: [
      'Export or delete your workspace anytime from your dashboard settings.',
      'We keep backups for 30 days to protect against accidental data loss.',
      'When you close your account, we remove your personal information from active systems within 7 days.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Privacy notice</p>
          <h1 className="text-4xl font-semibold">Your privacy is our priority</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We built Daily Focus with privacy at its core. Here&apos;s exactly what we collect, why we need it, 
            and how you stay in control of your information.
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Questions about privacy?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You can manage most privacy settings right from your dashboard. For specific requests or more details, 
              reach out to us through the{' '}
              <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact form</Link>.
            </p>
          </section>
        </main>

        <footer className="text-xs text-gray-500 dark:text-gray-400">
          Last updated {new Date().getFullYear()} — We review and update this privacy policy regularly to keep you informed.
        </footer>
      </div>
    </div>
  );
}
