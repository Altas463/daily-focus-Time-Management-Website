'use client';

import { useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays } from '@/utils/date';
import { readFromStorage, writeToStorage } from '@/utils/storage';

const STORAGE_KEYS = {
  lastVisit: 'df_last_visit',
  streak: 'df_focus_streak',
};

const today = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export function useDailyStreak() {
  const [lastVisit, setLastVisit] = useState<Date>(() => {
    const stored = readFromStorage<Date | null>(
      STORAGE_KEYS.lastVisit,
      null,
      (value) => new Date(value)
    );
    return stored ?? today();
  });
  const [streak, setStreak] = useState<number>(() =>
    readFromStorage<number>(STORAGE_KEYS.streak, 1, Number)
  );

  useEffect(() => {
    const current = today();
    const diff = differenceInCalendarDays(current, lastVisit);

    if (diff === 0) {
      // same day – nothing to do
      return;
    }

    const nextStreak = diff === 1 ? streak + 1 : 1;
    setStreak(nextStreak);
    setLastVisit(current);

    writeToStorage(STORAGE_KEYS.streak, nextStreak);
    writeToStorage(STORAGE_KEYS.lastVisit, current.toISOString());
  }, [lastVisit, streak]);

  const memoisedLastVisit = useMemo(() => lastVisit, [lastVisit]);

  const resetStreak = () => {
    const current = today();
    setStreak(1);
    setLastVisit(current);
    writeToStorage(STORAGE_KEYS.streak, 1);
    writeToStorage(STORAGE_KEYS.lastVisit, current.toISOString());
  };

  return { streak, lastVisit: memoisedLastVisit, resetStreak };
}
