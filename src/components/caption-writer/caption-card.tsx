"use client";

import { useCaptionStore } from "@/lib/caption-store";
import type { GeneratedCaption } from "@/lib/caption-types";
import { Check, Copy, Pencil, Bookmark, Star } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export function CaptionCard({ caption }: { caption: GeneratedCaption }) {
  const {
    editingId,
    editingText,
    startEditing,
    updateEditingText,
    saveEdit,
    cancelEdit,
    saveCaption,
    removeSavedCaption,
    savedCaptions,
  } = useCaptionStore();

  const [copied, setCopied] = useState(false);
  const isEditing = editingId === caption.id;
  const isSaved = savedCaptions.some((c) => c.id === caption.id);

  const handleCopy = useCallback(async () => {
    const fullText = caption.hashtags.length
      ? `${caption.text}\n\n${caption.hashtags.map((h) => `#${h}`).join(" ")}`
      : caption.text;
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [caption]);

  const handleSave = useCallback(() => {
    if (isSaved) {
      removeSavedCaption(caption.id);
    } else {
      saveCaption(caption);
    }
  }, [isSaved, caption, saveCaption, removeSavedCaption]);

  const toneColors: Record<string, string> = {
    Professional: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Casual: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Humorous: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Inspirational: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Urgent: "bg-red-500/10 text-red-400 border-red-500/20",
    Friendly: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Bold: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Educational: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Witty: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Empathetic: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="group relative rounded-[var(--radius-card)] border border-line bg-surface p-5 hover-lift"
    >
      {/* Header tags */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
            toneColors[caption.tone] || "bg-surface-2 text-ink-muted border-line"
          }`}
        >
          {caption.tone}
        </span>
        <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
          {caption.style}
        </span>
        <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
          {caption.platform}
        </span>
        <span className="ml-auto text-[11px] font-mono text-ink-faint">
          {caption.charCount} chars
        </span>
      </div>

      {/* Caption text */}
      {isEditing ? (
        <textarea
          value={editingText}
          onChange={(e) => updateEditingText(e.target.value)}
          rows={6}
          className="w-full rounded-xl border border-accent bg-surface-2 px-3 py-2.5 text-sm text-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none font-[inherit]"
          autoFocus
        />
      ) : (
        <p className="whitespace-pre-line text-sm text-ink leading-relaxed">
          {caption.text}
        </p>
      )}

      {/* Hashtags */}
      {caption.hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {caption.hashtags.map((h) => (
            <span
              key={h}
              className="text-[12px] font-medium text-accent/80"
            >
              #{h}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              className="pressable flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-medium text-on-accent hover:bg-accent-hover"
            >
              <Check size={13} weight="bold" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="pressable flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleCopy}
              className="pressable flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5 text-emerald-500"
                  >
                    <Check size={13} weight="bold" />
                    Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => startEditing(caption.id, caption.text)}
              className="pressable flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              onClick={handleSave}
              className={`pressable flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isSaved
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-line text-ink-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {isSaved ? (
                <Star size={13} weight="fill" />
              ) : (
                <Bookmark size={13} />
              )}
              {isSaved ? "Saved" : "Save"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
