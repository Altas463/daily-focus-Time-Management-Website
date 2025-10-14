'use client';

interface PomodoroSettingsProps {
  workMinutes: number;
  breakMinutes: number;
  onWorkMinutesChange: (newMinutes: number) => void;
  onBreakMinutesChange: (newMinutes: number) => void;
}

export default function PomodoroSettings({
  workMinutes,
  breakMinutes,
  onWorkMinutesChange,
  onBreakMinutesChange,
}: PomodoroSettingsProps) {
  return (
    <div className="mt-4 mb-8 flex flex-wrap items-center justify-center gap-6">
      <div className="flex w-48 flex-col items-center rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label htmlFor="work" className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-100">
          Focus minutes
        </label>
        <input
          id="work"
          type="number"
          min={1}
          max={120}
          value={workMinutes}
          onChange={(event) => onWorkMinutesChange(Number(event.target.value))}
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-center text-lg font-semibold text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">minutes</span>
      </div>

      <div className="flex w-48 flex-col items-center rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <label htmlFor="break" className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-100">
          Break minutes
        </label>
        <input
          id="break"
          type="number"
          min={1}
          max={60}
          value={breakMinutes}
          onChange={(event) => onBreakMinutesChange(Number(event.target.value))}
          className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-center text-lg font-semibold text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <span className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">minutes</span>
      </div>
    </div>
  );
}
