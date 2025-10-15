import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProjectBoard } from "@/lib/projects/service";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const board = await getProjectBoard(user.id);
    return NextResponse.json(board);
  } catch (error) {
    console.error("Failed to load project board", error);
    return NextResponse.json({ error: "Unable to load project hub data." }, { status: 500 });
  }
}
