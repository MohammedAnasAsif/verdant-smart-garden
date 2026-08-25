"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo, useState } from "react";
import {
  Bell,
  Moon,
  Sun,
  User,
  TreeEvergreen,
  List,
  MagnifyingGlass,
} from "@phosphor-icons/react";

interface GardenHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const GardenHeader = memo(function GardenHeader({ isDark, onToggleTheme }: GardenHeaderProps) {
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur-xl sm:px-6"
    >
      {/* Mobile logo */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-on-accent">
          <TreeEvergreen size={16} weight="fill" />
        </div>
        <span className="font-display text-[14px] font-bold text-ink">Verdant</span>
      </div>

      {/* Desktop: page context */}
      <div className="hidden lg:flex items-center gap-4">
        <h2 className="font-display text-[16px] font-semibold text-ink">Dashboard</h2>
        <span className="rounded-full bg-accent-muted px-2.5 py-1 text-[10px] font-semibold text-accent">
          <span className="pulse-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent text-accent" aria-hidden />
          All systems online
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="pressable hidden sm:grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-surface-2 text-ink-muted transition-colors hover:bg-line hover:text-ink"
          aria-label="Search"
        >
          <MagnifyingGlass size={15} />
        </button>
        <button
          type="button"
          className="pressable relative hidden sm:grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-surface-2 text-ink-muted transition-colors hover:bg-line hover:text-ink"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="pressable hidden sm:grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-surface-2 text-ink-muted transition-colors hover:bg-line hover:text-ink"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <div className="ml-1 hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted text-accent">
          <User size={15} weight="fill" />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="pressable sm:hidden grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-surface-2 text-ink-muted"
          aria-label="Menu"
        >
          <List size={15} />
        </button>
      </div>
    </motion.header>
  );
});
