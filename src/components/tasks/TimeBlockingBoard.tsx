"use client";

import { useMemo, useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { CalendarPlus, Clock3, Download, Trash2 } from "lucide-react";
import { addMinutes } from "date-fns";
import type { Task } from "@/types";

export type TimeBlockDuration = 30 | 60 | 90;

export type TimeBlockDefinition = {
  id: string;
  startHour: number;
  startMinute: number;
  duration: TimeBlockDuration;
  label: string;
  windowLabel: string;
};

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;
const SUPPORTED_DURATIONS: TimeBlockDuration[] = [30, 60, 90];

const pad = (value: number) => value.toString().padStart(2, "0");

const formatWindowLabel = (hour: number, minute: number, duration: TimeBlockDuration) => {
  const start = new Date();
  start.setHours(hour, minute, 0, 0);
  const end = addMinutes(start, duration);

  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return formatter.format(start) + " - " + formatter.format(end);
};

const buildTimeBlocks = () => {
  const items: TimeBlockDefinition[] = [];
  for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour += 1) {
    for (const duration of SUPPORTED_DURATIONS) {
      const id = `h${pad(hour)}m00-d${duration}`;
      const windowLabel = formatWindowLabel(hour, 0, duration);
      items.push({
        id,
        startHour: hour,
        startMinute: 0,
        duration,
        windowLabel,
        label: windowLabel + " - " + duration + "m",
      });
    }
  }
  return items;
};

export const TIME_BLOCKS: TimeBlockDefinition[] = buildTimeBlocks();

export const findTimeBlockById = (id: string) => TIME_BLOCKS.find((block) => block.id === id);

export const buildBlockAssignments = (tasks: Task[], date: string) => {
  const map: Record<string, Task> = {};

  if (!date) return map;

  for (const task of tasks) {
    if (!task.startDate || !task.endDate) continue;

    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;

    const dayKey = start.toISOString().slice(0, 10);
    if (dayKey !== date) continue;

    const duration = Math.round((end.getTime() - start.getTime()) / 60000);
    if (!SUPPORTED_DURATIONS.includes(duration as TimeBlockDuration)) continue;

    const block = TIME_BLOCKS.find(
      (candidate) =>
        candidate.startHour === start.getHours() &&
        candidate.startMinute === start.getMinutes() &&
        candidate.duration === duration,
    );

    if (block) {
      map[block.id] = task;
    }
  }

  return map;
};

type TimeBlockingBoardProps = {
  selectedDate: string;
  onSelectedDateChange: (value: string) => void;
  assignments: Record<string, Task>;
  onClearAssignment: (taskId: string) => Promise<void>;
  pendingBlockId?: string | null;
  statusMessage?: { type: "success" | "error"; text: string } | null;
  onDismissStatus?: () => void;
};

