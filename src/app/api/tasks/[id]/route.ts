import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT: Cập nhật toàn bộ task
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();
  const { title, description, startDate, endDate, completed } = body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        completed,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Update failed", details: error }, { status: 500 });
  }
}

// PATCH: Cập nhật một phần, ví dụ completed
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await req.json();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...("completed" in body && { completed: body.completed }),
        // nếu muốn hỗ trợ patch nhiều field khác thì thêm ở đây
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Patch failed", details: error }, { status: 500 });
  }
}

// DELETE: Xoá một task
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed", details: error }, { status: 500 });
  }
}
