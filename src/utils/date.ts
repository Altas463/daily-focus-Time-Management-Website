/**
 * Returns a contextual greeting (morning/afternoon/evening) for the provided date.
 * Defaults to the current time when no argument is supplied.
 */
export function getDaypartGreeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour < 12) return "Chao buoi sang";
  if (hour < 18) return "Chao buoi chieu";
  return "Chao buoi toi";
}

/**
 * Formats a task deadline in a conversational Vietnamese string relative to `now`.
 * Examples: "Hom nay", "Ngay mai", "2 ngay truoc", "3 ngay nua".
 */
export function formatRelativeDate(
  dateInput: string | Date,
  now: Date = new Date()
): string {
  const target = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(target.getTime())) return "Khong ro thoi han";

  const diffInMs = target.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hom nay";
  if (diffInDays === 1) return "Ngay mai";
  if (diffInDays === -1) return "Hom qua";
  if (diffInDays > 0) return `${diffInDays} ngay nua`;

  return `${Math.abs(diffInDays)} ngay truoc`;
}

/**
 * Formats a date into "dd thg mm" (e.g. "05 thg 08").
 * Returns null if the input cannot be parsed.
 */
export function formatDayMonth(
  dateInput?: string | Date | null,
  locale: string = "vi-VN"
): string | null {
  if (!dateInput) return null;
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
}

/**
 * Calculates the whole number of calendar days between two dates (ignoring time zone offsets).
 */
export function differenceInCalendarDays(a: Date, b: Date): number {
  const startOfA = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const startOfB = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const diffInMs = startOfA.getTime() - startOfB.getTime();
  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
}

export function formatShortDay(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
}

export function formatShortDate(date: Date, locale: string = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date);
}
