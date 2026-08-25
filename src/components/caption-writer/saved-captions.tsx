"use client";

import { useCaptionStore } from "@/lib/caption-store";
import { BookmarkSimple, Trash, Copy, Check } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

export function SavedCaptions() {
  const { savedCaptions, removeSavedCaption } = useCaptionStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (caption: (typeof savedCaptions)[0]) => {
    const fullText = caption.hashtags.length
      ? `${caption.text}\n\n${caption.hashtags.map((h) => `#${h}`).join(" ")}`
      : caption.text;
    await navigator.clipboard.writeText(fullText);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (savedCaptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line p-12 text-center">
        <BookmarkSimple size={28} weight="light" className="mx-auto mb-3 text-ink-faint" />
        <p className="text-sm text-ink-muted">No saved captions yet</p>
        <p className="mt-1 text-[12px] text-ink-faint">
          Click Save on any caption to add it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">
          Saved ({savedCaptions.length})
        </h3>
      </div>
      <AnimatePresence mode="popLayout">
        {savedCaptions.map((cap) => (
          <motion.div
            key={cap.id}
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                {cap.tone}
              </span>
              <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
                {cap.platform}
              </span>
              {cap.abVariant && (
                <span className="inline-flex items-center rounded-md bg-accent-muted px-2 py-0.5 text-[10px] font-medium text-accent">
                  Variant {cap.abVariant}
                </span>
              )}
              <span className="ml-auto font-mono text-[10px] text-ink-faint">
                {cap.charCount}
              </span>
            </div>
            <p className="whitespace-pre-line text-[13px] text-ink leading-relaxed line-clamp-4">
              {cap.text}
            </p>
            {cap.hashtags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {cap.hashtags.map((h) => (
                  <span key={h} className="text-[11px] text-accent/70">#{h}</span>
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5">
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
                onClick={() => removeSavedCaption(cap.id)}
                className="pressable flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-faint hover:border-danger/30 hover:bg-danger/5 hover:text-danger"
              >
                <Trash size={11} />
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
