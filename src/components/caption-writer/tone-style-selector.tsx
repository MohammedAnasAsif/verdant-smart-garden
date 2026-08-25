"use client";

import { useCaptionStore } from "@/lib/caption-store";
import {
  CAPTION_TONES,
  CAPTION_STYLES,
  PLATFORMS,
  CTA_TYPES,
  LANGUAGES,
} from "@/lib/caption-types";
import type { Platform } from "@/lib/caption-types";

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wider text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`pressable rounded-md px-3 py-1.5 text-[12px] font-medium border transition-colors ${
              value === opt
                ? "border-accent bg-accent text-on-accent"
                : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToneStyleSelector() {
  const {
    tone,
    style,
    platform,
    language,
    ctaType,
    customCta,
    setTone,
    setStyle,
    setPlatform,
    setLanguage,
    setCtaType,
    setCustomCta,
  } = useCaptionStore();

  const platformNames = Object.keys(PLATFORMS) as Platform[];

  return (
    <div className="space-y-5">
      <ChipGroup
        label="Tone"
        options={CAPTION_TONES}
        value={tone}
        onChange={setTone}
      />
      <ChipGroup
        label="Writing Style"
        options={CAPTION_STYLES}
        value={style}
        onChange={setStyle}
      />
      <ChipGroup
        label="Platform"
        options={platformNames}
        value={platform}
        onChange={setPlatform}
      />
      <ChipGroup
        label="Language"
        options={LANGUAGES}
        value={language}
        onChange={setLanguage}
      />
      <ChipGroup
        label="Call to Action"
        options={CTA_TYPES}
        value={ctaType}
        onChange={setCtaType}
      />
      {ctaType === "Custom" && (
        <div className="space-y-1.5">
          <label htmlFor="custom-cta" className="block text-xs font-medium uppercase tracking-wider text-ink-muted">
            Custom CTA
          </label>
          <input
            id="custom-cta"
            type="text"
            value={customCta}
            onChange={(e) => setCustomCta(e.target.value)}
            placeholder="Download our free guide — link in bio!"
            className="w-full rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
