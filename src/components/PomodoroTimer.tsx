// src/components/PomodoroTimer.tsx
'use client';

import { useState } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import PomodoroSettings from './PomodoroSettings';

function formatTime(secs: number) {
  const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
  const seconds = (secs % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PomodoroTimer() {
  // Khởi tạo với 25 phút work, 5 phút break mặc định
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  // Truyền thời gian vào hook
  const {
    secondsLeft,
    isRunning,
    mode,
    start,
    pause,
    reset,
    updateWorkDuration,
    updateBreakDuration,
  } = usePomodoro(workMinutes, breakMinutes);

  // Cập nhật thời gian khi người dùng thay đổi settings
  const handleWorkMinutesChange = (newMin: number) => {
    setWorkMinutes(newMin);
    updateWorkDuration(newMin);
  };

  const handleBreakMinutesChange = (newMin: number) => {
    setBreakMinutes(newMin);
    updateBreakDuration(newMin);
  };

  return (
    <div className="space-y-6 text-center max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      <PomodoroSettings
        workMinutes={workMinutes}
        breakMinutes={breakMinutes}
        onWorkMinutesChange={handleWorkMinutesChange}
        onBreakMinutesChange={handleBreakMinutesChange}
      />

      <h2 className="text-3xl font-bold">
        {mode === 'work' ? '🧠 Tập trung làm việc' : '☕ Nghỉ ngơi'}
      </h2>

      <div className="text-6xl font-mono text-blue-600 dark:text-blue-400">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={isRunning ? pause : start}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
