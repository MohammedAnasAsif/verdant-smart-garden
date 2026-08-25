"use client";

import { useState } from "react";
import { useCaptionStore } from "@/lib/caption-store";
import type { CaptionTone, CaptionStyle } from "@/lib/caption-types";
import { BookOpen, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

interface Template {
  id: string;
  name: string;
  category: string;
  tone: CaptionTone;
  style: CaptionStyle;
  topic: string;
  brief: string;
  description: string;
}

const TEMPLATES: Template[] = [
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Marketing",
    tone: "Bold",
    style: "Call to Action",
    topic: "new product",
    brief: "We've been building something incredible for months and it's finally here.",
    description: "Build hype for a new product or feature release",
  },
  {
    id: "tips-thread",
    name: "Tips & Advice",
    category: "Educational",
    tone: "Educational",
    style: "List / Tips",
    topic: "productivity hacks",
    brief: "Here are the top strategies that actually work.",
    description: "Share actionable tips in a list format",
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    category: "Engagement",
    tone: "Friendly",
    style: "Behind the Scenes",
    topic: "our team",
    brief: "Here's what it really looks like to build this every day.",
    description: "Show the human side of your brand",
  },
  {
    id: "motivation",
    name: "Motivational Quote",
    category: "Inspiration",
    tone: "Inspirational",
    style: "Quote Style",
    topic: "success mindset",
    brief: "The only limit is the one you set yourself.",
    description: "Inspire your audience with powerful quotes",
  },
  {
    id: "question-hook",
    name: "Engagement Hook",
    category: "Engagement",
    tone: "Casual",
    style: "Question Hook",
    topic: "industry trends",
    brief: "I've been thinking about this a lot lately.",
    description: "Start a conversation with a compelling question",
  },
  {
    id: "hot-take",
    name: "Hot Take",
    category: "Thought Leadership",
    tone: "Bold",
    style: "Controversial Take",
    topic: "common practice",
    brief: "Everyone does this, but nobody talks about why it's wrong.",
    description: "Share a bold, contrarian opinion",
  },
  {
    id: "holiday-sale",
    name: "Holiday Promotion",
    category: "Marketing",
    tone: "Urgent",
    style: "Call to Action",
    topic: "seasonal sale",
    brief: "Limited time offer — don't miss out on these deals.",
    description: "Time-sensitive holiday or seasonal promotion",
  },
  {
    id: "case-study",
    name: "Case Study",
    category: "Educational",
    tone: "Professional",
    style: "Before & After",
    topic: "client results",
    brief: "From struggling to thriving — here's exactly what changed.",
    description: "Showcase results with a before/after narrative",
  },
  {
    id: "meme-trend",
    name: "Trend / Meme",
    category: "Entertainment",
    tone: "Humorous",
    style: "Meme / Trend",
    topic: "relatable moment",
    brief: "When you finally fix that bug at 3 AM.",
    description: "Ride a trending topic or meme format",
  },
  {
    id: "announcement",
    name: "Big Announcement",
    category: "Marketing",
    tone: "Professional",
    style: "Storytelling",
    topic: "company milestone",
    brief: "We just hit a major milestone and we couldn't have done it without you.",
    description: "Share important news with storytelling",
  },
];

export function CaptionTemplates() {
  const { setTopic, setBrief, setTone, setStyle } = useCaptionStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(TEMPLATES.map((t) => t.category))];

  const filtered = selectedCategory
    ? TEMPLATES.filter((t) => t.category === selectedCategory)
    : TEMPLATES;

  const applyTemplate = (template: Template) => {
    setTopic(template.topic);
    setBrief(template.brief);
    setTone(template.tone);
    setStyle(template.style);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen size={16} className="text-ink-muted" />
        <h3 className="text-sm font-semibold text-ink">Quick Start Templates</h3>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`pressable rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
            !selectedCategory
              ? "bg-accent text-on-accent"
              : "border border-line text-ink-faint hover:bg-surface-2"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`pressable rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-accent text-on-accent"
                : "border border-line text-ink-faint hover:bg-surface-2"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((template) => (
            <motion.button
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              onClick={() => applyTemplate(template)}
              className="pressable group flex items-start gap-3 rounded-xl border border-line bg-surface p-3.5 text-left transition-colors hover:border-accent/30 hover:bg-accent-muted/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-ink">{template.name}</span>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-ink-faint">
                    {template.category}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-ink-faint line-clamp-2">{template.description}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-ink-faint">{template.tone}</span>
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[9px] font-medium text-ink-faint">{template.style}</span>
                </div>
              </div>
              <ArrowRight size={14} className="mt-1 shrink-0 text-ink-faint transition-colors group-hover:text-accent" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
