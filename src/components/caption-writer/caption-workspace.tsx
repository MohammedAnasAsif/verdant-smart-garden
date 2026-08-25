"use client";

import { useCaptionStore } from "@/lib/caption-store";
import { TopicInput } from "./topic-input";
import { ToneStyleSelector } from "./tone-style-selector";
import { CaptionCard } from "./caption-card";
import { SavedCaptions } from "./saved-captions";
import { Sparkle, Spinner, X, BookmarkSimple, MagicWand } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback } from "react";

type Tab = "generate" | "saved";

export function CaptionWorkspace() {
  const {
    topic,
    brief,
    tone,
    style,
    platform,
    ctaType,
    customCta,
    isGenerating,
    generatedCaptions,
    setIsGenerating,
    addGeneratedCaptions,
    clearGenerated,
  } = useCaptionStore();

  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [count, setCount] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first");
      return;
    }
    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          brief: brief.trim(),
          tone,
          style,
          platform,
          count,
          ctaType,
          customCta,
        }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      addGeneratedCaptions(data.captions);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [topic, brief, tone, style, platform, count, ctaType, customCta, setIsGenerating, addGeneratedCaptions]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="mb-10 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-[12px] font-medium text-accent">
            <MagicWand size={14} />
            AI Caption Writer
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Social Media
            <br />
            <span className="text-accent">Caption Generator</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted leading-relaxed">
            Generate scroll-stopping captions for any platform. Choose your tone,
            style, and call to action — AI handles the rest.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-line bg-surface p-1">
            <button
              onClick={() => setActiveTab("generate")}
              className={`pressable flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] font-medium transition-colors ${
                activeTab === "generate"
                  ? "bg-accent text-on-accent"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <Sparkle size={14} />
              Generate
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pressable flex items-center gap-2 rounded-lg px-5 py-2 text-[13px] font-medium transition-colors ${
                activeTab === "saved"
                  ? "bg-accent text-on-accent"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <BookmarkSimple size={14} />
              Saved
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "generate" ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                {/* Left panel — Controls */}
                <div className="space-y-6">
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <h2 className="mb-4 text-sm font-semibold text-ink">
                      What to write about
                    </h2>
                    <TopicInput />
                  </div>

                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <h2 className="mb-4 text-sm font-semibold text-ink">
                      Style & Platform
                    </h2>
                    <ToneStyleSelector />
                  </div>

                  {/* Count + Generate */}
                  <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-ink-muted">
                        Variations
                      </span>
                      <div className="flex items-center gap-2">
                        {[2, 3, 4, 6].map((n) => (
                          <button
                            key={n}
                            onClick={() => setCount(n)}
                            className={`pressable h-8 w-8 rounded-lg text-[12px] font-medium border transition-colors ${
                              count === n
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-line text-ink-muted hover:border-line-strong"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <p className="mb-3 text-[12px] text-red-400">{error}</p>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !topic.trim()}
                      className="pressable flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-[14px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Spinner size={16} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkle size={16} />
                          Generate Captions
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right panel — Results */}
                <div className="space-y-4">
                  {generatedCaptions.length > 0 && (
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-ink">
                        Generated ({generatedCaptions.length})
                      </h2>
                      <button
                        onClick={clearGenerated}
                        className="pressable flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-ink-faint hover:bg-surface-2 hover:text-ink-muted"
                      >
                        <X size={13} />
                        Clear all
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {generatedCaptions.map((cap) => (
                      <CaptionCard key={cap.id} caption={cap} />
                    ))}
                  </AnimatePresence>

                  {generatedCaptions.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-line py-20 text-center">
                      <Sparkle
                        size={40}
                        weight="light"
                        className="mb-4 text-ink-faint"
                      />
                      <p className="text-sm text-ink-muted">
                        Your generated captions will appear here
                      </p>
                      <p className="mt-1 text-[12px] text-ink-faint">
                        Enter a topic and click Generate to start
                      </p>
                    </div>
                  )}

                  {isGenerating && generatedCaptions.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-line bg-surface/50 py-20">
                      <Spinner
                        size={32}
                        className="mb-3 animate-spin text-accent"
                      />
                      <p className="text-sm text-ink-muted">
                        Crafting your captions...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-2xl"
            >
              <SavedCaptions />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
