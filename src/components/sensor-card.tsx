"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  icon: React.ReactNode;
  status: "good" | "warn" | "danger";
  trend?: "up" | "down" | "stable";
  history?: number[];
}

export const SensorCard = memo(function SensorCard({
  label,
  value,
  unit,
  min,
  max,
  icon,
  status,
  trend = "stable",
  history = [],
}: SensorCardProps) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const circumference = 2 * Math.PI * 45;
  const dashoffset = circumference - (pct / 100) * circumference;

  const statusColors = {
    good: "text-sensor-good",
    warn: "text-sensor-warn",
    danger: "text-sensor-danger",
  };

  const statusBg = {
    good: "bg-sensor-good/10",
    warn: "bg-sensor-warn/10",
    danger: "bg-sensor-danger/10",
  };

  const trendIcon = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hover-lift group relative overflow-hidden rounded-card border border-line bg-surface p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${statusBg[status]}`}>
            <span className={statusColors[status]}>{icon}</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
                {value}
              </span>
              <span className="font-mono text-sm text-ink-muted">{unit}</span>
              <span className={`font-mono text-xs ${statusColors[status]}`}>
                {trendIcon[trend]}
              </span>
            </div>
          </div>
        </div>

        {/* Circular gauge */}
        <div className="relative h-16 w-16">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-line"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={statusColors[status]}
              initial={reduce ? false : { strokeDasharray: circumference, strokeDashoffset: circumference }}
              whileInView={{ strokeDashoffset: dashoffset }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-mono text-xs font-medium text-ink-muted">
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Mini sparkline */}
      {history.length > 0 && (
        <div className="mt-4 flex items-end gap-[3px] h-8">
          {history.slice(-20).map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${statusColors[status]} bg-current opacity-30`}
              style={{ height: `${(h / max) * 100}%`, minHeight: 2 }}
            />
          ))}
        </div>
      )}

      {/* Range indicator */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-ink-faint">
        <span>{min}{unit}</span>
        <span>Optimal: {Math.round((min + max) * 0.4)}–{Math.round((min + max) * 0.6)}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  );
});
