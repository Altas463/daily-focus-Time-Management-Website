import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Hàm lấy nhãn tuần dạng "Tuần 18/5"
function formatWeekLabel(date: Date) {
  return `Tuần ${date.getDate()}/${date.getMonth() + 1}`;
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

  // Tổng số task hoàn thành
  const completedCount = await prisma.task.count({
    where: {
      userId: user.id,
      completed: true,
    },
  });

  // Lấy ngày hiện tại, xác định ngày bắt đầu tuần (Thứ 2) và tạo mảng tuần
  const now = new Date();

  // Hàm tính ngày đầu tuần (Thứ 2)
  function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // nếu Chủ Nhật (0), trừ 6 ngày, else trừ đi offset đến thứ 2
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const mondayThisWeek = getMonday(now);

  // Tạo mảng 7 tuần gần nhất, mỗi phần tử là {start: Date, end: Date}
  const weeks = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date(mondayThisWeek);
    start.setDate(start.getDate() - i * 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    weeks.push({ start, end });
  }

  // Query đếm số task hoàn thành trong từng tuần
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
