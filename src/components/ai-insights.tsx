"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo } from "react";
import {
  Sparkle,
  ArrowRight,
  Warning,
  CheckCircle,
  Lightbulb,
} from "@phosphor-icons/react";

interface Insight {
  id: string;
  type: "alert" | "suggestion" | "positive" | "tip";
  title: string;
  description: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

const INSIGHTS: Insight[] = [
  {
    id: "1",
    type: "alert",
    title: "Soil Moisture Low in Zone 3",
    description: "Rose bushes showing signs of underwatering. Moisture at 28% — recommended threshold is 40%. AI suggests increasing watering frequency by 15%.",
    action: "Adjust Schedule",
    priority: "high",
  },
  {
    id: "2",
    type: "suggestion",
    title: "Optimal Harvest Window",
    description: "Tomato Row A approaching peak ripeness. Based on growth rate and Brix levels, harvest window opens in 2–3 days.",
    action: "View Details",
    priority: "medium",
  },
  {
    id: "3",
    type: "positive",
    title: "Herb Garden Thriving",
    description: "Basil and mint showing 23% above-average growth this week. Current conditions are ideal — no changes needed.",
    priority: "low",
  },
  {
    id: "4",
    type: "tip",
    title: "Companion Planting Opportunity",
    description: "AI detected that marigolds near Zone 1 could reduce aphid presence by ~40%. Consider adding to the vegetable patch.",
    action: "Learn More",
    priority: "medium",
  },
  {
    id: "5",
    type: "alert",
    title: "UV Index Spike Expected",
    description: "Tomorrow&apos;s UV index will reach 9.2. Suggest shade cloth for lettuce and delicate seedlings between 11 AM – 3 PM.",
    action: "Set Reminder",
    priority: "high",
  },
];

export const AIInsights = memo(function AIInsights() {
  const reduce = useReducedMotion();

  const typeConfig = {
    alert: { color: "text-sensor-danger", bg: "bg-sensor-danger/10", icon: <Warning size={16} weight="fill" /> },
    suggestion: { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Lightbulb size={16} weight="fill" /> },
    positive: { color: "text-sensor-good", bg: "bg-sensor-good/10", icon: <CheckCircle size={16} weight="fill" /> },
    tip: { color: "text-purple-400", bg: "bg-purple-400/10", icon: <Sparkle size={16} weight="fill" /> },
  };

  const priorityBorder = {
    high: "border-l-sensor-danger",
    medium: "border-l-sensor-warn",
    low: "border-l-sensor-good",
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
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/10">
            <Sparkle size={18} className="text-purple-400" weight="fill" />
          </div>
          <div>
            <h3 className="font-display text-[14px] font-semibold text-ink">AI Insights</h3>
            <p className="text-[11px] text-ink-muted">Smart recommendations for your garden</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-medium text-purple-400">
          <Sparkle size={12} weight="fill" />
          {INSIGHTS.length} new
        </span>
      </div>

      <div className="divide-y divide-line">
        {INSIGHTS.map((insight, i) => {
          const config = typeConfig[insight.type];
          return (
            <motion.div
              key={insight.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`border-l-2 ${priorityBorder[insight.priority]} px-5 py-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${config.bg} ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-ink">{insight.title}</p>
                    {insight.priority === "high" && (
                      <span className="shrink-0 rounded bg-sensor-danger/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-sensor-danger">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink-muted">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <button
                      type="button"
                      className="pressable mt-2 inline-flex items-center gap-1 cursor-pointer rounded-lg bg-surface-2 px-3 py-1.5 text-[11px] font-medium text-ink transition-colors hover:bg-line"
                    >
                      {insight.action}
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
});
