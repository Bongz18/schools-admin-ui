"use client";

import { useEffect, useState } from "react";

// The parent's compare list lives in their own browser only.
const KEY = "schoolspot-compare";
const EVENT = "schoolspot-compare-change";
export const COMPARE_LIMIT = 3;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string").slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids.slice(0, COMPARE_LIMIT)));
  } catch {
    // Storage can be blocked (private mode); the list then lasts only for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useCompareList() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = (id: string) => {
    const current = read();
    if (current.includes(id) || current.length >= COMPARE_LIMIT) return false;
    write([...current, id]);
    return true;
  };
  const remove = (id: string) => write(read().filter((item) => item !== id));
  const clear = () => write([]);

  return { ids, add, remove, clear, isFull: ids.length >= COMPARE_LIMIT };
}
