"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Smiley } from "@phosphor-icons/react";

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😀", "😂", "🥲", "😍", "🤩", "😎", "🥳", "😏", "🤔", "😤", "🔥", "💯", "✨", "⭐", "🌟", "💫", "🎉", "🎊", "🚀", "💡"],
  },
  {
    name: "Hands",
    emojis: ["👍", "👎", "👏", "🙌", "🤝", "💪", "✌️", "🤙", "👋", "🙏", "👆", "👇", "👉", "👈", "❤️", "🧡", "💛", "💚", "💙", "💜"],
  },
  {
    name: "Objects",
    emojis: ["📱", "💻", "⌨️", "🖥️", "📸", "🎬", "🎵", "📊", "📈", "🔍", "⚡", "🎯", "🏆", "📌", "🔖", "🔗", "📎", "🗂️", "📝", "✏️"],
  },
  {
    name: "Nature",
    emojis: ["🌸", "🌺", "🌻", "🌹", "🍀", "🌿", "🌴", "☀️", "🌈", "🌙", "⚡", "❄️", "🌊", "🔥", "💎", "🪨", "🦊", "🐺", "🦋", "🐝"],
  },
  {
    name: "Food",
    emojis: ["☕", "🍵", "🥤", "🍕", "🍔", "🌮", "🍣", "🍩", "🍰", "🧁", "🍪", "🍫", "🥑", "🌽", "🍎", "🍊", "🍋", "🫐", "🍇", "🍉"],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (emoji: string) => {
      onSelect(emoji);
    },
    [onSelect]
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pressable flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-[12px] font-medium text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <Smiley size={14} />
        Emoji
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-line bg-surface p-3 shadow-lg">
          {/* Category tabs */}
          <div className="mb-2 flex gap-1 overflow-x-auto rail-scroll">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={`pressable shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  activeCategory === i
                    ? "bg-accent text-on-accent"
                    : "text-ink-faint hover:bg-surface-2"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="grid grid-cols-8 gap-0.5">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  handleSelect(emoji);
                  setIsOpen(false);
                }}
                className="pressable flex h-8 w-8 items-center justify-center rounded-md text-base hover:bg-surface-2"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
