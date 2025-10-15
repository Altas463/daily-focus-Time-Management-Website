import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge className values and resolve Tailwind conflicts (e.g. "p-2 p-4" -> "p-4")
 * @example cn("p-2", { "text-red-500": true, "hidden": false }) // -> "p-2 text-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
