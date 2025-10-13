import BackToDashboardLink from '@/components/BackToDashboardLink';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';

const focusTips = [
  'T?t th�ng b�o tr�n di?n tho?i v� m�y t�nh.',
  'Chu?n b? nu?c u?ng v� ghi ch� tru?c khi b?t d?u.',
  'H�t s�u, d?t m?c ti�u r� r�ng cho phi�n n�y.',
];

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
        <div className="flex items-center justify-between">
          <BackToDashboardLink />
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white dark:bg-gray-100 dark:text-gray-900">
            <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden />
            �ang t?p trung
          </span>
        </div>

        <div className="space-y-6">
          <header className="space-y-3">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Pomodoro focus session</h1>
            <p className="max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              T?p trung to�n b? cho nhi?m v? quan tr?ng trong 25 ph�t. Sau d� ngh? ng?n 5 ph�t d? n?p l?i nang lu?ng v� l?p l?i chu tr�nh n?u c?n.
            </p>
          </header>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <PomodoroTimer focusMode />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">M?o gi�p b?n t?p trung</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {focusTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" aria-hidden />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
