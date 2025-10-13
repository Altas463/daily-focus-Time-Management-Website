export function getPomodoroProgress(totalSessions: number, weeklyGoal = 20) {
  const progress = Math.min((totalSessions / weeklyGoal) * 100, 100);
  const remaining = Math.max(weeklyGoal - totalSessions, 0);
  return { progress, remaining };
}

export function getFocusTimeProgress(
  focusMinutes: number,
  weeklyGoalMinutes = 480
) {
  const progress = Math.min((focusMinutes / weeklyGoalMinutes) * 100, 100);
  const remaining = Math.max(weeklyGoalMinutes - focusMinutes, 0);
  return { progress, remaining };
}
