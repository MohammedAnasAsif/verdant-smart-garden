"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useFeed } from "@/components/feed-provider";

/**
 * Bottom-left live activity stack fed by SSE. Max 3 visible,
 * auto-dismiss after 4.5s, aria-live polite.
 */
export function ActivityToasts() {
  const activity = useFeed((s) => s.activity);
  const reduce = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const items = activity.slice(0, 3);

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-40 hidden w-72 flex-col gap-2 md:flex"
      role="log"
      aria-live="polite"
      aria-label="Live activity"
    >
      <AnimatePresence initial={false}>
        {items.map((a) => (
          <motion.div
            key={a.id}
            layout
            initial={reduce ? false : { opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto rounded-xl border border-line bg-surface/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <span className="pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent text-accent" aria-hidden />
              <p className="truncate text-[12px] leading-snug text-ink">{a.text}</p>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-ink-faint">
                {relTime(a.at, now)}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function relTime(ts: number, now: number): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 5) return "now";
  if (s < 60) return `${s}s`;
  return `${Math.round(s / 60)}m`;
}