const TimeBlockingBoard = ({
  selectedDate,
  onSelectedDateChange,
  assignments,
  onClearAssignment,
  pendingBlockId,
  statusMessage,
  onDismissStatus,
}: TimeBlockingBoardProps) => {
  const [downloading, setDownloading] = useState(false);

  const blocksByHour = useMemo(() => {
    const grouped = new Map<number, TimeBlockDefinition[]>();
    for (const block of TIME_BLOCKS) {
      const bucket = grouped.get(block.startHour);
      if (bucket) {
        bucket.push(block);
      } else {
        grouped.set(block.startHour, [block]);
      }
    }
    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([hour, blocks]) => ({
        hour,
        hourLabel: `${pad(hour)}:00`,
        blocks,
      }));
  }, []);

  const assignedList = useMemo(() => Object.entries(assignments), [assignments]);

  const totalMinutes = useMemo(
    () =>
      assignedList.reduce((acc, [blockId]) => {
        const block = findTimeBlockById(blockId);
        return block ? acc + block.duration : acc;
      }, 0),
    [assignedList],
  );

  const scheduledTasks = useMemo(() => assignedList.map(([, task]) => task), [assignedList]);

  const downloadIcs = async () => {
    if (!selectedDate) return;
    if (scheduledTasks.length === 0) return;
    setDownloading(true);

    try {
      const dtStamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const events = scheduledTasks
        .map((task) => {
          if (!task.startDate || !task.endDate) return null;
          const startIso = new Date(task.startDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          const endIso = new Date(task.endDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
          const uid = `${task.id}@daily-focus`;
          const summary = task.title.replace(/\r?\n/g, " ");
          const description = (task.description ?? "").replace(/\r?\n/g, "\\n");
          return [
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}`,
            `DTSTART:${startIso}`,
            `DTEND:${endIso}`,
            `SUMMARY:${summary}`,
            description ? `DESCRIPTION:${description}` : null,
            "END:VEVENT",
          ]
            .filter(Boolean)
            .join("\r\n");
        })
        .filter((event): event is string => Boolean(event));

      if (events.length === 0) {
        setDownloading(false);
        return;
      }

      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Daily Focus//Time Blocking//EN", ...events, "END:VCALENDAR"].join(
        "\r\n",
      );

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `daily-focus-${selectedDate}.ics`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="bento-card mt-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CalendarPlus className="h-4 w-4 text-primary" aria-hidden />
            <span className="label-tech">TIME BLOCKING</span>
          </div>
          <p className="text-sm text-slate-500 font-mono">
            Drag tasks into blocks to schedule deep work sessions.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-sm border border-border-subtle bg-surface-base px-3 py-2 text-sm text-slate-700">
            <span className="font-mono font-bold text-xs uppercase text-slate-500">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => onSelectedDateChange(event.target.value)}
              className="border-none bg-transparent text-slate-900 outline-none font-mono text-sm"
            />
          </label>

          <button
            type="button"
            onClick={() => void downloadIcs()}
            disabled={!selectedDate || scheduledTasks.length === 0 || downloading}
            className="btn-tech-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export ICS
          </button>
        </div>
      </header>

      {statusMessage && (
        <div
          className={`flex items-center justify-between rounded-sm border px-4 py-3 text-sm font-mono mb-6 ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <span>{statusMessage.text}</span>
          {onDismissStatus && (
            <button
              type="button"
              onClick={onDismissStatus}
              className="text-xs font-bold uppercase tracking-wider underline-offset-2 hover:underline"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border-subtle bg-surface-base px-4 py-3 text-sm text-slate-700 mb-8">
        <Clock3 className="h-4 w-4 text-slate-400" aria-hidden />
        <span className="font-mono text-xs">
          {scheduledTasks.length > 0
            ? `${scheduledTasks.length} BLOCK${scheduledTasks.length > 1 ? "S" : ""} • ${totalMinutes} MIN SCHEDULED`
            : "NO BLOCKS SCHEDULED"}
        </span>
      </div>

      <div className="space-y-8">
        {blocksByHour.map(({ hourLabel, blocks }) => (
          <div key={hourLabel} className="space-y-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-border-subtle pb-1">
              {hourLabel}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map((block) => {
                const assignedTask = assignments[block.id];
                const isPending = pendingBlockId === block.id;
                return (
                  <Droppable droppableId={`timeblock:${block.id}`} key={block.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={[
                          "relative min-h-[100px] rounded-sm border p-4 transition-all",
                          snapshot.isDraggingOver
                            ? "border-primary bg-primary/5"
                            : assignedTask
                              ? "border-border-subtle bg-white shadow-sm"
                              : "border-dashed border-border-default bg-surface-base hover:border-border-strong",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {block.windowLabel}
                          <span>{block.duration}m</span>
                        </div>

                        <div className="mt-3">
                          {assignedTask ? (
                            <>
                              <p className="text-sm font-bold text-slate-900 line-clamp-2">
                                {assignedTask.title}
                              </p>
                              <button
                                type="button"
                                onClick={() => void onClearAssignment(assignedTask.id)}
                                disabled={isPending}
                                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden />
                                Remove
                              </button>
                            </>
                          ) : (
                            <p className="text-xs text-slate-400 font-mono">
                              Drop task here
                            </p>
                          )}
                        </div>
                        {isPending && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                            Updating...
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimeBlockingBoard;
