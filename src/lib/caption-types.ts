export const CAPTION_TONES = [
  "Professional",
  "Casual",
  "Humorous",
  "Inspirational",
  "Urgent",
  "Friendly",
  "Bold",
  "Educational",
  "Witty",
  "Empathetic",
] as const;

export type CaptionTone = (typeof CAPTION_TONES)[number];

export const CAPTION_STYLES = [
  "Storytelling",
  "List / Tips",
  "Question Hook",
  "Before & After",
  "Call to Action",
  "Quote Style",
  "Behind the Scenes",
  "Controversial Take",
  "How-To Guide",
  "Meme / Trend",
] as const;

export type CaptionStyle = (typeof CAPTION_STYLES)[number];

export const PLATFORMS = [
  "Instagram",
  "Twitter / X",
  "LinkedIn",
  "TikTok",
  "Facebook",
  "Threads",
  "YouTube",
] as const;

export type Platform = (typeof PLATFORMS)[number];

export const CTA_TYPES = [
  "None",
  "Link in Bio",
  "Follow for More",
  "Drop a Comment",
  "Share with a Friend",
  "Save for Later",
  "DM Us",
  "Visit Website",
  "Sign Up Free",
  "Custom",
] as const;

export type CTAType = (typeof CTA_TYPES)[number];

export interface GeneratedCaption {
  id: string;
  text: string;
  hashtags: string[];
  cta: string;
  platform: Platform;
  tone: CaptionTone;
  style: CaptionStyle;
  charCount: number;
  createdAt: number;
}

export interface CaptionRequest {
  topic: string;
  brief: string;
  tone: CaptionTone;
  style: CaptionStyle;
  platform: Platform;
  count: number;
  customCta?: string;
  ctaType: CTAType;
}
