"use client";

/**
 * Ensures the value stays within the specified numeric range.
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a ratio as a percentage with an optional number of decimals.
 */
export function formatPercentage(
  value: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 0 }
): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    ...options,
  });
  return formatter.format(value);
}

/**
 * Produces a short human readable duration (e.g. "2h 05m", "45m").
 */
export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (!hours) return `${mins}m`;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

/**
 * Selects the singular or plural form based on the provided value.
 */
export function pluralize(
  value: number,
  singular: string,
  plural: string,
  includeValue = true
): string {
  const text = Math.abs(value) === 1 ? singular : plural;
  return includeValue ? `${value} ${text}` : text;
}

/**
 * Turns the first letter of the string into uppercase (rest unchanged).
 */
export function capitalize(input: string): string {
  if (!input) return "";
  return input.charAt(0).toUpperCase() + input.slice(1);
}
