'use client';

import { useState } from 'react';
import { usePomodoro } from '@/hooks/usePomodoro';
import PomodoroSettings from './PomodoroSettings';

function formatTime(secs: number) {
  const minutes = Math.floor(secs / 60).toString().padStart(2, '0');
  const seconds = (secs % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function PomodoroTimer({ focusMode }: { focusMode?: boolean }) {
  // Khởi tạo với 25 phút work, 5 phút break mặc định
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

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

  const totalSeconds = mode === 'work' ? workMinutes * 60 : breakMinutes * 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        focusMode
          ? 'w-full h-full text-white'
          : 'max-w-md p-4 bg-white dark:bg-gray-800 rounded shadow mx-auto text-black dark:text-white'
      }`}
    >
      {!focusMode && (
        <PomodoroSettings
          workMinutes={workMinutes}
          breakMinutes={breakMinutes}
          onWorkMinutesChange={handleWorkMinutesChange}
          onBreakMinutesChange={handleBreakMinutesChange}
        />
      )}

      <h2
        className={`text-4xl font-extrabold mb-4 select-none ${
          mode === 'work'
            ? focusMode
              ? 'text-green-400'
              : 'text-green-600'
            : focusMode
            ? 'text-yellow-400'
            : 'text-yellow-600'
        }`}
      >
        {mode === 'work' ? '🧠 Tập trung làm việc' : '☕ Nghỉ ngơi'}
      </h2>

      <div
        className={`font-mono select-none ${
          focusMode ? 'text-[12rem] leading-[1] tracking-wide' : 'text-6xl'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(secondsLeft)}
      </div>

      {focusMode && (
        <svg
          className="w-64 h-64 mt-6"
          viewBox="0 0 120 120"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.floor(progressPercent)}
          aria-label="Progress timer"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="#374151"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke={mode === 'work' ? '#10B981' : '#FBBF24'}
            strokeWidth="12"
            fill="none"
            strokeDasharray={2 * Math.PI * 54}
            strokeDashoffset={
              ((100 - progressPercent) / 100) * 2 * Math.PI * 54
            }
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      )}

      <div className={`flex gap-8 mt-8 ${focusMode ? 'justify-center' : ''}`}>
        <button
          onClick={isRunning ? pause : start}
          className={`px-10 py-4 rounded-full font-semibold transition
            ${
              focusMode
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-700/50'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          aria-label={isRunning ? 'Tạm dừng hẹn giờ' : 'Bắt đầu hẹn giờ'}
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>

        <button
          onClick={reset}
          className={`px-10 py-4 rounded-full font-semibold transition
            ${
              focusMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-lg shadow-gray-900/50'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          aria-label="Đặt lại hẹn giờ"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
