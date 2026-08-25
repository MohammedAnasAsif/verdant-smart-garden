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

export interface PlatformConfig {
  name: string;
  charLimit: number;
  hashtagLimit: number;
  icon: string;
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  Instagram: { name: "Instagram", charLimit: 2200, hashtagLimit: 30, icon: "instagram" },
  "Twitter / X": { name: "Twitter / X", charLimit: 280, hashtagLimit: 5, icon: "twitter" },
  LinkedIn: { name: "LinkedIn", charLimit: 3000, hashtagLimit: 5, icon: "linkedin" },
  TikTok: { name: "TikTok", charLimit: 2200, hashtagLimit: 10, icon: "tiktok" },
  Facebook: { name: "Facebook", charLimit: 63206, hashtagLimit: 30, icon: "facebook" },
  Threads: { name: "Threads", charLimit: 500, hashtagLimit: 10, icon: "threads" },
  YouTube: { name: "YouTube", charLimit: 5000, hashtagLimit: 15, icon: "youtube" },
};

export type Platform = keyof typeof PLATFORMS;

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

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
  "Hindi",
  "Japanese",
  "Korean",
  "Italian",
] as const;

export type Language = (typeof LANGUAGES)[number];

export interface CaptionTemplate {
  id: string;
  name: string;
  category: string;
  tone: CaptionTone;
  style: CaptionStyle;
  template: string;
  description: string;
}

export interface GeneratedCaption {
  id: string;
  text: string;
  hashtags: string[];
  cta: string;
  platform: Platform;
  tone: CaptionTone;
  style: CaptionStyle;
  language: Language;
  charCount: number;
  createdAt: number;
  abVariant?: "A" | "B";
}

export interface CaptionRequest {
  topic: string;
  brief: string;
  tone: CaptionTone;
  style: CaptionStyle;
  platform: Platform;
  language: Language;
  count: number;
  customCta?: string;
  ctaType: CTAType;
  abMode: boolean;
}
