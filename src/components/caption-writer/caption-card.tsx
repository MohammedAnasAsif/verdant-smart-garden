"use client";

import { useCaptionStore } from "@/lib/caption-store";
import type { GeneratedCaption } from "@/lib/caption-types";
import { Check, Copy, Pencil, Bookmark, Star, ArrowsLeftRight } from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CharCounter } from "./char-counter";

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

  const variantBadge =
    caption.abVariant === "A"
      ? { label: "Variant A", cls: "bg-blue-50 text-blue-600 border-blue-200" }
      : caption.abVariant === "B"
      ? { label: "Variant B", cls: "bg-purple-50 text-purple-600 border-purple-200" }
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="group rounded-xl border border-line bg-surface p-5 hover-lift"
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        {variantBadge && (
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${variantBadge.cls}`}>
            <ArrowsLeftRight size={10} />
            {variantBadge.label}
          </span>
        )}
        <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
          {caption.tone}
        </span>
        <span className="inline-flex items-center rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-faint">
          {caption.style}
        </span>
        <div className="ml-auto">
          <CharCounter current={caption.charCount} platform={caption.platform} />
        </div>
      </div>

      {/* Caption text */}
      {isEditing ? (
        <textarea
          value={editingText}
          onChange={(e) => updateEditingText(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-accent bg-surface-2 px-3 py-2.5 text-sm text-ink leading-relaxed focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none font-[inherit]"
          autoFocus
        />
      ) : (
        <p className="whitespace-pre-line text-[13px] text-ink leading-relaxed">
          {caption.text}
        </p>
      )}

      {/* Hashtags */}
      {caption.hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {caption.hashtags.map((h) => (
            <span key={h} className="rounded-md bg-accent-muted px-2 py-0.5 text-[11px] font-medium text-accent">
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
              <Check size={12} weight="bold" />
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
                    className="flex items-center gap-1.5 text-success"
                  >
                    <Check size={12} weight="bold" />
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
                    <Copy size={12} />
                    Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => startEditing(caption.id, caption.text)}
              className="pressable flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              onClick={handleSave}
              className={`pressable flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                isSaved
                  ? "border-accent/30 bg-accent-muted text-accent"
                  : "border-line text-ink-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {isSaved ? (
                <Star size={12} weight="fill" />
              ) : (
                <Bookmark size={12} />
              )}
              {isSaved ? "Saved" : "Save"}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
