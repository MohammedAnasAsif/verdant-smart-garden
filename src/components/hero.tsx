"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { useFeed } from "@/components/feed-provider";
import { applyFilters } from "@/lib/filters";

/**
 * Asymmetric split hero: headline left, live pulse cluster right.
 * Fits the initial viewport; max 4 text elements per the hero stack rule.
 */
export function Hero() {
  const viewers = useFeed((s) => s.viewers);
  const liveCount = useFeed((s) => s.liveCount);
  const totalEvents = useFeed((s) => s.feedOrder.length);
  const events = useFeed((s) => s.events);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const tonight = mounted
    ? applyFilters(Object.values(events), {
        query: "",
        category: "all",
        date: "today",
        price: "all",
        city: "everywhere",
        sort: "soonest",
      }).length
    : 0;

  return (
    <section className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-10 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[7fr_5fr] lg:items-end">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-[2.75rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.25rem]">
          What&apos;s happening
          <br />
          near you,{" "}
          <span className="text-accent">right now.</span>
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-muted">
          A real-time feed of events around you — live rooms filling up,
          fresh discoveries landing every minute.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#feed"
            className="pressable inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent hover:bg-accent-hover"
          >
            Browse the feed
            <ArrowDown size={15} weight="bold" aria-hidden />
          </a>
          <span className="font-mono text-xs text-ink-faint">
            {liveCount} live now · {tonight} on tonight
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface"
        role="group"
        aria-label="Live platform statistics"
      >
        <Stat label="Live right now" value={liveCount} accent />
        <Stat label="Discovering" value={viewers} />
        <Stat label="In the feed" value={totalEvents} last />
      </motion.div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
  last,
}: {
  label: string;
  value: number;
  accent?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`px-4 py-5 sm:px-5 ${last ? "" : "border-r border-line"}`}>
      <div
        className={`flex items-center gap-1.5 font-mono text-2xl font-semibold tabular-nums sm:text-3xl ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {accent && (
          <span className="pulse-dot h-2 w-2 rounded-full bg-accent text-accent" aria-hidden />
        )}
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-ink-faint">{label}</div>
    </div>
  );
}
