// app/api/pomodoro-sessions/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { startTime, endTime, isBreak } = await req.json();

  const newSession = await prisma.pomodoroSession.create({
    data: {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isBreak,
      user: { connect: { email: session.user.email! } },
    },
  });

  return NextResponse.json(newSession, { status: 201 });
}


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessions = await prisma.pomodoroSession.findMany({
    where: {
      user: { email: session.user.email! },
      isBreak: false,
    },
  });

  const totalSessions = sessions.length;

  const totalWorkDurationMs = sessions.reduce((acc, session) => {
    const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
    return acc + duration;
  }, 0);

  const totalWorkMinutes = Math.floor(totalWorkDurationMs / 1000 / 60);

  return NextResponse.json({ totalSessions, totalWorkMinutes });
}