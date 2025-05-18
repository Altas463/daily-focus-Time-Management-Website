import BackToDashboardLink from '@/components/BackToDashboardLink';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Nút thoát nhỏ gọn góc trên trái */}
      <div className="absolute top-4 left-4">
        <BackToDashboardLink />
      </div>
      <PomodoroTimer focusMode />
    </div>
  );
}
