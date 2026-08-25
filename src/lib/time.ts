import { EventItem } from "./types";

/** Derives live status from timestamps at render time (never stale). */
export function eventStatus(
  e: Pick<EventItem, "startsAt" | "endsAt">,
  now: number
): "live" | "soon" | "ending_soon" | "upcoming" {
  if (e.startsAt <= now && e.endsAt > now) {
    return e.endsAt - now < 45 * 60_000 ? "ending_soon" : "live";
  }
  if (e.startsAt - now < 90 * 60_000) return "soon";
  return "upcoming";
}

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDayLabel(ts: number, now: number): string {
  const d = new Date(ts);
  const today = new Date(now);
  const dayStartToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (ts >= dayStartToday && ts < dayStartToday + 86_400_000) return "Today";
  if (ts >= dayStartToday + 86_400_000 && ts < dayStartToday + 2 * 86_400_000) return "Tomorrow";
  return `${DAY[d.getDay()]} ${MONTH[d.getMonth()]} ${d.getDate()}`;
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export function fmtRelative(ts: number, now: number): string {
  const diff = ts - now;
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60_000);
  if (min < 1) return "now";
  if (abs < 60 * 60_000) return diff > 0 ? `in ${min}m` : `${min}m ago`;
  const hrs = Math.round(abs / 3_600_000);
  if (hrs < 24) return diff > 0 ? `in ${hrs}h` : `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return diff > 0 ? `in ${days}d` : `${days}d ago`;
}

export function fmtPrice(min: number, max: number): string {
  if (min === 0) return "Free";
  if (max === min) return `$${min}`;
  return `$${min}–${max}`;
}

export function capacityPct(attendees: number, capacity: number): number {
  if (capacity <= 0) return 100;
  return Math.min(100, Math.round((attendees / capacity) * 100));
}
