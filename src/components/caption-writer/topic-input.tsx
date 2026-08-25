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
      <div className="space-y-1.5">
        <label htmlFor="topic" className="block text-xs font-medium uppercase tracking-wider text-ink-muted">
          Topic or Subject
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={handleTopicChange}
          placeholder="AI tools for productivity, product launch, mental health tips..."
          className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="brief" className="block text-xs font-medium uppercase tracking-wider text-ink-muted">
          Brief / Context <span className="normal-case text-ink-faint">(optional)</span>
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={handleBriefChange}
          rows={3}
          placeholder="We just launched a free AI writing assistant that helps content creators save 5 hours per week..."
          className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
