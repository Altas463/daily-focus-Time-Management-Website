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
    <div className="mt-4 mb-8 flex flex-wrap items-center justify-center gap-6">
      <div className="flex w-48 flex-col items-center p-5 bg-surface-panel border border-border-default rounded-sm">
        <label htmlFor="work" className="mb-3 text-sm font-mono font-bold text-slate-700 uppercase tracking-wider">
          Focus Duration
        </label>
        <div className="relative w-full">
          <input
            id="work"
            type="number"
            min={1}
            max={120}
            value={workMinutes}
            onChange={(event) => onWorkMinutesChange(Number(event.target.value))}
            className="w-full bg-surface-base border border-border-subtle rounded-sm px-4 py-3 text-center text-xl font-mono font-bold text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 pointer-events-none">
            MIN
          </div>
        </div>
      </div>

      <div className="flex w-48 flex-col items-center p-5 bg-surface-panel border border-border-default rounded-sm">
        <label htmlFor="break" className="mb-3 text-sm font-mono font-bold text-slate-700 uppercase tracking-wider">
          Break Duration
        </label>
        <div className="relative w-full">
          <input
            id="break"
            type="number"
            min={1}
            max={60}
            value={breakMinutes}
            onChange={(event) => onBreakMinutesChange(Number(event.target.value))}
            className="w-full bg-surface-base border border-border-subtle rounded-sm px-4 py-3 text-center text-xl font-mono font-bold text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 pointer-events-none">
            MIN
          </div>
        </div>
      </div>
    </div>
  );
}
