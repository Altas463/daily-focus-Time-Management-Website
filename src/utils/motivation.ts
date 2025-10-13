"use client";

const tips = [
  "Break big goals into the next three actions.",
  "Protect one focus block on your calendar every day.",
  "Small wins compound—record them to keep momentum.",
  "Review what worked yesterday before planning today.",
  "Close distractions for 25 minutes; reward yourself after.",
] as const;

function hashSeed(input: number): number {
  const x = Math.sin(input) * 10000;
  return x - Math.floor(x);
}

export function getMotivationTip(seed: number = Date.now()): string {
  if (!Number.isFinite(seed)) return tips[0];
  const index = Math.floor(hashSeed(seed) * tips.length) % tips.length;
  return tips[Math.abs(index)];
}
