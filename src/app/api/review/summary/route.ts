import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type DailyAggregate = {
  focusSeconds: number;
  pomodoros: number;
  completedCount: number;
};

const DAYS_IN_WINDOW = 7;

const startOfDay = (value: Date) => {
  const dt = new Date(value);
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const isoDateKey = (value: Date) => startOfDay(value).toISOString().slice(0, 10);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = new Date();
  const todayStart = startOfDay(today);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const windowStart = new Date(todayStart);
  windowStart.setDate(windowStart.getDate() - (DAYS_IN_WINDOW - 1));

  const [completedToday, weeklyCompletedTasks, focusSessions] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: user.id,
        completed: true,
        updatedAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        updatedAt: true,
      },
    }),
    prisma.task.findMany({
      where: {
        userId: user.id,
        completed: true,
        updatedAt: {
          gte: windowStart,
          lt: tomorrowStart,
        },
      },
      select: {
        id: true,
        updatedAt: true,
      },
    }),
    prisma.pomodoroSession.findMany({
      where: {
        userId: user.id,
        isBreak: false,
        startTime: {
          gte: windowStart,
          lt: tomorrowStart,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    }),
  ]);

  const aggregates = new Map<string, DailyAggregate>();

  for (let i = 0; i < DAYS_IN_WINDOW; i += 1) {
    const cursor = new Date(windowStart);
    cursor.setDate(windowStart.getDate() + i);
    const key = isoDateKey(cursor);
    aggregates.set(key, { focusSeconds: 0, pomodoros: 0, completedCount: 0 });
  }

  for (const task of weeklyCompletedTasks) {
    const key = isoDateKey(task.updatedAt);
    const bucket = aggregates.get(key);
    if (bucket) {
      bucket.completedCount += 1;
    }
  }

  for (const session of focusSessions) {
    const key = isoDateKey(session.startTime);
    const bucket = aggregates.get(key);
    if (bucket) {
      const start = session.startTime.getTime();
      const end = session.endTime.getTime();
      const durationSeconds = Math.max(0, Math.floor((end - start) / 1000));
      bucket.focusSeconds += durationSeconds;
      bucket.pomodoros += 1;
    }
  }

  const todayKey = isoDateKey(todayStart);
  const todayAggregate = aggregates.get(todayKey) ?? { focusSeconds: 0, pomodoros: 0, completedCount: 0 };

  const weeklySeries = Array.from(aggregates.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([date, stats]) => ({
      date,
      focusSeconds: stats.focusSeconds,
      focusMinutes: Math.round(stats.focusSeconds / 60),
      pomodoros: stats.pomodoros,
      completedCount: stats.completedCount,
    }));

  return NextResponse.json({
    date: todayKey,
    completedToday,
    completedTodayCount: completedToday.length,
    focusTodaySeconds: todayAggregate.focusSeconds,
    focusTodayPomodoros: todayAggregate.pomodoros,
    weeklySeries,
  });
}
