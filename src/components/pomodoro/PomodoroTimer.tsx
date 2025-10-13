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
  focusMode = false,
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

  useEffect(() => {
    if (!isRunning || !onTick) return;
    if (secondsLeft % 60 === 0) {
      onTick(Math.floor(secondsLeft / 60), mode);
    }
  }, [secondsLeft, mode, isRunning, onTick]);

  const [previousMode, setPreviousMode] = useState(mode);
  useEffect(() => {
    if (previousMode !== mode && !isRunning) {
      onPomodoroComplete?.();
    }
    setPreviousMode(mode);
  }, [mode, isRunning, previousMode, onPomodoroComplete]);

  const handleWorkMinutesChange = (value: number) => {
    setWorkMinutes(value);
    updateWorkDuration(value);
  };

  const handleBreakMinutesChange = (value: number) => {
    setBreakMinutes(value);
    updateBreakDuration(value);
  };

  const totalSeconds = mode === "work" ? workMinutes * 60 : breakMinutes * 60;
  const progressPercent = totalSeconds === 0 ? 0 : ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const containerClasses = focusMode
    ? "flex w-full max-w-xl flex-col items-center gap-8"
    : "mx-auto flex w-full max-w-lg flex-col items-center gap-8";

  const modeCardClasses = focusMode
    ? "inline-flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-6 py-3 text-white"
    : "inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-6 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  const headerTextClasses = focusMode ? "text-2xl font-semibold" : "text-lg font-semibold";

  return (
    <div className={containerClasses}>
      {!focusMode && (
        <PomodoroSettings
          workMinutes={workMinutes}
          breakMinutes={breakMinutes}
          onWorkMinutesChange={handleWorkMinutesChange}
          onBreakMinutesChange={handleBreakMinutesChange}
        />
      )}

      <div className="text-center">
        <div className={modeCardClasses}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white ${
              mode === "work" ? "bg-green-500" : "bg-yellow-500"
            }`}
          >
            {mode === "work" ? "W" : "B"}
          </div>
          <div className="text-left">
            <p className={headerTextClasses}>{mode === "work" ? "Tap trung" : "Nghi ngoi"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mode === "work"
                ? "Hoan thanh tung muc tieu nho trong 25 phut."
                : "Thu gian 5 phut de nap lai nang luong."}
            </p>
          </div>
        </div>
      </div>

      <div className={`w-full ${focusMode ? "max-w-xl" : "max-w-sm"}`}>
        <div className="relative mx-auto mb-6 h-56 w-56 sm:h-64 sm:w-64">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 120 120"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.floor(progressPercent)}
            aria-label="Progress timer"
          >
            <circle cx="60" cy="60" r="54" stroke="#E2E8F0" strokeWidth="8" fill="none" className="dark:stroke-gray-600" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={mode === "work" ? "#2563EB" : "#F59E0B"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={((100 - progressPercent) / 100) * 2 * Math.PI * 54}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-4xl font-bold text-gray-900 dark:text-white">{formatTime(secondsLeft)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{Math.floor(progressPercent)}% hoan thanh</span>
          </div>
        </div>
      </div>

      <div className={`flex w-full gap-4 ${focusMode ? "max-w-md" : "max-w-sm"}`}>
        <button
          onClick={isRunning ? pause : start}
          className={`inline-flex flex-1 items-center justify-center gap-3 rounded-lg px-6 py-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            focusMode ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label={isRunning ? "Tam dung hen gio" : "Bat dau hen gio"}
        >
          <span className="text-xl">{isRunning ? "||" : ">"}</span>
          <span>{isRunning ? "Tam dung" : "Bat dau"}</span>
        </button>

        <button
          onClick={reset}
          className={`inline-flex flex-1 items-center justify-center gap-3 rounded-lg border px-6 py-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-300 ${
            focusMode
              ? "border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-label="Dat lai hen gio"
        >
          <span className="text-xl">R</span>
          <span>Reset</span>
        </button>
      </div>

      {!focusMode && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            <span
              className={`h-2 w-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span>
              {isRunning ? "Dang chay" : "Da dung"} � {mode === "work" ? `${workMinutes} phut lam viec` : `${breakMinutes} phut nghi`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
