'use client';

import { useCallback, useRef } from 'react';

type SpotlightHandlers = {
  stageRef: React.RefObject<HTMLDivElement | null>;
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
};

/**
 * Provides the spotlight hover interaction shared by the auth screens.
 * It keeps the DOM ref encapsulated and memoises the mouse handler so
 * pages can stay declarative.
 */
export function useSpotlightStage(): SpotlightHandlers {
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    el.style.setProperty('--mx', `${x}%`);
    el.style.setProperty('--my', `${y}%`);
  }, []);

  return { stageRef, handleMouseMove };
}
