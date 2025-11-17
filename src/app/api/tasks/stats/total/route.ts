import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Function to get week label in format "Week 18/5"
function formatWeekLabel(date: Date) {
  return `Week ${date.getDate()}/${date.getMonth() + 1}`;
}

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

  // Total number of completed tasks
  const completedCount = await prisma.task.count({
    where: {
      userId: user.id,
      completed: true,
    },
  });

  // Get current date, determine start of week (Monday) and create array of weeks
  const now = new Date();

  // Function to calculate the Monday of the week
  function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const mondayThisWeek = getMonday(now);

  // Create array of 7 recent weeks, each element is {start: Date, end: Date}
  const weeks = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date(mondayThisWeek);
    start.setDate(start.getDate() - i * 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    weeks.push({ start, end });
  }

  // Query to count completed tasks in each week
  const weeklyCompleted = await Promise.all(
    weeks.map(async ({ start, end }) => {
      const count = await prisma.task.count({
        where: {
          userId: user.id,
          completed: true,
          updatedAt: {
            gte: start,
            lt: end,
          },
        },
      });
      return {
        weekLabel: formatWeekLabel(start),
        completedCount: count,
      };
    })
  );

  return NextResponse.json({
    completedCount,
    weeklyCompleted,
  });
}
