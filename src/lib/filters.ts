import type { EventFilters, EventItem } from "./types";

/**
 * Pure filter + sort logic shared by the API route and the client store.
 * No node builtins so it can run on both sides.
 */
export function applyFilters(
  events: EventItem[],
  f: Partial<EventFilters>,
  now = Date.now()
): EventItem[] {
  const q = f.query?.toLowerCase().trim();

  let out = events.filter((e) => {
    if (e.endsAt <= now) return false;

    if (f.category && f.category !== "all" && e.category !== f.category) return false;
    if (f.city && f.city !== "everywhere" && e.city !== f.city) return false;

    if (f.price === "free" && e.priceMin > 0) return false;
    if (f.price === "paid" && e.priceMin === 0) return false;

    if (q) {
      const haystack = [
        e.title,
        e.description,
        e.venue.name,
        e.venue.neighborhood,
        e.category,
        e.host.name,
        ...e.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (f.date && f.date !== "all") {
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);
      const t0 = todayStart.getTime();
      const DAY = 86_400_000;
      switch (f.date) {
        case "today":
          if (e.startsAt >= t0 + DAY || e.endsAt <= t0) return false;
          break;
        case "tomorrow":
          if (e.startsAt >= t0 + 2 * DAY || e.endsAt <= t0 + DAY) return false;
          break;
        case "weekend": {
          const dow = new Date(e.startsAt).getDay();
          const withinWeek = e.startsAt < t0 + 7 * DAY;
          if (!(withinWeek && (dow === 5 || dow === 6 || dow === 0))) return false;
          break;
        }
        case "week":
          if (e.startsAt >= t0 + 7 * DAY) return false;
          break;
      }
    }

    return true;
  });

  switch (f.sort) {
    case "trending":
      out = out.sort(
        (a, b) =>
          Number(b.trending) - Number(a.trending) ||
          b.attendees / b.capacity - a.attendees / a.capacity
      );
      break;
    case "popular":
      out = out.sort((a, b) => b.attendees - a.attendees);
      break;
    case "soonest":
    default:
      out = out.sort((a, b) => a.startsAt - b.startsAt);
      break;
  }

  return out;
}
