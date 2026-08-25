"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import {
  Sun,
  Drop,
  Thermometer,
  Leaf,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";

interface PlantCardProps {
  name: string;
  species: string;
  health: number;
  lastWatered: string;
  nextWatering: string;
  sunlight: "low" | "medium" | "high";
  temperature: number;
  image?: string;
  status: "thriving" | "healthy" | "needs-attention" | "critical";
  growthStage: "seedling" | "vegetative" | "flowering" | "fruiting";
}

export const PlantCard = memo(function PlantCard({
  name,
  species,
  health,
  lastWatered,
  nextWatering,
  sunlight,
  temperature,
  status,
  growthStage,
}: PlantCardProps) {
  const reduce = useReducedMotion();

  const statusConfig = {
    thriving: { color: "text-sensor-good", bg: "bg-sensor-good/10", label: "Thriving", icon: <TrendUp size={14} weight="bold" /> },
    healthy: { color: "text-accent", bg: "bg-accent-muted", label: "Healthy", icon: <Leaf size={14} weight="bold" /> },
    "needs-attention": { color: "text-sensor-warn", bg: "bg-sensor-warn/10", label: "Needs Care", icon: <Warning size={14} weight="bold" /> },
    critical: { color: "text-sensor-danger", bg: "bg-sensor-danger/10", label: "Critical", icon: <Warning size={14} weight="bold" /> },
  };

  const stageLabels = {
    seedling: "Seedling",
    vegetative: "Vegetative",
    flowering: "Flowering",
    fruiting: "Fruiting",
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hover-lift group relative overflow-hidden rounded-card border border-line bg-surface"
    >
      {/* Plant visual header */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-accent/5 to-accent/10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="sway text-7xl opacity-20">
            <Leaf size={80} weight="fill" className="text-accent" />
          </div>
        </div>
        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.color} ${config.bg}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
        {/* Growth stage */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-ink-muted backdrop-blur-sm">
            {stageLabels[growthStage]}
          </span>
        </div>
        {/* Health bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-line">
          <motion.div
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${health}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className={`h-full rounded-full ${
              health >= 80 ? "bg-sensor-good" : health >= 50 ? "bg-sensor-warn" : "bg-sensor-danger"
            }`}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-[15px] font-semibold text-ink">{name}</h3>
            <p className="text-[12px] text-ink-muted italic">{species}</p>
          </div>
          <div className="text-right">
            <span className="font-mono text-lg font-semibold text-ink">{health}%</span>
            <p className="text-[10px] text-ink-faint">Health</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-2">
            <Drop size={13} className="text-blue-400" weight="fill" />
            <div>
              <p className="text-[10px] text-ink-faint">Water</p>
              <p className="font-mono text-[11px] font-medium text-ink">{lastWatered}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-2">
            <Sun size={13} className="text-amber-400" weight="fill" />
            <div>
              <p className="text-[10px] text-ink-faint">Light</p>
              <p className="font-mono text-[11px] font-medium text-ink capitalize">{sunlight}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-2">
            <Thermometer size={13} className="text-orange-400" weight="fill" />
            <div>
              <p className="text-[10px] text-ink-faint">Temp</p>
              <p className="font-mono text-[11px] font-medium text-ink">{temperature}°C</p>
            </div>
          </div>
        </div>

        {/* Next watering */}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[11px] text-ink-muted">Next watering</span>
          <span className="font-mono text-[11px] font-medium text-accent">{nextWatering}</span>
        </div>
      </div>
    </motion.div>
  );
});
