"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  TrendUp,
  TrendDown,
  Lightbulb,
  CurrencyCircleDollar,
  MapPin,
  ChartLineUp,
  Sparkle,
  TreeEvergreen,
} from "@phosphor-icons/react";
import type { PropertyItem } from "@/lib/property-types";

function fmtPrice(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)} L`;
  return `${(n / 1000).toFixed(0)}K`;
}

interface AIPropertyInsightsProps {
  properties: PropertyItem[];
}

export const AIPropertyInsights = memo(function AIPropertyInsights({ properties }: AIPropertyInsightsProps) {
  const reduce = useReducedMotion();

  if (properties.length === 0) return null;

  const avgPrice = properties.reduce((s, p) => s + p.price, 0) / properties.length;
  const avgAppreciation = properties.reduce((s, p) => s + p.appreciationRate, 0) / properties.length;
  const avgInvestment = properties.reduce((s, p) => s + p.investmentScore, 0) / properties.length;
  const undervalued = properties.filter((p) => p.estimatedPrice > p.price);
  const topPicks = [...properties].sort((a, b) => b.investmentScore - a.investmentScore).slice(0, 3);

  const bestArea = Object.entries(
    properties.reduce<Record<string, { count: number; avgScore: number }>>((acc, p) => {
      const city = p.location.city;
      if (!acc[city]) acc[city] = { count: 0, avgScore: 0 };
      acc[city].count++;
      acc[city].avgScore += p.investmentScore;
      return acc;
    }, {})
  ).sort((a, b) => b[1].avgScore / b[1].count - a[1].avgScore / a[1].count)[0];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border border-line bg-surface"
    >
      {/* Header */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent/10 text-accent">
            <Sparkle size={16} weight="fill" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-ink">AI Market Insights</h3>
            <p className="text-[10px] text-ink-faint">Powered by Karnataka property data</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<CurrencyCircleDollar size={14} />}
            label="Avg. Price"
            value={`₹${fmtPrice(avgPrice)}`}
            color="text-accent"
          />
          <StatCard
            icon={<TrendUp size={14} />}
            label="Avg. Appreciation"
            value={`+${avgAppreciation.toFixed(1)}%`}
            color="text-emerald-500"
          />
          <StatCard
            icon={<ChartLineUp size={14} />}
            label="Avg. Investment"
            value={`${avgInvestment.toFixed(0)}/100`}
            color="text-amber-500"
          />
          <StatCard
            icon={<Lightbulb size={14} />}
            label="Undervalued"
            value={`${undervalued.length} found`}
            color="text-purple-500"
          />
        </div>

        {/* AI Insights */}
        <div className="rounded-xl bg-accent/5 p-4">
          <h4 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-accent">
            <Lightbulb size={13} /> AI Recommendations
          </h4>
          <ul className="space-y-2">
            {bestArea && (
              <Insight text={`Best area to invest: ${bestArea[0]} — highest avg. investment score of ${(bestArea[1].avgScore / bestArea[1].count).toFixed(0)}/100`} />
            )}
            {undervalued.length > 0 && (
              <Insight text={`${undervalued.length} properties are undervalued by AI estimation — potential upside opportunity`} />
            )}
            <Insight text={`Karnataka real estate showing ${avgAppreciation > 8 ? "strong" : "steady"} growth at ${avgAppreciation.toFixed(1)}% avg. annual appreciation`} />
            {topPicks.length > 0 && (
              <Insight text={`Top investment picks: ${topPicks.map((p) => p.location.area).join(", ")}`} />
            )}
          </ul>
        </div>

        {/* Top picks */}
        <div>
          <h4 className="mb-2 text-[12px] font-semibold text-ink">Top Investment Picks</h4>
          <div className="space-y-2">
            {topPicks.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/30 px-3 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-[10px] font-bold text-accent">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-ink">{p.title}</p>
                  <p className="flex items-center gap-1 text-[10px] text-ink-muted">
                    <MapPin size={9} /> {p.location.area}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-semibold text-ink">₹{fmtPrice(p.price)}</p>
                  <p className="flex items-center gap-0.5 text-[10px] text-emerald-500">
                    <TrendUp size={9} /> +{p.appreciationRate}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2/30 p-3">
      <p className={`mb-1 flex items-center gap-1 text-[11px] font-medium ${color}`}>{icon} {label}</p>
      <p className="font-display text-[18px] font-bold text-ink">{value}</p>
    </div>
  );
}

function Insight({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-[11px] leading-relaxed text-ink">
      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent" />
      {text}
    </li>
  );
}
