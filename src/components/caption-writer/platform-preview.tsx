"use client";

import type { GeneratedCaption } from "@/lib/caption-types";
import { X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

interface PlatformPreviewProps {
  caption: GeneratedCaption;
  onClose: () => void;
}

function InstagramPreview({ caption }: { caption: GeneratedCaption }) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden max-w-[380px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-line">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
        <div>
          <p className="text-[12px] font-semibold text-ink">your_username</p>
          <p className="text-[10px] text-ink-faint">Sponsored</p>
        </div>
        <button className="ml-auto text-[11px] font-semibold text-accent">Follow</button>
      </div>

      {/* Image placeholder */}
      <div className="aspect-square bg-surface-2 flex items-center justify-center">
        <p className="text-[11px] text-ink-faint">[Your image here]</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3 py-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
      </div>

      {/* Caption */}
      <div className="px-3 pb-3">
        <p className="text-[12px] text-ink">
          <span className="font-semibold">your_username</span>{" "}
          <span className="whitespace-pre-line">{caption.text}</span>
        </p>
        {caption.hashtags.length > 0 && (
          <p className="mt-1 text-[12px] text-accent/70">
            {caption.hashtags.map((h) => `#${h}`).join(" ")}
          </p>
        )}
        <p className="mt-2 text-[10px] text-ink-faint uppercase">View all comments</p>
      </div>
    </div>
  );
}

function TwitterPreview({ caption }: { caption: GeneratedCaption }) {
  const text = caption.text.length > 280 ? caption.text.slice(0, 277) + "..." : caption.text;
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden max-w-[380px] mx-auto p-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-accent" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-bold text-ink">You</span>
            <span className="text-[13px] text-ink-faint">@yourhandle · now</span>
          </div>
          <p className="mt-1 whitespace-pre-line text-[13px] text-ink leading-relaxed">{text}</p>
          {caption.hashtags.length > 0 && (
            <p className="mt-1 text-[13px] text-accent">
              {caption.hashtags.map((h) => `#${h}`).join(" ")}
            </p>
          )}
          <div className="mt-3 flex items-center gap-8 text-ink-faint">
            <span className="flex items-center gap-1 text-[12px]">💬 0</span>
            <span className="flex items-center gap-1 text-[12px]">🔁 0</span>
            <span className="flex items-center gap-1 text-[12px]">❤️ 0</span>
            <span className="flex items-center gap-1 text-[12px]">📊 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({ caption }: { caption: GeneratedCaption }) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden max-w-[380px] mx-auto">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="h-12 w-12 shrink-0 rounded-full bg-blue-600" />
          <div>
            <p className="text-[13px] font-semibold text-ink">Your Name</p>
            <p className="text-[11px] text-ink-faint">Title · Company · 1st</p>
            <p className="text-[10px] text-ink-faint">Just now · 🌐</p>
          </div>
        </div>
        <p className="mt-3 whitespace-pre-line text-[13px] text-ink leading-relaxed line-clamp-6">
          {caption.text}
        </p>
        {caption.hashtags.length > 0 && (
          <p className="mt-2 text-[12px] text-accent">
            {caption.hashtags.map((h) => `#${h}`).join(" ")}
          </p>
        )}
      </div>
      <div className="flex border-t border-line">
        <button className="flex-1 py-2.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2">👍 Like</button>
        <button className="flex-1 py-2.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2">💬 Comment</button>
        <button className="flex-1 py-2.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2">🔁 Repost</button>
        <button className="flex-1 py-2.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2">Send</button>
      </div>
    </div>
  );
}

function TikTokPreview({ caption }: { caption: GeneratedCaption }) {
  return (
    <div className="rounded-xl border border-line bg-black overflow-hidden max-w-[240px] mx-auto aspect-[9/16] relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-[11px] text-white/40">[Video preview]</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-[12px] font-semibold text-white">@yourusername</p>
        <p className="mt-1 text-[11px] text-white/90 line-clamp-3 whitespace-pre-line">{caption.text}</p>
        {caption.hashtags.length > 0 && (
          <p className="mt-1 text-[11px] text-white/70">
            {caption.hashtags.map((h) => `#${h}`).join(" ")}
          </p>
        )}
      </div>
      {/* Side actions */}
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
        <div className="text-center"><div className="text-white text-[14px]">❤️</div><div className="text-[10px] text-white">0</div></div>
        <div className="text-center"><div className="text-white text-[14px]">💬</div><div className="text-[10px] text-white">0</div></div>
        <div className="text-center"><div className="text-white text-[14px]">🔖</div><div className="text-[10px] text-white">0</div></div>
        <div className="text-center"><div className="text-white text-[14px]">↗️</div><div className="text-[10px] text-white">0</div></div>
      </div>
    </div>
  );
}

function GenericPreview({ caption, platform }: { caption: GeneratedCaption; platform: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden max-w-[380px] mx-auto p-4">
      <p className="text-[10px] font-medium text-ink-faint uppercase tracking-wider mb-2">{platform} Preview</p>
      <p className="whitespace-pre-line text-[13px] text-ink leading-relaxed">{caption.text}</p>
      {caption.hashtags.length > 0 && (
        <p className="mt-2 text-[12px] text-accent">
          {caption.hashtags.map((h) => `#${h}`).join(" ")}
        </p>
      )}
    </div>
  );
}

const PREVIEW_MAP: Record<string, React.FC<{ caption: GeneratedCaption }>> = {
  Instagram: InstagramPreview,
  "Twitter / X": TwitterPreview,
  LinkedIn: LinkedInPreview,
  TikTok: TikTokPreview,
};

export function PlatformPreview({ caption, onClose }: PlatformPreviewProps) {
  const PreviewComponent = PREVIEW_MAP[caption.platform];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-bg p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="pressable absolute right-3 top-3 rounded-lg border border-line p-1.5 text-ink-faint hover:bg-surface-2 hover:text-ink"
          >
            <X size={16} />
          </button>

          <h3 className="mb-4 text-sm font-semibold text-ink">
            {caption.platform} Preview
          </h3>

          {PreviewComponent ? (
            <PreviewComponent caption={caption} />
          ) : (
            <GenericPreview caption={caption} platform={caption.platform} />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
