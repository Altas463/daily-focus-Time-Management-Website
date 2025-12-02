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
  const strokeWidth = focusMode ? 10 : 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - progressPercent) / 100) * circumference;

  const primaryColor = mode === "work" ? "#6366f1" : "#f59e0b";
  const secondaryColor = mode === "work" ? "rgba(99, 102, 241, 0.15)" : "rgba(245, 158, 11, 0.15)";

  return (
    <div className={`flex flex-col items-center ${focusMode ? "gap-10" : "gap-6"}`}>
      {/* Mode indicator */}
      <div className="flex items-center gap-3">
        <motion.div
          key={mode}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3 px-4 py-2 rounded-full"
          style={{
            background: secondaryColor,
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: primaryColor }}
          >
            {mode === "work" ? (
              <Brain className="w-4 h-4 text-white" />
            ) : (
              <Coffee className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <p
              className={`font-semibold ${focusMode ? "text-white" : ""}`}
              style={{ color: focusMode ? "white" : "var(--text-primary)" }}
            >
              {mode === "work" ? "Focus Time" : "Break Time"}
            </p>
            <p
              className="text-xs"
              style={{ color: focusMode ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
            >
              {mode === "work" ? `${workMinutes} min session` : `${breakMinutes} min break`}
            </p>
          </div>
        </motion.div>

        {!focusMode && (
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: showSettings ? "var(--primary-muted)" : "var(--surface-secondary)",
              color: showSettings ? "var(--primary)" : "var(--text-muted)",
            }}
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
        {/* Glow effect */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
              filter: "blur(20px)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

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
            stroke={focusMode ? "rgba(255,255,255,0.1)" : "var(--border)"}
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
            style={{
              filter: isRunning ? `drop-shadow(0 0 8px ${primaryColor})` : "none",
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={secondsLeft}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className={`font-mono font-bold tracking-tight ${
              focusMode ? "text-5xl text-white" : "text-4xl"
            }`}
            style={{ color: focusMode ? "white" : "var(--text-primary)" }}
          >
            {formatTime(secondsLeft)}
          </motion.span>

          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isRunning ? "animate-pulse" : ""}`}
              style={{ background: isRunning ? "#22c55e" : "var(--text-muted)" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: focusMode ? "rgba(255,255,255,0.6)" : "var(--text-muted)" }}
            >
              {isRunning ? "In progress" : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Progress text */}
      <div
        className="text-sm font-medium"
        style={{ color: focusMode ? "rgba(255,255,255,0.7)" : "var(--text-secondary)" }}
      >
        {Math.floor(progressPercent)}% complete
      </div>

      {/* Control buttons */}
      <div className={`flex gap-3 ${focusMode ? "w-full max-w-md" : "w-full"}`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isRunning ? pause : start}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200"
          style={{
            background: focusMode ? "white" : "var(--primary)",
            color: focusMode ? "#1e1e1e" : "white",
          }}
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
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200"
          style={{
            background: focusMode ? "rgba(255,255,255,0.1)" : "var(--surface-secondary)",
            color: focusMode ? "white" : "var(--text-secondary)",
            border: focusMode ? "1px solid rgba(255,255,255,0.2)" : "1px solid var(--border)",
          }}
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </motion.button>
      </div>

      {/* Status indicator */}
      {!focusMode && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
          style={{
            background: "var(--surface-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <span
            className={`w-2 h-2 rounded-full ${isRunning ? "animate-pulse" : ""}`}
            style={{ background: isRunning ? "#22c55e" : "var(--text-muted)" }}
          />
          <span style={{ color: "var(--text-secondary)" }}>
            {isRunning ? "Timer running" : "Timer paused"}
          </span>
        </div>
      )}
    </div>
  );
}
