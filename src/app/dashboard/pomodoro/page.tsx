import BackToDashboardLink from '@/components/BackToDashboardLink';
import FocusSoundscape from '@/components/pomodoro/FocusSoundscape';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[-40%] mx-auto h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-blue-500/20 via-emerald-400/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-30%] left-[10%] h-[32rem] w-[32rem] rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[-15%] top-[15%] hidden h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl md:block" />
      </div>

      <header className="flex items-center justify-between gap-3 px-6 py-6 md:px-12">
        <BackToDashboardLink />
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-100/80">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
          Focus mode
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-10 px-6 pb-16 pt-4 md:px-12 lg:px-24">
        <div className="flex flex-1 flex-col items-center justify-center gap-12 lg:flex-row lg:items-stretch">
          <section
            aria-label="Pomodoro timer"
            className="flex flex-1 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <PomodoroTimer focusMode />
          </section>

          <aside className="flex w-full max-w-md flex-col items-stretch gap-8">
            <FocusSoundscape />

            <section
              aria-label="Guided breathing"
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
            >
              <div className="mx-auto flex h-40 w-40 items-center justify-center">
                <div className="breathing-orb relative h-full w-full rounded-full bg-gradient-to-br from-blue-500/60 via-blue-400/30 to-emerald-400/40" />
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-200/80">
                <p className="font-medium uppercase tracking-[0.2em] text-slate-100/90">Breathing space</p>
                <p>Inhale for 4, hold for 4, exhale for 6. Let the orb guide a calm rhythm between sprints.</p>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes breath {
          0% {
            transform: scale(0.9);
            opacity: 0.75;
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.25);
          }
          40% {
            transform: scale(1.08);
            opacity: 1;
            box-shadow: 0 0 0 24px rgba(56, 189, 248, 0);
          }
          70% {
            transform: scale(1.02);
            opacity: 0.9;
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0.12);
          }
          100% {
            transform: scale(0.9);
            opacity: 0.75;
            box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
          }
        }

        .breathing-orb::before,
        .breathing-orb::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, rgba(165, 243, 252, 0.4), transparent 65%);
          mix-blend-mode: screen;
        }

        .breathing-orb {
          animation: breath 12s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.25);
          filter: saturate(1.2);
        }
      `}</style>
    </div>
  );
}
