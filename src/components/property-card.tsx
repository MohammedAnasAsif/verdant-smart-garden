"use client";

import { memo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  MapPin,
  Bed,
  Ruler,
  TrendUp,
  TrendDown,
  Heart,
  Star,
  Clock,
  BookmarkSimple,
  CurrencyCircleDollar,
  Towel,
} from "@phosphor-icons/react";
import type { PropertyItem } from "@/lib/property-types";

function fmtPrice(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
  return `${(n / 1000).toFixed(0)}K`;
}

function fmtArea(n: number): string {
  return n.toLocaleString("en-IN");
}

interface PropertyCardProps {
  property: PropertyItem;
  onSelect: (id: string) => void;
}

export const PropertyCard = memo(function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const p = property;

  const typeColor = p.type === "plot" || p.type === "farmhouse"
    ? "text-amber-500 bg-amber-500/10"
    : p.type === "villa"
      ? "text-purple-500 bg-purple-500/10"
      : "text-accent bg-accent-muted";

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:border-line-strong hover:shadow-lg"
    >
      {/* Image placeholder */}
      <div className="relative h-44 overflow-hidden bg-surface-2">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${typeColor}`}>
              {p.type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
            <p className="mt-2 font-display text-lg font-bold text-ink/80">{fmtPrice(p.price)}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {p.featured && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
              <Star size={10} weight="fill" /> Featured
            </span>
          )}
          {p.newListed && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
              <Clock size={10} /> New
            </span>
          )}
          {p.priceDrop && (
            <span className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              <TrendDown size={10} /> {p.priceDrop}% off
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className="pressable absolute top-3 right-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          aria-label={saved ? "Unsave" : "Save property"}
        >
          <BookmarkSimple size={14} weight={saved ? "fill" : "regular"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4" onClick={() => onSelect(p.id)}>
        <div className="cursor-pointer">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[14px] font-semibold leading-snug text-ink line-clamp-2">
              {p.title}
            </h3>
            <span className="shrink-0 rounded-lg bg-accent/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
              {p.investmentScore}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-ink-muted">
            <MapPin size={11} weight="fill" className="text-ink-faint" />
            <span className="truncate">{p.location.area}, {p.location.city}</span>
          </div>

          {/* Specs */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-muted">
            {p.bhk && (
              <span className="flex items-center gap-1">
                <Bed size={12} weight="bold" /> {p.bhk}
              </span>
            )}
            {p.bathrooms && (
              <span className="flex items-center gap-1">
                <Towel size={12} weight="bold" /> {p.bathrooms} Bath
              </span>
            )}
            <span className="flex items-center gap-1">
              <Ruler size={12} weight="bold" /> {fmtArea(p.area)} sq.ft
            </span>
            <span className="flex items-center gap-1">
              <CurrencyCircleDollar size={12} weight="bold" /> ₹{p.pricePerSqft.toLocaleString("en-IN")}/sq.ft
            </span>
          </div>

          {/* Price comparison */}
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <div>
              <p className="text-[10px] text-ink-faint">AI Estimated Value</p>
              <p className={`text-[13px] font-semibold ${p.estimatedPrice > p.price ? "text-emerald-500" : "text-red-400"}`}>
                ₹{fmtPrice(p.estimatedPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-faint">Annual Appreciation</p>
              <p className="flex items-center gap-1 text-[13px] font-semibold text-emerald-500">
                <TrendUp size={12} weight="bold" /> +{p.appreciationRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});
