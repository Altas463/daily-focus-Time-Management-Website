import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  reset: number;
};

const RATE_LIMIT = 120;
const WINDOW_MS = 60_000;
const MAX_STORE_SIZE = 10_000;

const rateLimitStore = new Map<string, RateLimitEntry>();

function isRateLimited(ip: string, now: number): boolean {
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.reset < now) {
    rateLimitStore.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT) {
    return true;
  }

  return false;
}

function cleanupStore(now: number) {
  if (rateLimitStore.size <= MAX_STORE_SIZE) return;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.reset < now) {
      rateLimitStore.delete(key);
    }
  }
}

const allowedHosts = new Set<string>(
  [process.env.NEXT_PUBLIC_APP_DOMAIN, "localhost:3000"].filter(
    (value): value is string => Boolean(value)
  )
);

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return request.headers.get("cf-connecting-ip") ?? "unknown";
}

export function middleware(request: NextRequest) {
  const now = Date.now();

  const clientIp = getClientIp(request);

  cleanupStore(now);

  if (isRateLimited(clientIp, now)) {
    return new NextResponse("Too many requests. Please slow down.", {
      status: 429,
    });
  }

  const hostHeader = request.headers.get("host");
  if (hostHeader && allowedHosts.size > 0 && !allowedHosts.has(hostHeader)) {
    return new NextResponse("Host not allowed.", { status: 403 });
  }

  if (request.method === "POST" && !request.headers.get("content-length")) {
    return new NextResponse("Missing content length.", { status: 411 });
  }

  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.svgrepo.com",
      "script-src 'self'",
      "connect-src 'self'",
      "font-src 'self'",
    ].join("; ")
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
