"use client";

import { PLATFORMS, type Platform } from "@/lib/caption-types";

interface CharCounterProps {
  current: number;
  platform: Platform;
}

export function CharCounter({ current, platform }: CharCounterProps) {
  const config = PLATFORMS[platform];
  const limit = config.charLimit;
  const percentage = Math.min((current / limit) * 100, 100);
  const isOver = current > limit;
  const isNear = percentage > 80 && !isOver;

  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColor = isOver
    ? "var(--danger)"
    : isNear
    ? "var(--warning)"
    : "var(--accent)";

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="var(--line)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="char-ring"
          />
        </svg>
        {isOver && (
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-danger">
            !
          </span>
        )}
      </div>
      <div className="text-[11px] leading-tight">
        <div className="font-mono font-medium text-ink">
          {current.toLocaleString()} / {limit.toLocaleString()}
        </div>
        <div className="text-ink-faint">{platform}</div>
      </div>
    </div>
  );
}
