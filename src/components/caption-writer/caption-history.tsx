"use client";

import { useCaptionStore } from "@/lib/caption-store";
import { Clock, Trash, Copy, Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";

export function CaptionHistory() {
  const { history, removeFromHistory, clearHistory } = useCaptionStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter(
      (c) =>
        c.text.toLowerCase().includes(q) ||
        c.tone.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q) ||
        c.hashtags.some((h) => h.toLowerCase().includes(q))
    );
  }, [history, search]);

  const handleCopy = useCallback(async (cap: (typeof history)[0]) => {
    const fullText = cap.hashtags.length
      ? `${cap.text}\n\n${cap.hashtags.map((h) => `#${h}`).join(" ")}`
      : cap.text;
    await navigator.clipboard.writeText(fullText);
    setCopiedId(cap.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-12 text-center">
        <Clock size={28} weight="light" className="mx-auto mb-3 text-ink-faint" />
        <p className="text-sm text-ink-muted">No history yet</p>
        <p className="mt-1 text-[12px] text-ink-faint">
          Generated captions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">
          History ({history.length})
        </h3>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="pressable flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-faint hover:bg-surface-2 hover:text-ink-muted"
            >
              <Trash size={11} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history..."
          className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((cap) => (
          <motion.div
            key={cap.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                {cap.tone}
              </span>
              <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                {cap.platform}
              </span>
              {cap.language !== "English" && (
                <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                  {cap.language}
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] text-ink-faint">
                {new Date(cap.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <p className="whitespace-pre-line text-[13px] text-ink leading-relaxed line-clamp-3">
              {cap.text}
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 border-t border-line pt-2.5">
              <button
                onClick={() => handleCopy(cap)}
                className="pressable flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-muted hover:bg-surface-2"
              >
                {copiedId === cap.id ? (
                  <Check size={11} className="text-success" />
                ) : (
                  <Copy size={11} />
                )}
                {copiedId === cap.id ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => removeFromHistory(cap.id)}
                className="pressable flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-faint hover:bg-surface-2 hover:text-ink-muted"
              >
                <Trash size={11} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {filtered.length === 0 && search && (
        <p className="py-8 text-center text-sm text-ink-faint">
          No results for &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
