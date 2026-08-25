"use client";

import { useCaptionStore } from "@/lib/caption-store";
import { TopicInput } from "./topic-input";
import { ToneStyleSelector } from "./tone-style-selector";
import { CaptionCard } from "./caption-card";
import { SavedCaptions } from "./saved-captions";
import { CaptionHistory } from "./caption-history";
import { CaptionTemplates } from "./caption-templates";
import { PlatformPreview } from "./platform-preview";
import { Sparkle, Spinner, X, BookmarkSimple, Clock, ArrowsLeftRight, HouseSimple } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useCallback } from "react";
import type { GeneratedCaption } from "@/lib/caption-types";

type Tab = "generate" | "saved" | "history";

export function CaptionWorkspace() {
  const {
    topic,
    brief,
    tone,
    style,
    platform,
    language,
    ctaType,
    customCta,
    count,
    abMode,
    isGenerating,
    generatedCaptions,
    setIsGenerating,
    addGeneratedCaptions,
    clearGenerated,
    setCount,
    setAbMode,
  } = useCaptionStore();

  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [error, setError] = useState<string | null>(null);
  const [previewCaption, setPreviewCaption] = useState<GeneratedCaption | null>(null);

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
          language,
          count,
          ctaType,
          customCta,
          abMode,
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
  }, [topic, brief, tone, style, platform, language, count, ctaType, customCta, abMode, setIsGenerating, addGeneratedCaptions]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-[13px] font-bold text-on-accent">C</div>
            <span className="font-display text-[15px] font-bold text-ink">Captionly</span>
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("generate")}
              className={`pressable flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeTab === "generate" ? "bg-accent text-on-accent" : "text-ink-muted hover:bg-surface-2"
              }`}
            >
              <HouseSimple size={13} />
              Generate
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pressable flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeTab === "saved" ? "bg-accent text-on-accent" : "text-ink-muted hover:bg-surface-2"
              }`}
            >
              <BookmarkSimple size={13} />
              Saved
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pressable flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeTab === "history" ? "bg-accent text-on-accent" : "text-ink-muted hover:bg-surface-2"
              }`}
            >
              <Clock size={13} />
              History
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mb-10 text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            AI Caption Generator
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted leading-relaxed">
            Generate scroll-stopping captions for any platform.
            Pick your tone, style, and language — AI handles the rest.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "generate" ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                {/* Left panel */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-line bg-surface p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">What to write about</h2>
                    <TopicInput />
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Style & Platform</h2>
                    <ToneStyleSelector />
                  </div>

                  <div className="rounded-xl border border-line bg-surface p-5">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Options</h2>
                    <div className="space-y-4">
                      {/* Variations */}
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-medium text-ink-muted">Variations</span>
                        <div className="flex items-center gap-1.5">
                          {[2, 3, 4, 6].map((n) => (
                            <button
                              key={n}
                              onClick={() => setCount(n)}
                              className={`pressable h-7 w-7 rounded-md text-[11px] font-medium border transition-colors ${
                                count === n ? "border-accent bg-accent text-on-accent" : "border-line text-ink-muted hover:border-line-strong"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* A/B mode */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ArrowsLeftRight size={13} className="text-ink-muted" />
                          <span className="text-[12px] font-medium text-ink-muted">A/B Testing</span>
                        </div>
                        <button
                          onClick={() => setAbMode(!abMode)}
                          className={`pressable relative h-5 w-9 rounded-full transition-colors ${abMode ? "bg-accent" : "bg-line-strong"}`}
                        >
                          <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${abMode ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </button>
                      </div>
                    </div>

                    {error && <p className="mb-3 text-[12px] text-danger">{error}</p>}

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !topic.trim()}
                      className="pressable mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[13px] font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Spinner size={15} className="animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkle size={15} />
                          Generate Captions
                        </>
                      )}
                    </button>
                  </div>

                  {/* Templates */}
                  <div className="rounded-xl border border-line bg-surface p-5">
                    <CaptionTemplates />
                  </div>
                </div>

                {/* Right panel */}
                <div className="space-y-3">
                  {generatedCaptions.length > 0 && (
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                        Generated ({generatedCaptions.length})
                      </h2>
                      <button
                        onClick={clearGenerated}
                        className="pressable flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-[11px] font-medium text-ink-faint hover:bg-surface-2"
                      >
                        <X size={11} />
                        Clear
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {generatedCaptions.map((cap) => (
                      <div key={cap.id} className="relative">
                        <CaptionCard caption={cap} />
                        <button
                          onClick={() => setPreviewCaption(cap)}
                          className="absolute right-3 top-3 rounded-md border border-line bg-surface px-2 py-1 text-[10px] font-medium text-ink-faint hover:bg-surface-2 hover:text-ink"
                        >
                          Preview
                        </button>
                      </div>
                    ))}
                  </AnimatePresence>

                  {generatedCaptions.length === 0 && !isGenerating && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-20 text-center">
                      <Sparkle size={32} weight="light" className="mb-3 text-ink-faint" />
                      <p className="text-sm text-ink-muted">Your captions will appear here</p>
                      <p className="mt-1 text-[12px] text-ink-faint">Enter a topic and click Generate</p>
                    </div>
                  )}

                  {isGenerating && generatedCaptions.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface/50 py-20">
                      <Spinner size={28} className="mb-3 animate-spin text-accent" />
                      <p className="text-sm text-ink-muted">Crafting your captions...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : activeTab === "saved" ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-2xl"
            >
              <SavedCaptions />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-2xl"
            >
              <CaptionHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Platform preview modal */}
      {previewCaption && (
        <PlatformPreview
          caption={previewCaption}
          onClose={() => setPreviewCaption(null)}
        />
      )}
    </div>
  );
}
