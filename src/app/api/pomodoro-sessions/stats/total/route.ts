import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: user.id,
        isBreak: false,
      },
    });

    const totalPomodoros = sessions.length;

    const totalFocusSeconds = sessions.reduce((acc, session) => {
      const start = new Date(session.startTime).getTime();
      const end = new Date(session.endTime).getTime();
      const durationSeconds = Math.floor((end - start) / 1000);
      return acc + durationSeconds;
    }, 0);

    return NextResponse.json({
      totalPomodoros,
      totalFocusSeconds,
    });
  } catch (error) {
    console.error("Error fetching pomodoro stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
