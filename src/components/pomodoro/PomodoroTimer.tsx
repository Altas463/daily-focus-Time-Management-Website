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
      className={`flex flex-col items-center justify-center select-none transition-all duration-500 ${
        focusMode
          ? "w-full h-full text-white"
          : "max-w-lg w-full mx-auto"
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

      {/* Mode Title */}
      <div className={`text-center mb-8 ${focusMode ? 'mb-12' : ''}`}>
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-4 transition-all duration-500 ${
          focusMode 
            ? 'bg-white/10 backdrop-blur-xl border border-white/20' 
            : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-xl border border-white/20 dark:border-gray-600/50 shadow-lg'
        }`}>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 ${
            mode === "work"
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500'
          }`}>
            <span className="text-white text-lg">
              {mode === "work" ? "🧠" : "☕"}
            </span>
          </div>
          <h2 className={`font-bold transition-colors duration-500 ${
            focusMode ? 'text-2xl sm:text-3xl' : 'text-xl'
          } ${
            mode === "work"
              ? focusMode
                ? "text-green-300"
                : "text-green-700 dark:text-green-400"
              : focusMode
              ? "text-yellow-300"
              : "text-yellow-600 dark:text-yellow-400"
          }`}>
            {mode === "work" ? "Tập trung làm việc" : "Nghỉ ngơi"}
          </h2>
        </div>
        
        {focusMode && (
          <p className="text-gray-300 text-sm opacity-80">
            {mode === "work" 
              ? "Hãy tập trung hoàn toàn vào nhiệm vụ hiện tại" 
              : "Thời gian nghỉ ngơi và nạp lại năng lượng"
            }
          </p>
        )}
      </div>

      {/* Timer Display */}
      {focusMode ? (
        <div className="flex flex-col items-center">
          {/* Large Timer Display */}
          <div className="relative mb-8">
            <div
              className="font-mono select-none text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none tracking-wider font-bold text-center drop-shadow-2xl transition-all duration-500"
              aria-live="polite"
              aria-atomic="true"
              style={{
                textShadow: '0 0 50px rgba(255, 255, 255, 0.3)',
              }}
            >
              {formatTime(secondsLeft)}
            </div>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 font-mono text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none tracking-wider font-bold text-center opacity-20 blur-sm -z-10">
              {formatTime(secondsLeft)}
            </div>
          </div>

          {/* Progress Ring */}
          <div className="relative">
            <svg
              className="w-72 h-72 transform -rotate-90 drop-shadow-2xl"
              viewBox="0 0 120 120"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.floor(progressPercent)}
              aria-label="Progress timer"
            >
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={mode === "work" ? "#10B981" : "#F59E0B"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={
                  ((100 - progressPercent) / 100) * 2 * Math.PI * 54
                }
                strokeLinecap="round"
                style={{ 
                  transition: "stroke-dashoffset 1s ease-out",
                  filter: `drop-shadow(0 0 10px ${mode === "work" ? "#10B981" : "#F59E0B"}40)`
                }}
              />
            </svg>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-white/80">
                {Math.floor(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Compact Timer Display */}
          <div className="relative w-56 h-56 mx-auto mb-8">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.floor(progressPercent)}
              aria-label="Progress timer"
            >
              {/* Background ring */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="rgb(226 232 240)"
                className="dark:stroke-gray-600"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress ring */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke={mode === "work" ? "#3B82F6" : "#F59E0B"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={
                  ((100 - progressPercent) / 100) * 2 * Math.PI * 54
                }
                strokeLinecap="round"
                style={{ 
                  transition: "stroke-dashoffset 0.8s ease-out",
                  filter: `drop-shadow(0 2px 8px ${mode === "work" ? "#3B82F6" : "#F59E0B"}30)`
                }}
              />
            </svg>

            {/* Timer text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-4xl font-bold text-gray-900 dark:text-white drop-shadow-lg mb-1">
                {formatTime(secondsLeft)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {Math.floor(progressPercent)}% complete
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className={`flex gap-4 justify-center w-full ${focusMode ? 'max-w-md' : 'max-w-sm'} mx-auto`}>
        <button
          onClick={isRunning ? pause : start}
          className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            focusMode
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl shadow-green-500/30"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
          } flex-1 flex items-center justify-center gap-3 min-h-[56px]`}
          aria-label={isRunning ? "Tạm dừng hẹn giờ" : "Bắt đầu hẹn giờ"}
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <span className="relative z-10 text-xl">
            {isRunning ? "⏸" : "▶"}
          </span>
          <span className="relative z-10 font-bold">
            {isRunning ? "Tạm dừng" : "Bắt đầu"}
          </span>
        </button>

        <button
          onClick={reset}
          className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
            focusMode
              ? "bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-xl border border-white/30 shadow-2xl"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-lg"
          } flex-1 flex items-center justify-center gap-3 min-h-[56px]`}
          aria-label="Đặt lại hẹn giờ"
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <span className="relative z-10 text-xl">⟲</span>
          <span className="relative z-10 font-bold">Reset</span>
        </button>
      </div>

      {/* Session Info */}
      {!focusMode && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-600 dark:text-gray-400">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>
              {isRunning ? 'Đang chạy' : 'Đã dừng'} • 
              {mode === 'work' ? ` ${workMinutes} phút làm việc` : ` ${breakMinutes} phút nghỉ`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}