"use client";

type Converter<T> = (value: string) => T;

const isBrowser = typeof window !== "undefined";

export function readFromStorage<T>(key: string, fallback: T, converter?: Converter<T>): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    if (converter) return converter(raw);
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeToStorageInternal<T>(key: string, value: T) {
  if (!isBrowser) return;
  try {
    const payload = typeof value === "string" ? value : JSON.stringify(value);
    window.localStorage.setItem(key, payload);
  } catch {
    // swallow errors — storage may be disabled or full
  }
}

export function removeFromStorageInternal(key: string) {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function writeToStorage<T>(key: string, value: T) {
  writeToStorageInternal(key, value);
}

export function removeFromStorage(key: string) {
  removeFromStorageInternal(key);
}
