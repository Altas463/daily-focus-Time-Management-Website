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
  const size = focusMode ? 320 : 240;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - progressPercent) / 100) * circumference;

  const primaryColor = mode === "work" ? "var(--primary)" : "#f59e0b"; // Blue or Amber


  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Mode indicator */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-sm flex items-center justify-center border ${
              mode === "work" ? "bg-primary/10 border-primary text-primary" : "bg-amber-500/10 border-amber-500 text-amber-500"
            }`}
          >
            {mode === "work" ? (
              <Brain className="w-4 h-4" />
            ) : (
              <Coffee className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="font-mono font-bold text-sm text-slate-900 uppercase tracking-wider">
              {mode === "work" ? "Focus Session" : "Break Time"}
            </p>
            <p className="text-[10px] font-mono text-slate-500">
              {mode === "work" ? `TARGET: ${workMinutes} MIN` : `DURATION: ${breakMinutes} MIN`}
            </p>
          </div>
        </div>

        {!focusMode && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-200 border ${
              showSettings 
                ? "bg-slate-100 text-slate-900 border-slate-300" 
                : "bg-surface-base text-slate-400 border-border-subtle hover:border-primary hover:text-primary"
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

      {/* Timer Display */}
      <div className="relative flex items-center justify-center py-8">
        {/* SVG Circle */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            className="w-full h-full -rotate-90"
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--border-subtle)"
              strokeWidth={1}
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
              strokeLinecap="square"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-bold text-7xl tracking-tighter text-slate-900">
              {formatTime(secondsLeft)}
            </span>
            
            <div className="flex items-center gap-2 mt-4">
               <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
               <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                 {isRunning ? "Running" : "Paused"}
               </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={isRunning ? pause : start}
          className="btn-tech-primary flex items-center justify-center gap-2 py-3"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "PAUSE" : "START_FOCUS"}
        </button>

        <button
          onClick={reset}
          className="btn-tech-secondary flex items-center justify-center gap-2 py-3"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>
      </div>
    </div>
  );
}
