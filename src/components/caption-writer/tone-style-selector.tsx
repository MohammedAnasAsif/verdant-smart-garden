"use client";

import { useCaptionStore } from "@/lib/caption-store";
import {
  CAPTION_TONES,
  CAPTION_STYLES,
  PLATFORMS,
  CTA_TYPES,
} from "@/lib/caption-types";

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
      <span className="block text-sm font-medium text-ink-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`pressable rounded-full px-3.5 py-1.5 text-[13px] font-medium border transition-colors ${
              value === opt
                ? "border-accent bg-accent/10 text-accent"
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
    ctaType,
    customCta,
    setTone,
    setStyle,
    setPlatform,
    setCtaType,
    setCustomCta,
  } = useCaptionStore();

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
        options={PLATFORMS}
        value={platform}
        onChange={setPlatform}
      />
      <ChipGroup
        label="Call to Action"
        options={CTA_TYPES}
        value={ctaType}
        onChange={setCtaType}
      />
      {ctaType === "Custom" && (
        <div className="space-y-2">
          <label
            htmlFor="custom-cta"
            className="block text-sm font-medium text-ink-muted"
          >
            Custom CTA
          </label>
          <input
            id="custom-cta"
            type="text"
            value={customCta}
            onChange={(e) => setCustomCta(e.target.value)}
            placeholder="e.g. Download our free guide — link in bio!"
            className="w-full rounded-[var(--radius-card)] border border-line bg-surface px-4 py-2.5 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors text-sm"
          />
        </div>
      )}
    </div>
  );
}
