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
    <div className="flex justify-center items-center gap-6 mt-4 mb-8">
      <div className="group flex flex-col items-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-600/50 p-5 w-48 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🧠</span>
          </div>
          <label htmlFor="work" className="text-sm font-semibold text-gray-700 dark:text-white">
            Làm việc
          </label>
        </div>
        <input
          id="work"
          type="number"
          min={1}
          max={120}
          value={workMinutes}
          onChange={(e) => onWorkMinutesChange(Number(e.target.value))}
          className="w-full text-center rounded-xl border border-gray-200/50 dark:border-gray-600/50 px-4 py-3 text-lg font-semibold bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
        />
        <span className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">phút</span>
      </div>

      <div className="group flex flex-col items-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-600/50 p-5 w-48 hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">☕</span>
          </div>
          <label htmlFor="break" className="text-sm font-semibold text-gray-700 dark:text-white">
            Nghỉ ngơi
          </label>
        </div>
        <input
          id="break"
          type="number"
          min={1}
          max={60}
          value={breakMinutes}
          onChange={(e) => onBreakMinutesChange(Number(e.target.value))}
          className="w-full text-center rounded-xl border border-gray-200/50 dark:border-gray-600/50 px-4 py-3 text-lg font-semibold bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
        />
        <span className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">phút</span>
      </div>
    </div>
  );
}