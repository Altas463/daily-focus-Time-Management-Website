"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain, Settings2 } from "lucide-react";
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
  const [showSettings, setShowSettings] = useState(false);

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

  // Circle calculations
  const size = focusMode ? 280 : 200;
  const strokeWidth = focusMode ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - progressPercent) / 100) * circumference;

  const primaryColor = mode === "work" ? "#2563eb" : "#f59e0b"; // Blue-600 or Amber-500
  const secondaryColor = mode === "work" ? "#eff6ff" : "#fffbeb"; // Blue-50 or Amber-50

  return (
    <div className={`flex flex-col items-center ${focusMode ? "gap-10" : "gap-6"}`}>
      {/* Mode indicator */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors"
          style={{
            background: secondaryColor,
            borderColor: mode === "work" ? "#dbeafe" : "#fef3c7",
          }}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: primaryColor }}
          >
            {mode === "work" ? (
              <Brain className="w-4 h-4 text-white" />
            ) : (
              <Coffee className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">
              {mode === "work" ? "Focus Time" : "Break Time"}
            </p>
            <p className="text-xs text-slate-500">
              {mode === "work" ? `${workMinutes} min session` : `${breakMinutes} min break`}
            </p>
          </div>
        </div>

        {!focusMode && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 border ${
              showSettings 
                ? "bg-slate-100 text-slate-900 border-slate-200" 
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
            aria-label="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && !focusMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full overflow-hidden"
          >
            <PomodoroSettings
              workMinutes={workMinutes}
              breakMinutes={breakMinutes}
              onWorkMinutesChange={handleWorkMinutesChange}
              onBreakMinutesChange={handleBreakMinutesChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Circle */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle */}
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.floor(progressPercent)}
          aria-label="Timer progress"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={focusMode ? "rgba(255,255,255,0.1)" : "#e2e8f0"}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-bold tracking-tight ${
              focusMode ? "text-6xl text-white" : "text-5xl text-slate-900"
            }`}
          >
            {formatTime(secondsLeft)}
          </span>

          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}
            />
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: focusMode ? "rgba(255,255,255,0.6)" : "#64748b" }}
            >
              {isRunning ? "Running" : "Paused"}
            </span>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className={`flex gap-3 ${focusMode ? "w-full max-w-md" : "w-full"}`}>
        <button
          onClick={isRunning ? pause : start}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
            focusMode 
              ? "bg-white text-slate-900 hover:bg-slate-100" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
          }`}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start
            </>
          )}
        </button>

        <button
          onClick={reset}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 border ${
            focusMode 
              ? "bg-transparent text-white border-white/20 hover:bg-white/10" 
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          }`}
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>
    </div>
  );
}
