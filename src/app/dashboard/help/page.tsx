"use client";

import BackToDashboardLink from "@/components/BackToDashboardLink";
import Link from "next/link";

const faqs = [
 {
   question: "How do I migrate tasks from another tool?",
   answer:
     "Export your tasks as CSV, then visit Dashboard > Tasks and use the import wizard in the top-right corner to map columns.",
 },
 {
   question: "Where can I adjust timer defaults?",
   answer: (
     <>
       Head to{" "}
       <Link
         href="/dashboard/settings"
         className="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400"
       >
         Settings
       </Link>{" "}
       and update the Pomodoro defaults. Changes apply the next time you start a session.
     </>
   ),
 },
 {
   question: "Can I invite teammates?",
   answer: (
     <>
       Daily Focus for Teams is in beta. Join the waitlist from the{" "}
       <Link
         href="/dashboard/settings"
         className="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition hover:decoration-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:decoration-blue-400"
       >
         Settings
       </Link>{" "}
       page and we will notify you when access opens.
     </>
   ),
 },
];

export default function HelpPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Help Center</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">Find answers and get support</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Browse quick tips, onboarding guides, and troubleshooting resources. Still stuck? Reach out to the team directly.
        </p>
      </header>

      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Popular questions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Short answers for the most common questions from new users.</p>
        </div>

        <ul className="space-y-4">
          {faqs.map((item) => (
            <li key={item.question} className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/60">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.question}</h3>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.answer}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Need more help?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Open a support ticket or join the community forum for peer tips.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
            >
              Contact support
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/40 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
            >
              Visit community
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
