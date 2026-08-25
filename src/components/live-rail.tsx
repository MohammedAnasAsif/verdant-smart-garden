"use client";

import { useMemo } from "react";
import { useFeed } from "@/components/feed-provider";
import { EventCard } from "@/components/event-card";
import { eventStatus, fmtRelative } from "@/lib/time";

/**
 * "Happening now" rail: live + starting-soon events in a horizontal
 * scroll-snap strip. Only appears when there is something live.
 */
export function LiveRail() {
  const events = useFeed((s) => s.events);
  const order = useFeed((s) => s.feedOrder);
  const now = Date.now();

  const live = useMemo(() => {
    return order
      .map((id) => events[id])
      .filter(Boolean)
      .filter((e) => {
        const st = eventStatus(e, now);
        return st === "live" || st === "ending_soon" || st === "soon";
      })
      .sort((a, b) => a.startsAt - b.startsAt)
      .slice(0, 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, order]);

  if (live.length === 0) return null;

  return (
    <section aria-label="Happening soon" className="mx-auto max-w-[1400px] px-4 pb-2 sm:px-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          Happening <span className="text-accent">now</span> &amp; next
        </h2>
        <span className="font-mono text-[11px] text-ink-faint">
          next up ·{" "}
          <span suppressHydrationWarning>
            {live[0].startsAt > now ? fmtRelative(live[0].startsAt, now) : "on"}
          </span>
        </span>
      </div>
      <div className="rail-scroll -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {live.map((e, i) => (
          <div key={e.id} className="w-[240px] shrink-0 snap-start sm:w-[260px]">
            <EventCard event={e} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
