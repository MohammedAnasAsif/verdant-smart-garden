"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  X,
  MapPin,
  NavigationArrow,
  Users,
  SealCheck,
  ShareNetwork,
  Heart,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { useFeed, useSaved } from "@/components/feed-provider";
import { CATEGORY_LABEL } from "@/lib/present";
import {
  capacityPct,
  eventStatus,
  fmtDayLabel,
  fmtPrice,
  fmtTime,
} from "@/lib/time";

export function EventModal() {
  const selectedId = useFeed((s) => s.selectedId);
  return (
    <AnimatePresence>
      {selectedId && <ModalBody key={selectedId} id={selectedId} />}
    </AnimatePresence>
  );
}

function ModalBody({ id }: { id: string }) {
  const event = useFeed((s) => s.events[id]);
  const openEvent = useFeed((s) => s.openEvent);
  const patchAttendees = useFeed((s) => s.patchAttendees);
  const saved = useSaved((s) => Boolean(s.saved[id]));
  const toggleSaved = useSaved((s) => s.toggleSaved);

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const [rsvpState, setRsvpState] = useState<"idle" | "pending" | "done" | "full">("idle");
  const reduce = useReducedMotion();
  const now = Date.now();

  useEffect(() => {
    if (!event) openEvent(null);
  }, [event, openEvent]);

  // focus management + scroll lock + Escape
  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const el = dialogRef.current;
    el?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "Tab" && el) {
        // simple focus trap
        const focusables = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => openEvent(null), [openEvent]);

  if (!event) return null;

  const status = eventStatus(event, now);
  const pct = capacityPct(event.attendees, event.capacity);
  const full = event.attendees >= event.capacity;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue.name}, ${event.venue.neighborhood}, ${event.city}`
  )}`;

  async function rsvp() {
    if (rsvpState !== "idle") return;
    setRsvpState("pending");
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (res.ok) {
        const data: { attendees?: number } = await res.json();
        if (typeof data.attendees === "number") patchAttendees(event.id, data.attendees);
        setRsvpState("done");
        toast.success("You're in", { description: event.title.slice(0, 60) });
      } else if (res.status === 409) {
        setRsvpState("full");
        toast.error("Sold out", { description: "This one filled up fast." });
      } else if (res.status === 429) {
        setRsvpState("idle");
        toast.error("Slow down", { description: "Too many requests — try again shortly." });
      } else {
        setRsvpState("idle");
        toast.error("Couldn't RSVP", { description: "Please try again." });
      }
    } catch {
      setRsvpState("idle");
      toast.error("Network error", { description: "Check your connection and retry." });
    }
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: event.title.slice(0, 60) });
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      role="dialog"
      aria-modal="true"
      aria-label={event.title}
    >
      {/* backdrop */}
      <motion.button
        type="button"
        aria-label="Close dialog"
        onClick={close}
        className="absolute inset-0 cursor-default"
        style={{ background: "var(--scrim)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      />

      <motion.div
        ref={dialogRef}
        initial={reduce ? false : { opacity: 0, scale: 0.965, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.16 } }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-2xl"
      >
        {/* header media */}
        <div className="relative h-56 shrink-0 sm:h-72">
          <Image src={event.image} alt="" fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            data-autofocus
            className="pressable absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur-md hover:bg-black/65"
          >
            <X size={16} weight="bold" />
          </button>

          <div className="absolute inset-x-5 bottom-4 text-white">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-white/90">
              <time suppressHydrationWarning dateTime={new Date(event.startsAt).toISOString()}>
                {fmtDayLabel(event.startsAt, now)} · {fmtTime(event.startsAt)}
              </time>
              {(status === "live" || status === "ending_soon") && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold normal-case text-on-accent">
                  <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-on-accent" aria-hidden />
                  {status === "live" ? "Live now" : "Ending soon"}
                </span>
              )}
            </div>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-[28px]">
              {event.title}
            </h2>
          </div>
        </div>

        {/* content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} weight="fill" aria-hidden className="text-ink-faint" />
              {event.venue.name} · {event.venue.neighborhood}
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex cursor-pointer items-center gap-1 font-medium text-accent hover:text-accent-hover"
            >
              <NavigationArrow size={13} weight="bold" aria-hidden />
              Directions
              <span aria-hidden>↗</span>
            </a>
          </div>

          <p className="mt-4 max-w-[62ch] text-[14.5px] leading-relaxed text-ink">
            {event.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <Tag>{CATEGORY_LABEL[event.category]}</Tag>
            {event.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          {/* host */}
          <div className="mt-5 flex items-center gap-3 border-y border-line py-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 font-display text-sm font-semibold text-ink">
              {event.host.name.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1 truncate text-sm font-medium text-ink">
                Hosted by {event.host.name}
                {event.host.verified && (
                  <SealCheck size={14} weight="fill" aria-hidden className="shrink-0 text-accent" />
                )}
              </p>
              <p className="font-mono text-[11px] text-ink-faint">{event.city}</p>
            </div>
          </div>

          {/* capacity */}
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                <Users size={14} weight="bold" aria-hidden />
                <span suppressHydrationWarning>{event.attendees}</span> going
                <span aria-hidden>·</span>
                <span suppressHydrationWarning>{Math.max(event.capacity - event.attendees, 0)}</span> spots left
              </span>
              <span suppressHydrationWarning className="font-mono text-xs font-medium text-ink">
                {pct}%
              </span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Capacity filled"
            >
              <motion.div
                className={`h-full rounded-full ${pct >= 82 ? "bg-accent" : "bg-ink"}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>

        {/* action bar */}
        <div className="flex shrink-0 items-center gap-3 border-t border-line bg-bg/60 px-5 py-4 backdrop-blur sm:px-7">
          <div className="mr-auto">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">
              {fmtPrice(event.priceMin, event.priceMax)}
            </p>
            <p className="text-[11px] text-ink-faint">per person</p>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = toggleSaved(event.id);
              toast(next ? "Saved to your list" : "Removed from saved", {
                description: event.title.slice(0, 60),
              });
            }}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved" : "Save event"}
            className={`pressable grid h-11 w-11 cursor-pointer place-items-center rounded-full border transition-colors ${
              saved
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-surface text-ink hover:border-line-strong"
            }`}
          >
            <Heart size={17} weight={saved ? "fill" : "regular"} />
          </button>

          <button
            type="button"
            onClick={share}
            aria-label="Copy share link"
            className="pressable grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink hover:border-line-strong"
          >
            <ShareNetwork size={16} />
          </button>

          <RSVPButton state={rsvpState} full={full} ended={event.endsAt <= now} onClick={rsvp} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function RSVPButton({
  state,
  full,
  ended,
  onClick,
}: {
  state: string;
  full: boolean;
  ended: boolean;
  onClick: () => void;
}) {
  const disabled = state !== "idle" || full || ended;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`pressable h-11 cursor-pointer whitespace-nowrap rounded-full px-6 text-sm font-semibold transition-colors ${
        state === "done"
          ? "bg-surface-2 text-ink-muted"
          : full || ended
            ? "cursor-not-allowed bg-surface-2 text-ink-faint"
            : "bg-accent text-on-accent hover:bg-accent-hover"
      }`}
    >
      {ended
        ? "Ended"
        : full || state === "full"
          ? "Sold out"
          : state === "done"
            ? "You're going"
            : state === "pending"
              ? "Reserving…"
              : "Get tickets"}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium capitalize text-ink-muted">
      {children}
    </span>
  );
}
