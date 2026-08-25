"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { MagnifyingGlass, ArrowsClockwise } from "@phosphor-icons/react";
import { useFeed } from "@/components/feed-provider";
import { EventCard } from "@/components/event-card";
import { applyFilters } from "@/lib/filters";

const PAGE = 16;

export function MasonryGrid() {
  const events = useFeed((s) => s.events);
  const order = useFeed((s) => s.feedOrder);
  const filters = useFeed((s) => s.filters);
  const newIds = useFeed((s) => s.newIds);
  const reset = useFeed((s) => s.resetFilters);
  const [pages, setPages] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const visible = useMemo(() => {
    const list = order.map((id) => events[id]).filter(Boolean);
    return applyFilters(list, filters);
  }, [events, order, filters]);

  const shown = visible.slice(0, pages * PAGE);

  // reset pagination whenever the filter set changes
  useEffect(() => {
    setPages(1);
  }, [filters]);

  // auto-expand when the sentinel scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || shown.length >= visible.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          setPages((p) => p + 1);
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown.length, visible.length]);

  return (
    <section aria-label="Event feed" className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6">
      {visible.length === 0 ? (
        <EmptyState onReset={reset} />
      ) : (
        <>
          <p className="mb-4 font-mono text-xs text-ink-faint" role="status" aria-live="polite">
            <span suppressHydrationWarning>
              {visible.length} event{visible.length === 1 ? "" : "s"}
            </span>{" "}
            · updating live
          </p>
          <div className="masonry">
            <AnimatePresence initial={false}>
              {shown.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  index={reduce ? 0 : i % PAGE}
                  isNew={newIds.has(e.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* sentinel: keeps the next page pre-loaded */}
          {shown.length < visible.length && (
            <div ref={sentinelRef} className="mt-4 flex justify-center py-6">
              <span className="flex items-center gap-2 font-mono text-xs text-ink-faint">
                <ArrowsClockwise size={13} aria-hidden className="animate-spin" />
                Loading more
              </span>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-card border border-dashed border-line-strong px-8 py-20 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-ink-muted">
        <MagnifyingGlass size={20} weight="bold" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">Nothing matches that</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        Try widening the date range, switching city, or clearing your filters.
        New events are being discovered every minute.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="pressable mt-5 cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-semibold text-on-accent hover:bg-accent-hover"
      >
        Clear all filters
      </button>
    </div>
  );
}
