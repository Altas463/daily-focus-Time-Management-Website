import BackToDashboardLink from "@/components/BackToDashboardLink";

const notificationChannels = [
  { key: "email", label: "Email summaries", description: "Daily focus reports and reminders" },
  { key: "push", label: "Push notifications", description: "Session nudges and timer alerts" },
  { key: "weekly", label: "Weekly digest", description: "Highlights from tasks, stats, and reviews" },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">Tune your Daily Focus workspace</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Adjust notifications, default timers, and workspace preferences to match how you plan, track, and ship work.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose when Daily Focus should keep you in the loop.</p>
          </div>

          <form className="space-y-4">
            {notificationChannels.map((channel) => (
              <label key={channel.key} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm text-gray-700 transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-950" />
                <span>
                  <span className="block font-medium">{channel.label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">{channel.description}</span>
                </span>
              </label>
            ))}
          </form>

          <button
            type="button"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
          >
            Update notifications
          </button>
        </article>

        <article className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pomodoro defaults</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set baseline focus and break lengths for new sessions.</p>
          </div>

          <form className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
            <label className="flex flex-col gap-2">
              <span className="font-medium">Focus duration (minutes)</span>
              <input
                type="number"
                min={10}
                max={90}
                defaultValue={25}
                className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium">Short break (minutes)</span>
              <input
                type="number"
                min={2}
                max={30}
                defaultValue={5}
                className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium">Long break (minutes)</span>
              <input
                type="number"
                min={5}
                max={60}
                defaultValue={15}
                className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>
          </form>

          <button
            type="button"
            className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300/40 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-900/60"
          >
            Save timer defaults
          </button>
        </article>
      </section>
    </div>
  );
}
