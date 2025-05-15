'use client';

import { useState, useEffect } from 'react';
import BackToDashboardLink from '@/components/BackToDashboardLink';

const WORK_DURATION = 25 * 60; // 25 phút
const BREAK_DURATION = 5 * 60; // 5 phút

export default function PomodoroPage() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          setIsWorkTime((prevWork) => !prevWork);
          return isWorkTime ? BREAK_DURATION : WORK_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isWorkTime]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secs % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="space-y-4">
      <BackToDashboardLink />

      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        🧠 {isWorkTime ? 'Thời gian làm việc' : 'Nghỉ ngơi'}
      </h2>

      <div className="text-6xl font-mono text-blue-600 dark:text-blue-400">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {isRunning ? 'Tạm dừng' : 'Bắt đầu'}
        </button>
        <button
          onClick={() => {
            setSecondsLeft(isWorkTime ? WORK_DURATION : BREAK_DURATION);
            setIsRunning(false);
          }}
          className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
