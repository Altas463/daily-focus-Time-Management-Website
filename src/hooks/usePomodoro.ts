// src/hooks/usePomodoro.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

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

  // Trạng thái đã load localStorage
  const [restored, setRestored] = useState(false);

  // Hàm kết thúc phiên, dùng useCallback để không bị lỗi phụ thuộc
  const handleSessionEnd = useCallback(async () => {
    const now = new Date();
    if (sessionStart) {
      await saveSession(mode === 'break', sessionStart, now);
      console.log(`[Pomodoro] Saved ${mode} session: ${sessionStart.toISOString()} → ${now.toISOString()}`);
    }

    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setSessionStart(now);
    setSecondsLeft(nextMode === 'work' ? workDuration : breakDuration);
  }, [mode, sessionStart, workDuration, breakDuration]);

  // Load trạng thái từ localStorage khi mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pomodoroState');
      if (saved) {
        const {
          workDuration: wd,
          breakDuration: bd,
          isRunning: ir,
          mode: m,
          secondsLeft: sl,
          sessionStart: ss,
        } = JSON.parse(saved);

        setWorkDuration(wd);
        setBreakDuration(bd);
        setIsRunning(ir);
        setMode(m);
        setSecondsLeft(sl);
        setSessionStart(ss ? new Date(ss) : null);
      }
    } catch (error) {
      console.error('Failed to restore pomodoro state:', error);
    }
    setRestored(true);
  }, []);

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    if (!restored) return;

    const stateToSave = {
      workDuration,
      breakDuration,
      isRunning,
      mode,
      secondsLeft,
      sessionStart: sessionStart ? sessionStart.toISOString() : null,
    };
    try {
      localStorage.setItem('pomodoroState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save pomodoro state:', error);
    }
  }, [workDuration, breakDuration, isRunning, mode, secondsLeft, sessionStart, restored]);

  // Đồng bộ lại secondsLeft khi duration hoặc mode thay đổi, nhưng không reset khi đang chạy hoặc đã bắt đầu session
  useEffect(() => {
    if (!restored || isRunning || sessionStart) return;

    setSecondsLeft(mode === 'work' ? workDuration : breakDuration);
  }, [workDuration, breakDuration, mode, restored, isRunning, sessionStart]);

  // Xử lý đếm ngược
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSessionEnd(); // kết thúc phiên khi hết giờ
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, handleSessionEnd]);

  const start = () => {
    if (!sessionStart) {
      setSessionStart(new Date());
    }
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(mode === 'work' ? workDuration : breakDuration);
    setSessionStart(null);
  };

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

// ✅ Gửi session dưới dạng ISO string
async function saveSession(isBreak: boolean, startTime: Date, endTime: Date) {
  try {
    await fetch('/api/pomodoro-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isBreak,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }),
    });
  } catch (error) {
    console.error('Lỗi khi lưu session:', error);
  }
}
