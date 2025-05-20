// File: src/app/api/tasks/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT: Cập nhật toàn bộ task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
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
    return NextResponse.json({ error: "Update failed", details: `${error}` }, { status: 500 });
  }
}

// PATCH: Cập nhật một phần
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...("completed" in body && { completed: body.completed }),
        // thêm các field patch khác nếu cần
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Patch failed", details: `${error}` }, { status: 500 });
  }
}

// DELETE: Xoá task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed", details: `${error}` }, { status: 500 });
  }
}
