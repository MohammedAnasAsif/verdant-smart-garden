"use client";

import { memo } from "react";
import { EVENT_CATEGORIES } from "@/lib/types";
import type { EventCategory, EventFilters } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/present";
import { useFeed } from "@/components/feed-provider";

const DATE_TABS: { value: EventFilters["date"]; label: string }[] = [
  { value: "all", label: "Any day" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "weekend", label: "Weekend" },
  { value: "week", label: "This week" },
];

const SORT_TABS: { value: EventFilters["sort"]; label: string }[] = [
  { value: "soonest", label: "Starting soon" },
  { value: "trending", label: "Trending" },
  { value: "popular", label: "Popular" },
];

export const FilterBar = memo(function FilterBar() {
  const filters = useFeed((s) => s.filters);
  const setFilter = useFeed((s) => s.setFilter);
  const reset = useFeed((s) => s.resetFilters);

  return (
    <div
      id="feed"
      className="sticky top-16 z-30 border-y border-line bg-bg/85 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="rail-scroll flex items-center gap-2 overflow-x-auto py-3">
          <CategoryPills active={filters.category} onSelect={(c) => setFilter("category", c)} />
        </div>
        <div className="rail-scroll flex items-center gap-4 overflow-x-auto pb-3">
          {/* date segmented control */}
          <div role="tablist" aria-label="Date filter" className="flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5">
            {DATE_TABS.map((t) => (
              <button
                key={t.value}
                role="tab"
                aria-selected={filters.date === t.value}
                onClick={() => setFilter("date", t.value)}
                className={`pressable h-7 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                  filters.date === t.value
                    ? "bg-ink text-bg"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* price */}
          <div role="group" aria-label="Price filter" className="flex shrink-0 items-center rounded-full border border-line bg-surface p-0.5">
            {(["all", "free", "paid"] as const).map((p) => (
              <button
                key={p}
                aria-pressed={filters.price === p}
                onClick={() => setFilter("price", p)}
                className={`pressable h-7 cursor-pointer rounded-full px-3 text-xs font-medium capitalize transition-colors ${
                  filters.price === p ? "bg-ink text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {p === "all" ? "Any price" : p}
              </button>
            ))}
          </div>

          {/* sort */}
          <label className="ml-auto flex shrink-0 items-center gap-2 text-xs text-ink-muted">
            Sort
            <select
              value={filters.sort}
              onChange={(e) => setFilter("sort", e.target.value as EventFilters["sort"])}
              className="h-8 cursor-pointer rounded-full border border-line bg-surface px-3 pr-6 text-xs font-medium text-ink hover:border-line-strong"
              aria-label="Sort events"
            >
              {SORT_TABS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <ResetButton dirty={hasDirty(filters)} onReset={reset} />
        </div>
      </div>
    </div>
  );
});

function hasDirty(f: EventFilters): boolean {
  return (
    f.query !== "" ||
    f.category !== "all" ||
    f.date !== "all" ||
    f.price !== "all" ||
    f.city !== "everywhere" ||
    f.sort !== "soonest"
  );
}

function ResetButton({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  if (!dirty) return null;
  return (
    <button
      type="button"
      onClick={onReset}
      className="pressable shrink-0 cursor-pointer rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-accent hover:border-accent"
    >
      Reset all
    </button>
  );
}

const CategoryPills = memo(function CategoryPills({
  active,
  onSelect,
}: {
  active: EventCategory | "all";
  onSelect: (c: EventCategory | "all") => void;
}) {
  return (
    <>
      <button
        aria-pressed={active === "all"}
        onClick={() => onSelect("all")}
        className={`pressable h-8 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors ${
          active === "all"
            ? "bg-accent text-on-accent"
            : "border border-line bg-surface text-ink hover:border-line-strong"
        }`}
      >
        All
      </button>
      {EVENT_CATEGORIES.map((c) => (
        <button
          key={c}
          aria-pressed={active === c}
          onClick={() => onSelect(c)}
          className={`pressable h-8 shrink-0 cursor-pointer rounded-full px-3.5 text-[13px] font-medium transition-colors ${
            active === c
              ? "bg-accent text-on-accent"
              : "border border-line bg-surface text-ink hover:border-line-strong"
          }`}
        >
          {CATEGORY_LABEL[c]}
        </button>
      ))}
    </>
  );
});
