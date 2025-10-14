import BackToDashboardLink from "@/components/BackToDashboardLink";

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <BackToDashboardLink />

      <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500 dark:text-gray-400">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-50">Your workspace identity</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Manage the information other teammates see, including your display name, avatar, and contact details.
        </p>
      </header>

      <section className="space-y-6 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Public profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your name, headline, and profile photo.</p>
        </div>

        <form className="grid gap-6 md:grid-cols-2" autoComplete="off">
          <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">Display name</span>
            <input
              type="text"
              name="displayName"
              placeholder="Jane Doe"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">Role or focus area</span>
            <input
              type="text"
              name="role"
              placeholder="Product design student"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>

          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="font-medium">About you</span>
            <textarea
              name="bio"
              rows={4}
              placeholder="Share a short introduction for collaborators."
              className="resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            />
          </label>
        </form>

        <button
          type="button"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:bg-white dark:text-gray-900 dark:hover:bg-white/90"
        >
          Save changes
        </button>
      </section>
    </div>
  );
}
