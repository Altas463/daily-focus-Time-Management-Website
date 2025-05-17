// /src/app/api/tasks/stats/route.ts

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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Đếm số task hoàn thành hôm nay
  const completedTodayCount = await prisma.task.count({
    where: {
      userId: user.id,
      completed: true,
      updatedAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  return NextResponse.json({ completedTodayCount });
}
