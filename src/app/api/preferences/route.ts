import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type PreferencePayload = {
  displayName?: string | null;
  role?: string | null;
  bio?: string | null;
  focusDurationMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  weeklyDigest?: boolean;
};

const DEFAULT_BOUNDARIES = {
  focus: { min: 10, max: 90 },
  shortBreak: { min: 2, max: 30 },
  longBreak: { min: 5, max: 60 },
};

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { preference: true },
  });

  return user;
}

function sanitizeString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function parseNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.round(number) : null;
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preference =
    user.preference ??
    (await prisma.userPreference.create({
      data: {
        userId: user.id,
      },
    }));

  return NextResponse.json({
    preference,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  });
}

export async function PUT(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: PreferencePayload;
  try {
    body = (await request.json()) as PreferencePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const updates: PreferencePayload = {};
  const errors: string[] = [];

  if ("displayName" in body) {
    updates.displayName = sanitizeString(body.displayName ?? null);
  }
  if ("role" in body) {
    updates.role = sanitizeString(body.role ?? null);
  }
  if ("bio" in body) {
    updates.bio = sanitizeString(body.bio ?? null);
  }

  if ("focusDurationMinutes" in body) {
    const parsed = parseNumber(body.focusDurationMinutes);
    if (!parsed || parsed < DEFAULT_BOUNDARIES.focus.min || parsed > DEFAULT_BOUNDARIES.focus.max) {
      errors.push(`focusDurationMinutes must be between ${DEFAULT_BOUNDARIES.focus.min} and ${DEFAULT_BOUNDARIES.focus.max}`);
    } else {
      updates.focusDurationMinutes = parsed;
    }
  }

  if ("shortBreakMinutes" in body) {
    const parsed = parseNumber(body.shortBreakMinutes);
    if (!parsed || parsed < DEFAULT_BOUNDARIES.shortBreak.min || parsed > DEFAULT_BOUNDARIES.shortBreak.max) {
      errors.push(
        `shortBreakMinutes must be between ${DEFAULT_BOUNDARIES.shortBreak.min} and ${DEFAULT_BOUNDARIES.shortBreak.max}`,
      );
    } else {
      updates.shortBreakMinutes = parsed;
    }
  }

  if ("longBreakMinutes" in body) {
    const parsed = parseNumber(body.longBreakMinutes);
    if (!parsed || parsed < DEFAULT_BOUNDARIES.longBreak.min || parsed > DEFAULT_BOUNDARIES.longBreak.max) {
      errors.push(
        `longBreakMinutes must be between ${DEFAULT_BOUNDARIES.longBreak.min} and ${DEFAULT_BOUNDARIES.longBreak.max}`,
      );
    } else {
      updates.longBreakMinutes = parsed;
    }
  }

  if ("emailNotifications" in body) {
    updates.emailNotifications = Boolean(body.emailNotifications);
  }
  if ("pushNotifications" in body) {
    updates.pushNotifications = Boolean(body.pushNotifications);
  }
  if ("weeklyDigest" in body) {
    updates.weeklyDigest = Boolean(body.weeklyDigest);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const updatedPreference = await prisma.userPreference.upsert({
    where: { userId: user.id },
    update: updates,
    create: {
      userId: user.id,
      ...updates,
    },
  });

  if ("displayName" in updates) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: updates.displayName ?? user.name ?? "" },
    });
  }

  const refreshedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return NextResponse.json({
    preference: updatedPreference,
    user: refreshedUser,
  });
}
