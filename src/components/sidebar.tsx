"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo, useState } from "react";
import {
  TreeEvergreen,
  ChartLineUp,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  House,
  FlowerLotus,
  CalendarBlank,
  Gear,
} from "@phosphor-icons/react";

type NavSection = "dashboard" | "plants" | "schedule" | "analytics" | "settings";

interface SidebarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

const NAV_ITEMS: { key: NavSection; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <House size={18} /> },
  { key: "plants", label: "My Plants", icon: <FlowerLotus size={18} /> },
  { key: "schedule", label: "Schedule", icon: <CalendarBlank size={18} /> },
  { key: "analytics", label: "Analytics", icon: <ChartLineUp size={18} /> },
  { key: "settings", label: "Settings", icon: <Gear size={18} /> },
];

export const Sidebar = memo(function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={reduce ? false : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`hidden lg:flex flex-col shrink-0 border-r border-line bg-surface transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[220px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-on-accent">
          <TreeEvergreen size={18} weight="fill" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-display text-[15px] font-bold text-ink">Verdant</h1>
            <p className="text-[10px] text-ink-faint">AI Smart Garden</p>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-line bg-surface-2 py-1.5 pl-8 pr-2 text-[11px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2">
        <div className={`text-[9px] font-semibold uppercase tracking-wider text-ink-faint ${collapsed ? "text-center" : "px-2"} mb-1.5`}>
          {collapsed ? "—" : "Navigation"}
        </div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`pressable w-full cursor-pointer flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[12px] font-medium transition-colors ${
              activeSection === item.key
                ? "bg-accent-muted text-accent"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="pressable flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2 text-[11px] text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
        >
          {collapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
});
