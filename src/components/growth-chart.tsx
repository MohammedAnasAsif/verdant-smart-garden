"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react";

interface DataPoint {
  day: string;
  value: number;
}

interface GrowthChartProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  color: string;
  trend: "up" | "down";
  trendValue: string;
  currentValue: string;
}

export const GrowthChart = memo(function GrowthChart({
  title,
  subtitle,
  data,
  color,
  trend,
  trendValue,
  currentValue,
}: GrowthChartProps) {
  const reduce = useReducedMotion();

  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;

  const width = 300;
  const height = 80;
  const padding = 4;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (d.value - min) / range) * (height - padding * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-card border border-line bg-surface p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-[14px] font-semibold text-ink">{title}</h3>
          <p className="text-[11px] text-ink-muted">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xl font-semibold text-ink">{currentValue}</p>
          <span className={`flex items-center gap-0.5 text-[11px] font-medium ${
            trend === "up" ? "text-sensor-good" : "text-sensor-danger"
          }`}>
            {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trendValue}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={areaD}
            fill={`url(#grad-${title})`}
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Last point dot */}
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={color}
          />
        </svg>
      </div>

      {/* Day labels */}
      <div className="mt-1 flex justify-between text-[9px] font-mono text-ink-faint">
        <span>{data[0].day}</span>
        <span>{data[Math.floor(data.length / 2)].day}</span>
        <span>{data[data.length - 1].day}</span>
      </div>
    </motion.div>
  );
});
