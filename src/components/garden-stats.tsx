"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import {
  TreeEvergreen,
  ChartLineUp,
  Drop,
  Thermometer,
  WifiHigh,
  BatteryFull,
} from "@phosphor-icons/react";

interface GardenStatsProps {
  totalPlants: number;
  healthyPlants: number;
  waterSaved: string;
  co2Absorbed: string;
  sensorUptime: string;
  batteryLevel: number;
}

export const GardenStats = memo(function GardenStats({
  totalPlants,
  healthyPlants,
  waterSaved,
  co2Absorbed,
  sensorUptime,
  batteryLevel,
}: GardenStatsProps) {
  const reduce = useReducedMotion();

  const stats = [
    {
      icon: <TreeEvergreen size={20} weight="fill" />,
      label: "Total Plants",
      value: totalPlants,
      color: "text-accent",
      bg: "bg-accent-muted",
    },
    {
      icon: <ChartLineUp size={20} weight="bold" />,
      label: "Healthy",
      value: `${Math.round((healthyPlants / totalPlants) * 100)}%`,
      color: "text-sensor-good",
      bg: "bg-sensor-good/10",
    },
    {
      icon: <Drop size={20} weight="fill" />,
      label: "Water Saved",
      value: waterSaved,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      icon: <Thermometer size={20} weight="fill" />,
      label: "CO₂ Absorbed",
      value: co2Absorbed,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-center gap-3 px-5 py-4 ${
              i < stats.length - 1 ? "border-r border-line" : ""
            } ${i < 2 ? "border-b sm:border-b-0 border-line" : ""}`}
          >
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${stat.bg}`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <p className="font-mono text-xl font-semibold tabular-nums text-ink">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-ink-faint">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-line px-5 py-2.5">
        <div className="flex items-center gap-4 text-[11px] text-ink-faint">
          <span className="flex items-center gap-1.5">
            <WifiHigh size={12} className="text-accent" weight="fill" />
            {sensorUptime} uptime
          </span>
          <span className="flex items-center gap-1.5">
            <BatteryFull size={12} className={batteryLevel > 20 ? "text-accent" : "text-sensor-danger"} weight="fill" />
            {batteryLevel}% battery
          </span>
        </div>
        <span className="text-[10px] text-ink-faint">All sensors online</span>
      </div>
    </motion.div>
  );
});
