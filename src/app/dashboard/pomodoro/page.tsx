import BackToDashboardLink from '@/components/BackToDashboardLink';
import PomodoroTimer from '@/components/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="space-y-4 p-4">
      <BackToDashboardLink />

      <h1 className="text-4xl font-bold mb-6">Pomodoro Timer</h1>

      <PomodoroTimer />
    </div>
  );
}
