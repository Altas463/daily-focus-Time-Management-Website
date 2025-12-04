import BackToDashboardLink from "@/components/BackToDashboardLink";

const faqs = [
  {
    question: "How do I migrate tasks from another tool?",
    answer:
      "Export your tasks as CSV, then visit Dashboard > Tasks and use the import wizard in the top-right corner to map columns.",
  },
  {
    question: "Where can I adjust timer defaults?",
    answer:
      "Head to Settings and update the Pomodoro defaults. Changes apply the next time you start a session.",
  },
  {
    question: "Can I invite teammates?",
    answer:
      "Daily Focus for Teams is in beta. Join the waitlist from the Settings page and we will notify you when access opens.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <BackToDashboardLink />
        <div className="h-4 w-px bg-border-default"></div>
        <span className="text-sm font-mono text-slate-500 uppercase tracking-wider">Help Center</span>
      </div>

      <header>
        <h1 className="text-3xl font-display font-bold mb-2">Find answers and get support</h1>
        <p className="text-slate-500 font-mono text-sm">{"// Browse quick tips, onboarding guides, and troubleshooting resources."}</p>
      </header>

      <section className="bento-card">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="label-tech">POPULAR QUESTIONS</span>
          </div>
          <p className="text-sm text-slate-500 font-mono">Short answers for the most common questions from new users.</p>
        </div>

        <ul className="space-y-4">
          {faqs.map((item) => (
            <li key={item.question} className="p-4 bg-surface-base border border-border-subtle rounded-sm transition hover:border-primary">
              <h3 className="text-sm font-mono font-bold text-slate-800">{item.question}</h3>
              <p className="mt-2 text-sm text-slate-600 font-mono">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bento-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="label-tech">NEED MORE HELP?</span>
            <p className="text-sm text-slate-500 font-mono mt-2">Open a support ticket or join the community forum for peer tips.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-tech-primary"
            >
              CONTACT SUPPORT
            </button>
            <button
              type="button"
              className="btn-tech-secondary"
            >
              VISIT COMMUNITY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
