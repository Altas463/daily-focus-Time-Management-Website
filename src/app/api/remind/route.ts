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
       // Check if email and endDate exist before sending mail
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
      message: `Sent ${sent} reminder emails.`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
