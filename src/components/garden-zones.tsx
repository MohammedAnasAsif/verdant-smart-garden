"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import { MapPin, Drop, Thermometer, Sun } from "@phosphor-icons/react";

interface Zone {
  id: string;
  name: string;
  plantCount: number;
  status: "optimal" | "attention" | "critical";
  moisture: number;
  temperature: number;
  lightHours: number;
}

const ZONES: Zone[] = [
  { id: "1", name: "Vegetable Patch", plantCount: 12, status: "optimal", moisture: 62, temperature: 24, lightHours: 8 },
  { id: "2", name: "Kitchen Herbs", plantCount: 8, status: "optimal", moisture: 55, temperature: 22, lightHours: 6 },
  { id: "3", name: "Flower Bed", plantCount: 15, status: "attention", moisture: 28, temperature: 26, lightHours: 9 },
  { id: "4", name: "Orchard", plantCount: 5, status: "optimal", moisture: 48, temperature: 23, lightHours: 7 },
];

export const GardenZones = memo(function GardenZones() {
  const reduce = useReducedMotion();

  const statusConfig = {
    optimal: { color: "text-sensor-good", bg: "bg-sensor-good/10", ring: "ring-sensor-good/20" },
    attention: { color: "text-sensor-warn", bg: "bg-sensor-warn/10", ring: "ring-sensor-warn/20" },
    critical: { color: "text-sensor-danger", bg: "bg-sensor-danger/10", ring: "ring-sensor-danger/20" },
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
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-muted">
            <MapPin size={18} className="text-accent" weight="fill" />
          </div>
          <div>
            <h3 className="font-display text-[14px] font-semibold text-ink">Garden Zones</h3>
            <p className="text-[11px] text-ink-muted">{ZONES.length} zones monitored</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line">
        {ZONES.map((zone, i) => {
          const config = statusConfig[zone.status];
          return (
            <motion.div
              key={zone.id}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer p-4 transition-colors hover:bg-surface-2/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-ink">{zone.name}</p>
                    <span className={`h-2 w-2 rounded-full ${config.bg}`} />
                  </div>
                  <p className="text-[11px] text-ink-faint">{zone.plantCount} plants</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${config.color} ${config.bg}`}>
                  {zone.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                  <Drop size={10} className="text-blue-400" weight="fill" />
                  <span className="font-mono">{zone.moisture}%</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                  <Thermometer size={10} className="text-orange-400" weight="fill" />
                  <span className="font-mono">{zone.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-ink-muted">
                  <Sun size={10} className="text-amber-400" weight="fill" />
                  <span className="font-mono">{zone.lightHours}h</span>
                </div>
              </div>

              {/* Moisture bar */}
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  whileInView={{ width: `${zone.moisture}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${
                    zone.moisture >= 40 ? "bg-sensor-good" : zone.moisture >= 25 ? "bg-sensor-warn" : "bg-sensor-danger"
                  }`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});
