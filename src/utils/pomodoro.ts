import { clamp } from "./format";

export function getPomodoroProgress(totalSessions: number, weeklyGoal = 20) {
  const goal = weeklyGoal > 0 ? weeklyGoal : 1;
  const progress = clamp((totalSessions / goal) * 100, 0, 100);
  const remaining = Math.max(goal - totalSessions, 0);
  return { progress, remaining };
}

export function getFocusTimeProgress(
  focusMinutes: number,
  weeklyGoalMinutes = 480
) {
  const goal = weeklyGoalMinutes > 0 ? weeklyGoalMinutes : 1;
  const progress = clamp((focusMinutes / goal) * 100, 0, 100);
  const remaining = Math.max(goal - focusMinutes, 0);
  return { progress, remaining };
}
