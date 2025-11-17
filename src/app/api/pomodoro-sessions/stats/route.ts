import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user.email;

  // Get the start and end of today
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  try {
    const sessions = await prisma.pomodoroSession.findMany({
      where: {
        user: { email: userEmail },
        isBreak: false,
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
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
    console.error('Error querying Pomodoro summary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
