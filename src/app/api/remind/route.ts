import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendDeadlineReminder } from "@/utils/mailer";
import { format } from "date-fns";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + 60 * 60 * 1000);

    const tasks = await prisma.task.findMany({
      where: {
        completed: false,
        // Dùng tên trường đúng trong schema, nếu vẫn lỗi bạn kiểm tra lại migration
        reminderSent: false,
        endDate: {
          gte: now,
          lte: soon,
        },
      },
      include: {
        user: true,
      },
    });

    let sent = 0;

    for (const task of tasks) {
      // Kiểm tra tồn tại email và endDate trước khi gửi mail
      if (task.user?.email && task.endDate) {
        await sendDeadlineReminder(
          task.user.email,
          task.title,
          format(task.endDate, "dd/MM/yyyy HH:mm")
        );

        await prisma.task.update({
          where: { id: task.id },
          data: { reminderSent: true },
        });

        sent++;
      }
    }

    return NextResponse.json({
      message: `Đã gửi ${sent} email nhắc nhở deadline.`,
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return NextResponse.json({ error: "Lỗi gửi email" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
