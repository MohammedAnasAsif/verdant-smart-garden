"use client";

import type { EventCategory, EventItem } from "@/lib/types";

export const ASPECT_RATIOS: Record<EventItem["aspect"], string> = {
  portrait: "4 / 5",
  tall: "2 / 3",
  square: "1 / 1",
  landscape: "4 / 3",
};

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  music: "Music",
  nightlife: "Nightlife",
  art: "Art",
  food: "Food",
  tech: "Tech",
  wellness: "Wellness",
  sports: "Sports",
  film: "Film",
  community: "Community",
};

/** Deterministic attendee initials for the avatar cluster. */
const FIRST = ["Maya", "Jon", "Rue", "Kai", "Ana", "Theo", "Ivy", "Sam", "Noa", "Elif", "Max", "Zoe"];
const LAST = ["O.", "K.", "M.", "L.", "T.", "S.", "B.", "N.", "F.", "D."];

export function attendeeInitials(eventId: string, count: number): string[] {
  const out: string[] = [];
  let h = 0;
  for (let i = 0; i < eventId.length; i++) h = (h * 31 + eventId.charCodeAt(i)) | 0;
  const n = Math.min(count, 4);
  for (let i = 0; i < n; i++) {
    const f = FIRST[Math.abs(h + i * 7) % FIRST.length];
    const l = LAST[Math.abs(h + i * 13) % LAST.length];
    out.push(`${f[0]}${l}`);
  }
  return out;
}
