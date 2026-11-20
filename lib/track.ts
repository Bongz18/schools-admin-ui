"use client";

// Sends one anonymous event to /api/track. Each browser counts once per school per
// session for each event type, so refreshing a page doesn't inflate the numbers.
export type SchoolEventType = "view" | "compare_add" | "contact_email" | "contact_phone" | "contact_website";

export function trackSchoolEvent(schoolId: string, type: SchoolEventType) {
  try {
    const key = `schoolspot-tracked-${type}-${schoolId}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked: still send the event.
  }
  const payload = JSON.stringify({ schoolId, type });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    // Fall through to fetch.
  }
  fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(
    () => {},
  );
}
