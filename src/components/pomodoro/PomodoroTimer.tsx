"use client";

import { useEffect, useState } from "react";
import { usePomodoro } from "@/hooks/usePomodoro";
import PomodoroSettings from "./PomodoroSettings";

function formatTime(secs: number) {
  const minutes = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secs % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

type PomodoroTimerProps = {
  focusMode?: boolean;
  onTick?: (minutesLeft: number, mode: "work" | "break") => void;
  onPomodoroComplete?: () => void;
};

export default function PomodoroTimer({
  focusMode,
  onTick,
  onPomodoroComplete,
}: PomodoroTimerProps) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const {
    secondsLeft,
    isRunning,
    mode,
    start,
    pause,
    reset,
    updateWorkDuration,
    updateBreakDuration,
  } = usePomodoro(workMinutes, breakMinutes);

  // Gọi onTick mỗi phút khi secondsLeft chia hết cho 60
  useEffect(() => {
    if (!isRunning || !onTick) return;

    if (secondsLeft % 60 === 0) {
      onTick(Math.floor(secondsLeft / 60), mode);
    }
  }, [secondsLeft, mode, isRunning, onTick]);

  // Gọi onPomodoroComplete khi phiên chuyển từ work -> break hoặc ngược lại
  const [prevMode, setPrevMode] = useState(mode);
  useEffect(() => {
    if (prevMode !== mode && !isRunning) {
      onPomodoroComplete?.();
    }
    setPrevMode(mode);
  }, [mode, isRunning, onPomodoroComplete, prevMode]);

  const handleWorkMinutesChange = (newMin: number) => {
    setWorkMinutes(newMin);
    updateWorkDuration(newMin);
  };

  const handleBreakMinutesChange = (newMin: number) => {
    setBreakMinutes(newMin);
    updateBreakDuration(newMin);
  };

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div
      className={`flex flex-col items-center justify-center select-none rounded-xl shadow-md p-6
      ${
        focusMode
          ? "w-full h-full text-white"
          : "max-w-sm w-full bg-white dark:bg-gray-900 text-black dark:text-white mx-auto"
      }`}
    >
      {!focusMode && (
        <PomodoroSettings
          workMinutes={workMinutes}
          breakMinutes={breakMinutes}
          onWorkMinutesChange={handleWorkMinutesChange}
          onBreakMinutesChange={handleBreakMinutesChange}
        />
      )}

      <h2
        className={`text-3xl font-semibold mb-5 select-none ${
          mode === "work"
            ? focusMode
              ? "text-green-400"
              : "text-green-700"
            : focusMode
            ? "text-yellow-400"
            : "text-yellow-500"
        }`}
      >
        {mode === "work" ? "🧠 Tập trung làm việc" : "☕ Nghỉ ngơi"}
      </h2>

      {focusMode ? (
        <>
          <div
            className="font-mono select-none text-[12rem] leading-none tracking-wide"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(secondsLeft)}
          </div>

          <svg
            className="w-64 h-64 mt-6"
            viewBox="0 0 120 120"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progressPercent)}
            aria-label="Progress timer"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="#374151"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={mode === "work" ? "#10B981" : "#FBBF24"}
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={
                ((100 - progressPercent) / 100) * 2 * Math.PI * 54
              }
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
        </>
      ) : (
        <div className="relative w-48 h-48 my-6 mx-auto">
          <svg
            className="w-full h-full"
            viewBox="0 0 120 120"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progressPercent)}
            aria-label="Progress timer"
          >
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="#e0e7ff"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={mode === "work" ? "#2563eb" : "#fbbf24"}
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={
                ((100 - progressPercent) / 100) * 2 * Math.PI * 54
              }
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
            {formatTime(secondsLeft)}
          </div>
        </div>
      )}

      <div className={`flex gap-6 mt-8 justify-center w-full max-w-xs mx-auto`}>
        <button
          onClick={isRunning ? pause : start}
          className={`px-6 py-3 rounded-full font-semibold shadow-md transition
            ${
              focusMode
                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-700/50"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
            inline-flex items-center justify-center
            w-[140px] text-center
            whitespace-nowrap
          `}
          aria-label={isRunning ? "Tạm dừng hẹn giờ" : "Bắt đầu hẹn giờ"}
        >
          {isRunning ? (
            <>
              <span className="mr-2 text-lg">⏸</span> Tạm dừng
            </>
          ) : (
            <>
              <span className="mr-2 text-lg">▶</span> Bắt đầu
            </>
          )}
        </button>

        <button
          onClick={reset}
          className={`px-12 py-3 rounded-full font-semibold shadow-md transition
            ${
              focusMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-200 shadow-gray-900/50"
                : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
            }
            min-w-[140px]
            flex items-center justify-center
          `}
          aria-label="Đặt lại hẹn giờ"
        >
          ⟲ Reset
        </button>
      </div>
    </div>
  );
}
