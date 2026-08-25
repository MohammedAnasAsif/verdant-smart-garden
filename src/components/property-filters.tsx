"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import type { PropertyFilters as PF } from "@/lib/property-types";
import { ALL_CITIES } from "@/lib/property-data";

interface PropertyFiltersProps {
  filters: PF;
  onUpdate: (updates: Partial<PF>) => void;
  resultCount: number;
}

export const PropertyFiltersBar = memo(function PropertyFiltersBar({ filters, onUpdate, resultCount }: PropertyFiltersProps) {
  const reduce = useReducedMotion();
  const hasFilters = filters.type !== "all" || filters.priceRange !== "all" || filters.city !== "all" || filters.bhk !== "all";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      {/* Search bar */}
      <div className="relative">
        <MagnifyingGlass size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => onUpdate({ query: e.target.value })}
          placeholder='Search "3BHK near Whitefield under 50L" or "plot in Mysuru"...'
          className="w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-[13px] text-ink placeholder:text-ink-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
        />
        {filters.query && (
          <button type="button" onClick={() => onUpdate({ query: "" })}
            className="pressable absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 cursor-pointer place-items-center rounded-full bg-surface-2 text-ink-faint hover:text-ink">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-[11px] font-medium text-ink-muted">
          <SlidersHorizontal size={12} /> Filters:
        </span>

        <Select
          value={filters.type}
          onChange={(v) => onUpdate({ type: v as PF["type"] })}
          options={[
            { value: "all", label: "All Types" },
            { value: "apartment", label: "Apartment" },
            { value: "independent-house", label: "House" },
            { value: "villa", label: "Villa" },
            { value: "plot", label: "Plot" },
            { value: "farmhouse", label: "Farmhouse" },
          ]}
        />

        <Select
          value={filters.bhk}
          onChange={(v) => onUpdate({ bhk: v as PF["bhk"] })}
          options={[
            { value: "all", label: "Any BHK" },
            { value: "1 BHK", label: "1 BHK" },
            { value: "2 BHK", label: "2 BHK" },
            { value: "3 BHK", label: "3 BHK" },
            { value: "4 BHK", label: "4 BHK" },
            { value: "5+ BHK", label: "5+ BHK" },
          ]}
        />

        <Select
          value={filters.priceRange}
          onChange={(v) => onUpdate({ priceRange: v as PF["priceRange"] })}
          options={[
            { value: "all", label: "Any Price" },
            { value: "under-50l", label: "Under 50L" },
            { value: "50l-1cr", label: "50L - 1Cr" },
            { value: "1cr-2cr", label: "1Cr - 2Cr" },
            { value: "2cr-5cr", label: "2Cr - 5Cr" },
            { value: "above-5cr", label: "Above 5Cr" },
          ]}
        />

        <Select
          value={filters.city}
          onChange={(v) => onUpdate({ city: v })}
          options={[
            { value: "all", label: "All Karnataka" },
            ...ALL_CITIES.slice(0, 15).map((c) => ({ value: c, label: c })),
          ]}
        />

        <Select
          value={filters.sort}
          onChange={(v) => onUpdate({ sort: v as PF["sort"] })}
          options={[
            { value: "investment", label: "Best Investment" },
            { value: "price-low", label: "Price: Low → High" },
            { value: "price-high", label: "Price: High → Low" },
            { value: "newest", label: "Newest First" },
          ]}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={() => onUpdate({ type: "all", priceRange: "all", city: "all", bhk: "all", query: "", status: "all" })}
            className="pressable flex cursor-pointer items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-500 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
          >
            <X size={10} /> Clear
          </button>
        )}

        <span className="ml-auto text-[11px] text-ink-faint">
          {resultCount} {resultCount === 1 ? "property" : "properties"}
        </span>
      </div>
    </motion.div>
  );
});

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pressable cursor-pointer appearance-none rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:border-line-strong focus:border-accent focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
