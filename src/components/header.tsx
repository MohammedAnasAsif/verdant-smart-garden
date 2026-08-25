"use client";

import { memo } from "react";
import {
  MagnifyingGlass,
  X,
  MapPin,
  BookmarkSimple,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { CITIES } from "@/lib/types";
import type { City } from "@/lib/types";
import { useFeed, useSaved } from "@/components/feed-provider";
import { useTheme } from "@/lib/use-theme";

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 pressable" aria-label="Pulse home">
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-line-strong" />
        <span className="pulse-dot h-2 w-2 rounded-full bg-accent text-accent" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">pulse</span>
    </a>
  );
}

const CitySelect = memo(function CitySelect() {
  const city = useFeed((s) => s.filters.city);
  const setFilter = useFeed((s) => s.setFilter);

  return (
    <label className="relative flex items-center">
      <span className="sr-only">Filter by city</span>
      <MapPin
        size={14}
        weight="bold"
        aria-hidden
        className="pointer-events-none absolute left-3 text-ink-faint"
      />
      <select
        value={city}
        onChange={(e) => setFilter("city", e.target.value as City | "everywhere")}
        className="h-9 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-8 pr-7 text-[13px] font-medium text-ink transition-colors hover:border-line-strong focus-visible:outline-2"
      >
        <option value="everywhere">Everywhere</option>
        {CITIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 h-1 w-1 rounded-full bg-ink-faint [clip-path:polygon(0_0,100%_0,50%_100%)]"
      />
    </label>
  );
});

function SearchField() {
  const query = useFeed((s) => s.filters.query);
  const setFilter = useFeed((s) => s.setFilter);

  return (
    <div className="relative hidden min-w-0 flex-1 items-center sm:flex sm:max-w-md">
      <MagnifyingGlass
        size={16}
        weight="bold"
        aria-hidden
        className="pointer-events-none absolute left-3.5 text-ink-faint"
      />
      <input
        type="search"
        value={query}
        maxLength={80}
        autoComplete="off"
        onChange={(e) => setFilter("query", e.target.value)}
        placeholder="Search events, venues, vibes"
        aria-label="Search events"
        className="h-9 w-full rounded-full border border-line bg-surface pl-10 pr-9 text-[13px] text-ink placeholder:text-ink-faint transition-colors hover:border-line-strong focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {query.length > 0 && (
        <button
          type="button"
          onClick={() => setFilter("query", "")}
          aria-label="Clear search"
          className="pressable absolute right-2 grid h-6 w-6 cursor-pointer place-items-center rounded-full text-ink-muted hover:bg-surface-2"
        >
          <X size={12} weight="bold" />
        </button>
      )}
    </div>
  );
}

function ConnectionBadge() {
  const status = useFeed((s) => s.status);
  const label = status === "live" ? "Live" : "Reconnecting";
  const on = status === "live";
  return (
    <span
      role="status"
      aria-live="polite"
      className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted md:flex"
      title={`Real-time feed: ${label.toLowerCase()}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${on ? "pulse-dot bg-accent text-accent" : "bg-ink-faint"}`}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function Header() {
  const { theme, toggle } = useTheme();
  const savedCount = useSaved((s) => Object.keys(s.saved).length);
  const mounted = typeof window !== "undefined";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Logo />
        <SearchField />
        <div className="ml-auto flex items-center gap-2">
          <ConnectionBadge />
          <CitySelect />
          <button
            type="button"
            aria-label={`${savedCount > 0 ? `${mounted ? savedCount : 0} saved events` : "No saved events yet"} — open saved`}
            className="pressable relative grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-strong"
          >
            <BookmarkSimple size={15} weight={savedCount > 0 ? "fill" : "regular"} />
            {mounted && savedCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-on-accent">
                {savedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="pressable grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-line-strong"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
