"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TreeEvergreen } from "@phosphor-icons/react";
import type { PropertyFilters as PF, PropertyItem } from "@/lib/property-types";
import { PROPERTIES, searchProperties } from "@/lib/property-data";
import { PropertyCard } from "@/components/property-card";
import { PropertyFiltersBar } from "@/components/property-filters";
import { PropertyModal } from "@/components/property-modal";
import { AIPropertyInsights } from "@/components/ai-property-insights";

const DEFAULT_FILTERS: PF = {
  query: "",
  type: "all",
  status: "all",
  priceRange: "all",
  areaRange: "all",
  bhk: "all",
  city: "all",
  sort: "investment",
};

function applyFilters(props: PropertyItem[], filters: PF): PropertyItem[] {
  let result = [...props];

  if (filters.query) {
    result = searchProperties(filters.query, result);
  }

  if (filters.type !== "all") {
    result = result.filter((p) => p.type === filters.type);
  }

  if (filters.bhk !== "all") {
    result = result.filter((p) => p.bhk === filters.bhk);
  }

  if (filters.city !== "all") {
    result = result.filter((p) => p.location.area === filters.city || p.location.city === filters.city);
  }

  if (filters.priceRange !== "all") {
    const ranges: Record<string, [number, number]> = {
      "under-50l": [0, 5000000],
      "50l-1cr": [5000000, 10000000],
      "1cr-2cr": [10000000, 20000000],
      "2cr-5cr": [20000000, 50000000],
      "above-5cr": [50000000, Infinity],
    };
    const [min, max] = ranges[filters.priceRange] || [0, Infinity];
    result = result.filter((p) => p.price >= min && p.price < max);
  }

  if (filters.areaRange !== "all") {
    const ranges: Record<string, [number, number]> = {
      "under-1000": [0, 1000],
      "1000-2000": [1000, 2000],
      "2000-3000": [2000, 3000],
      "above-3000": [3000, Infinity],
    };
    const [min, max] = ranges[filters.areaRange] || [0, Infinity];
    result = result.filter((p) => p.area >= min && p.area < max);
  }

  switch (filters.sort) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case "investment":
    default:
      result.sort((a, b) => b.investmentScore - a.investmentScore);
      break;
  }

  return result;
}

export function PropertyFinderPage() {
  const reduce = useReducedMotion();
  const [filters, setFilters] = useState<PF>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => applyFilters(PROPERTIES, filters), [filters]);
  const selected = useMemo(() => PROPERTIES.find((p) => p.id === selectedId) || null, [selectedId]);

  const handleUpdate = useCallback((updates: Partial<PF>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-line bg-surface p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-on-accent">
            <TreeEvergreen size={20} weight="fill" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">AI Property Finder</h1>
            <p className="text-[12px] text-ink-muted">Find homes & building lands across Karnataka</p>
          </div>
        </div>
        <PropertyFiltersBar filters={filters} onUpdate={handleUpdate} resultCount={filtered.length} />
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Property grid */}
        <div>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-20 text-center"
            >
              <TreeEvergreen size={40} weight="light" className="mb-3 text-ink-faint" />
              <p className="text-[14px] font-medium text-ink-muted">No properties match your search</p>
              <p className="mt-1 text-[12px] text-ink-faint">Try adjusting your filters or search terms</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} onSelect={setSelectedId} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar insights */}
        <div className="space-y-4">
          <AIPropertyInsights properties={filtered} />
        </div>
      </div>

      {/* Modal */}
      <PropertyModal property={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
