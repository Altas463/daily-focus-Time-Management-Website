// src/hooks/usePomodoro.ts
'use client';
import { useState, useEffect } from 'react';

export type Mode = 'work' | 'break';

export function usePomodoro(
  initialWorkMinutes: number,
  initialBreakMinutes: number
) {
  const [workDuration, setWorkDuration] = useState(initialWorkMinutes * 60);
  const [breakDuration, setBreakDuration] = useState(initialBreakMinutes * 60);

  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>('work');
  const [secondsLeft, setSecondsLeft] = useState(workDuration);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  // Đồng bộ lại secondsLeft khi workDuration hoặc breakDuration thay đổi
  useEffect(() => {
    if (mode === 'work') {
      setSecondsLeft(workDuration);
    } else {
      setSecondsLeft(breakDuration);
    }
  }, [workDuration, breakDuration, mode]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const now = new Date();
          if (sessionStart) {
            saveSession(mode === 'break', sessionStart, now);
          }

          const newMode = mode === 'work' ? 'break' : 'work';
          setMode(newMode);
          setSessionStart(now);

          return newMode === 'work' ? workDuration : breakDuration;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, sessionStart, workDuration, breakDuration]);

  const start = () => {
    setIsRunning(true);
    setSessionStart(new Date());
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'work' ? workDuration : breakDuration);
  };

  // Cập nhật thời gian (phút)
  const updateWorkDuration = (minutes: number) => {
    setWorkDuration(minutes * 60);
  };

  const updateBreakDuration = (minutes: number) => {
    setBreakDuration(minutes * 60);
  };

  return {
    secondsLeft,
    isRunning,
    mode,
    start,
    pause,
    reset,
    updateWorkDuration,
    updateBreakDuration,
    workDuration,
    breakDuration,
  };
}

// Hàm gọi API lưu session (giữ nguyên)
async function saveSession(isBreak: boolean, startTime: Date, endTime: Date) {
  try {
    await fetch('/api/pomodoro-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBreak, startTime, endTime }),
    });
  } catch (error) {
    console.error('Lỗi khi lưu session:', error);
  }
}

