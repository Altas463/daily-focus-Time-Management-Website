import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

// Extract ID from URL by parsing request.url
function extractIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1] || null;
}

// PUT: Update entire task
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = extractIdFromUrl(request);
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  const body = await request.json();
  const { title, description, startDate, endDate, completed } = body as {
    title?: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    completed?: boolean;
  };

  const updateData: Prisma.TaskUpdateInput = {};

  if (typeof title !== "undefined") {
    updateData.title = title;
  }

  if (typeof description !== "undefined") {
    updateData.description = description ?? null;
  }

  if (typeof startDate !== "undefined") {
    if (startDate === null || startDate === "") {
      updateData.startDate = null;
    } else if (typeof startDate === "string") {
      const parsedStart = new Date(startDate);
      if (Number.isNaN(parsedStart.getTime())) {
        return NextResponse.json({ error: "Invalid startDate format" }, { status: 400 });
      }
      updateData.startDate = parsedStart;
    } else {
      return NextResponse.json({ error: "Invalid startDate value" }, { status: 400 });
    }
  }

  if (typeof endDate !== "undefined") {
    if (endDate === null || endDate === "") {
      updateData.endDate = null;
    } else if (typeof endDate === "string") {
      const parsedEnd = new Date(endDate);
      if (Number.isNaN(parsedEnd.getTime())) {
        return NextResponse.json({ error: "Invalid endDate format" }, { status: 400 });
      }
      updateData.endDate = parsedEnd;
    } else {
      return NextResponse.json({ error: "Invalid endDate value" }, { status: 400 });
    }
  }

  if (typeof completed !== "undefined") {
    updateData.completed = completed;
  }

  if (Object.keys(updateData).length === 0) {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(existing);
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Update failed", details: `${error}` }, { status: 500 });
  }
}

// PATCH: Update partially
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = extractIdFromUrl(request);
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  const body = await request.json();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...("completed" in body && { completed: body.completed }),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Patch failed", details: `${error}` }, { status: 500 });
  }
}

// DELETE: Delete task
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = extractIdFromUrl(request);
  if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed", details: `${error}` }, { status: 500 });
  }
}
