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
    <div className="flex justify-center items-center gap-8 mt-4 mb-6">
      <div className="flex flex-col items-center bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 w-44">
        <label htmlFor="work" className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
          🧠 Làm việc
        </label>
        <input
          id="work"
          type="number"
          min={1}
          max={120}
          value={workMinutes}
          onChange={(e) => onWorkMinutesChange(Number(e.target.value))}
          className="w-full text-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-lg font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-300">phút</span>
      </div>

      <div className="flex flex-col items-center bg-white dark:bg-gray-700 rounded-xl shadow-md p-4 w-44">
        <label htmlFor="break" className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
          ☕ Nghỉ ngơi
        </label>
        <input
          id="break"
          type="number"
          min={1}
          max={60}
          value={breakMinutes}
          onChange={(e) => onBreakMinutesChange(Number(e.target.value))}
          className="w-full text-center rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-lg font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-300">phút</span>
      </div>
    </div>
  );
}
