// src/components/PomodoroSettings.tsx
'use client';

interface PomodoroSettingsProps {
  workMinutes: number;
  breakMinutes: number;
  onWorkMinutesChange: (newMinutes: number) => void;
  onBreakMinutesChange: (newMinutes: number) => void;
}

export default function PomodoroSettings({
  workMinutes,
  breakMinutes,
  onWorkMinutesChange,
  onBreakMinutesChange,
}: PomodoroSettingsProps) {
  return (
    <div className="flex gap-6 justify-center items-center">
      <label>
        Thời gian làm việc (phút):
        <input
          type="number"
          min={1}
          max={120}
          value={workMinutes}
          onChange={(e) => onWorkMinutesChange(Number(e.target.value))}
          className="ml-2 w-16 rounded border px-2 py-1 text-center"
        />
      </label>

      <label>
        Thời gian nghỉ (phút):
        <input
          type="number"
          min={1}
          max={60}
          value={breakMinutes}
          onChange={(e) => onBreakMinutesChange(Number(e.target.value))}
          className="ml-2 w-16 rounded border px-2 py-1 text-center"
        />
      </label>
    </div>
  );
}
