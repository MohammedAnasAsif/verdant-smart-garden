"use client";

import Image from "next/image";
import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Heart,
  MapPin,
  Users,
} from "@phosphor-icons/react";
import type { EventItem } from "@/lib/types";
import { useFeed, useSaved } from "@/components/feed-provider";
import { attendeeInitials, CATEGORY_LABEL, ASPECT_RATIOS } from "@/lib/present";
import {
  capacityPct,
  eventStatus,
  fmtDayLabel,
  fmtPrice,
  fmtRelative,
  fmtTime,
} from "@/lib/time";
import { toast } from "sonner";

interface Props {
  event: EventItem;
  index: number;
  isNew?: boolean;
}

export const EventCard = memo(function EventCard({ event, index, isNew }: Props) {
  const openEvent = useFeed((s) => s.openEvent);
  const toggleSaved = useSaved((s) => s.toggleSaved);
  const saved = useSaved((s) => Boolean(s.saved[event.id]));
  const reduce = useReducedMotion();
  const now = Date.now();
  const status = eventStatus(event, now);
  const pct = capacityPct(event.attendees, event.capacity);
  const almostFull = pct >= 82;
  const initials = attendeeInitials(event.id, event.attendees);

  return (
    <motion.article
      layout="position"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <div className="hover-lift cursor-pointer overflow-hidden rounded-card border border-line bg-surface">
        {/* media */}
        <button
          type="button"
          onClick={() => openEvent(event.id)}
          aria-label={`Open ${event.title}`}
          className="media-zoom relative block w-full cursor-pointer"
        >
          <span
            className="relative block w-full"
            style={{ aspectRatio: ASPECT_RATIOS[event.aspect] }}
          >
            <Image
              src={event.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </span>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />

          {/* status badges */}
          {(status === "live" || status === "ending_soon") && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-on-accent">
              <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-on-accent" aria-hidden />
              {status === "live" ? "LIVE" : "ENDING SOON"}
            </span>
          )}
          {isNew && status !== "live" && status !== "ending_soon" && (
            <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold text-accent shadow-sm">
              NEW
            </span>
          )}
        </button>

        {/* save */}
        <SaveButton
          saved={saved}
          onToggle={() => {
            const next = toggleSaved(event.id);
            toast(next ? "Saved to your list" : "Removed from saved", {
              description: event.title.slice(0, 60),
            });
          }}
        />

        {/* body */}
        <div className="p-3.5">
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted">
            <time suppressHydrationWarning dateTime={new Date(event.startsAt).toISOString()}>
              {fmtDayLabel(event.startsAt, now)} · {fmtTime(event.startsAt)}
            </time>
            {status === "soon" && (
              <span suppressHydrationWarning className="text-accent">
                · starts {fmtRelative(event.startsAt, now)}
              </span>
            )}
          </div>

          <h3 className="mt-1.5 font-display text-[15px] font-medium leading-snug tracking-tight text-ink">
            <button
              type="button"
              onClick={() => openEvent(event.id)}
              className="cursor-pointer text-left"
            >
              {event.title}
            </button>
          </h3>

          <p className="mt-1 flex items-center gap-1 truncate text-[12.5px] text-ink-muted">
            <MapPin size={12} weight="fill" aria-hidden className="shrink-0 text-ink-faint" />
            {event.venue.name} · {event.venue.neighborhood}
          </p>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="inline-flex items-center rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              {CATEGORY_LABEL[event.category]}
            </span>
            <span
              className={`font-mono text-[11.5px] font-medium ${
                event.priceMin === 0 ? "text-accent" : "text-ink"
              }`}
            >
              {fmtPrice(event.priceMin, event.priceMax)}
            </span>
          </div>

          {/* social proof */}
          <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
            <span className="flex items-center -space-x-1.5" aria-hidden>
              {initials.map((t, i) => (
                <span
                  key={i}
                  className="grid h-5 w-5 place-items-center rounded-full border border-surface bg-surface-2 text-[8px] font-semibold text-ink-muted"
                >
                  {t}
                </span>
              ))}
              <span className="ml-3 flex items-center gap-1 pl-1 font-mono text-[10.5px] text-ink-faint">
                <Users size={11} weight="bold" aria-hidden />
                <span suppressHydrationWarning>{event.attendees}</span> going
              </span>
            </span>
            {almostFull && (
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wide text-accent">
                {pct}% full
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

function SaveButton({ saved, onToggle }: { saved: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={saved ? undefined : { scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={saved ? "Remove from saved" : "Save event"}
      aria-pressed={saved}
      className={`pressable absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full backdrop-blur-md transition-colors ${
        saved ? "bg-accent text-on-accent" : "bg-black/35 text-white hover:bg-black/50"
      }`}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: saved ? 0.7 : 1, opacity: saved ? 0 : 1 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}
        className="grid place-items-center"
      >
        <Heart size={16} weight={saved ? "fill" : "regular"} />
      </motion.span>
    </motion.button>
  );
}
