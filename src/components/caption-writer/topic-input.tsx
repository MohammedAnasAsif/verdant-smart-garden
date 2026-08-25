"use client";

import { useCaptionStore } from "@/lib/caption-store";
import { useCallback } from "react";

export function TopicInput() {
  const { topic, brief, setTopic, setBrief } = useCaptionStore();

  const handleTopicChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value),
    [setTopic]
  );

  const handleBriefChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setBrief(e.target.value),
    [setBrief]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-ink-muted"
        >
          Topic or Subject
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={handleTopicChange}
          placeholder="e.g. AI tools for productivity, new product launch, mental health tips"
          className="w-full rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="brief"
          className="block text-sm font-medium text-ink-muted"
        >
          Brief / Context{" "}
          <span className="text-ink-faint">(optional — adds depth)</span>
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={handleBriefChange}
          rows={3}
          placeholder="e.g. We just launched a free AI writing assistant that helps content creators save 5 hours per week on drafting social posts."
          className="w-full rounded-[var(--radius-card)] border border-line bg-surface px-4 py-3 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
