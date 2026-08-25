"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import { Clock, Drop, Play, Pause, CheckCircle } from "@phosphor-icons/react";

interface WateringEvent {
  id: string;
  plantName: string;
  zone: string;
  scheduledTime: string;
  duration: string;
  amount: string;
  status: "upcoming" | "active" | "completed" | "skipped";
  automated: boolean;
}

const SCHEDULE: WateringEvent[] = [
  { id: "1", plantName: "Tomato Row A", zone: "Zone 1 — Vegetable Patch", scheduledTime: "06:00 AM", duration: "15 min", amount: "2.5L", status: "completed", automated: true },
  { id: "2", plantName: "Herb Garden", zone: "Zone 2 — Kitchen Herbs", scheduledTime: "06:30 AM", duration: "8 min", amount: "1.2L", status: "completed", automated: true },
  { id: "3", plantName: "Rose Bushes", zone: "Zone 3 — Flower Bed", scheduledTime: "07:15 AM", duration: "12 min", amount: "3.0L", status: "active", automated: true },
  { id: "4", plantName: "Pepper Plants", zone: "Zone 1 — Vegetable Patch", scheduledTime: "08:00 AM", duration: "10 min", amount: "2.0L", status: "upcoming", automated: false },
  { id: "5", plantName: "Citrus Trees", zone: "Zone 4 — Orchard", scheduledTime: "09:00 AM", duration: "20 min", amount: "5.0L", status: "upcoming", automated: true },
  { id: "6", plantName: "Lettuce Bed", zone: "Zone 1 — Vegetable Patch", scheduledTime: "10:30 AM", duration: "6 min", amount: "1.0L", status: "upcoming", automated: true },
];

export const WateringSchedule = memo(function WateringSchedule() {
  const reduce = useReducedMotion();

  const statusConfig = {
    upcoming: { color: "text-ink-muted", bg: "bg-surface-2", icon: <Clock size={14} /> },
    active: { color: "text-accent", bg: "bg-accent-muted", icon: <Play size={14} weight="fill" /> },
    completed: { color: "text-sensor-good", bg: "bg-sensor-good/10", icon: <CheckCircle size={14} weight="fill" /> },
    skipped: { color: "text-ink-faint", bg: "bg-surface-2", icon: <Pause size={14} /> },
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10">
            <Drop size={18} className="text-blue-400" weight="fill" />
          </div>
          <div>
            <h3 className="font-display text-[14px] font-semibold text-ink">Watering Schedule</h3>
            <p className="text-[11px] text-ink-muted">Today&apos;s automated irrigation plan</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-muted px-2.5 py-1 text-[11px] font-medium text-accent">
            {SCHEDULE.filter((e) => e.status === "completed").length}/{SCHEDULE.length} done
          </span>
        </div>
      </div>

      <div className="divide-y divide-line">
        {SCHEDULE.map((event, i) => {
          const config = statusConfig[event.status];
          return (
            <motion.div
              key={event.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                event.status === "active" ? "bg-accent-muted/30" : ""
              }`}
            >
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${config.bg} ${config.color}`}>
                {config.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-ink truncate">{event.plantName}</p>
                  {event.automated && (
                    <span className="shrink-0 rounded bg-accent-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent">
                      AI
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-ink-faint truncate">{event.zone}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-mono text-[12px] font-medium text-ink">{event.scheduledTime}</p>
                  <p className="text-[10px] text-ink-faint">{event.duration} · {event.amount}</p>
                </div>
                {event.status === "active" && (
                  <div className="flex items-center gap-1">
                    <span className="pulse-dot h-2 w-2 rounded-full bg-accent text-accent" />
                    <span className="text-[10px] font-semibold uppercase text-accent">Live</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});
