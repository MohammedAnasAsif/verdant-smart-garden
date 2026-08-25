import { NextRequest, NextResponse } from "next/server";
import type {
  CaptionRequest,
  GeneratedCaption,
  Platform,
} from "@/lib/caption-types";

const HASHTAG_POOLS: Record<string, string[]> = {
  Instagram: [
    "instagood", "photooftheday", "instadaily", "love", "beautiful",
    "happy", "picoftheday", "photo", "instalike", "follow",
    "lifestyle", "travel", "food", "fashion", "fitness",
    "motivation", "business", "startup", "entrepreneur", "marketing",
  ],
  "Twitter / X": [
    "twitter", "tweet", "viral", "trending", "hot",
    "breaking", "thread", "opinion", "thoughts", "news",
    "tech", "ai", "startup", "business", "marketing",
  ],
  LinkedIn: [
    "linkedin", "leadership", "growth", "career", "professional",
    "networking", "business", "entrepreneur", "innovation", "success",
    "management", "strategy", "startup", "motivation", "learning",
  ],
  TikTok: [
    "fyp", "foryou", "viral", "trending", "tiktok",
    "foryoupage", "explore", "duet", "challenge", "storytime",
    "lifehack", "tips", "howto", "relatable", "funny",
  ],
  Facebook: [
    "facebook", "community", "sharing", "friends", "family",
    "lifestyle", "travel", "food", "love", "happy",
  ],
  Threads: [
    "threads", "meta", "conversation", "community", "social",
    "discussion", "thoughts", "connect", "share", "engage",
  ],
  YouTube: [
    "youtube", "subscribe", "newvideo", "contentcreator", "vlog",
    "tutorial", "howto", "review", "tech", "gaming",
  ],
};

const CTA_MAP: Record<string, string> = {
  None: "",
  "Link in Bio": "🔗 Link in bio for more!",
  "Follow for More": "👉 Follow for more content like this!",
  "Drop a Comment": "💬 Drop your thoughts in the comments!",
  "Share with a Friend": "🔄 Share this with someone who needs to see it!",
  "Save for Later": "📌 Save this for later — you'll thank yourself!",
  "DM Us": "📩 DM us for more info!",
  "Visit Website": "🌐 Visit our website to learn more!",
  "Sign Up Free": "✨ Sign up free — link in bio!",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 2246822507);
    s = Math.imul(s ^ (s >>> 13), 3266489909);
    s ^= s >>> 16;
    return (s >>> 0) / 4294967296;
  };
}

const CAPTION_TEMPLATES: Record<string, string[]> = {
  Professional: [
    "Here's what most people miss about {topic}:\n\n{brief}\n\nThe difference between good and great comes down to understanding these fundamentals.",
    "I've spent years working with {topic}. Here's what I've learned:\n\n{brief}\n\nWhat's your experience been? I'd love to hear different perspectives.",
    "{topic} doesn't have to be complicated.\n\n{brief}\n\nStart with the basics, stay consistent, and the results will follow.",
    "A quick breakdown of {topic} that actually makes sense:\n\n{brief}\n\nHope this helps someone navigating the same space.",
  ],
  Casual: [
    "Okay so {topic} is honestly way simpler than people make it seem 😅\n\n{brief}\n\nJust my two cents though — what do you think?",
    "Real talk about {topic} 👇\n\n{brief}\n\nAnyone else feel this way?",
    "So I've been thinking about {topic} a lot lately and here's the thing:\n\n{brief}\n\nNo gatekeeping here ✌️",
    "Hot take on {topic}:\n\n{brief}\n\nAgree or disagree? Tell me 👀",
  ],
  Humorous: [
    "Me explaining {topic} to my friends at 2 AM:\n\n{brief}\n\nThey didn't ask. I delivered. 🎤⬇️",
    "POV: You finally understand {topic} and now you can't stop talking about it\n\n{brief}\n\nMy friends are tired. I am not. 😂",
    "{topic} hits different when you actually get it:\n\n{brief}\n\n*mic drop* 🎙️",
    "Nobody:\n\nAbsolutely nobody:\n\nMe at 3 AM writing about {topic}:\n\n{brief}\n\nI regret nothing 🫡",
  ],
  Inspirational: [
    "Your journey with {topic} starts with one step.\n\n{brief}\n\nEvery expert was once a beginner. Keep going. 🌟",
    "The best time to start with {topic} was yesterday. The second best time is now.\n\n{brief}\n\nYour future self will thank you.",
    "Dream big. Start small. Act now.\n\n{brief}\n\n{topic} is just the beginning of what's possible for you.",
    "Here's your sign to stop overthinking {topic} and just start:\n\n{brief}\n\nThe world needs what you're building. 🚀",
  ],
  Urgent: [
    "⚠️ Stop scrolling. This matters.\n\n{topic} is changing fast:\n\n{brief}\n\nDon't get left behind — act now.",
    "🚨 This could change everything about how you approach {topic}:\n\n{brief}\n\nThe window won't stay open forever.",
    "⏰ Time-sensitive: {topic} is evolving right now.\n\n{brief}\n\nFirst movers win. Are you one of them?",
    "NOW is the moment for {topic}.\n\n{brief}\n\nLater becomes never. Let's go.",
  ],
  Friendly: [
    "Hey friend! 👋 Let's chat about {topic}.\n\n{brief}\n\nHope this makes your day a little easier!",
    "You know what I love talking about? {topic}! Here's the scoop:\n\n{brief}\n\nSending good vibes your way 💛",
    "Just wanted to share something cool about {topic}:\n\n{brief}\n\nHope you find this as exciting as I do!",
    "Friendly reminder that {topic} is awesome and so are you:\n\n{brief}\n\nNow go crush it! 💪",
  ],
  Bold: [
    "I'm going to say what nobody else will about {topic}:\n\n{brief}\n\nYeah, I said it. And I mean every word.",
    "{topic} needs a reality check. Here it is:\n\n{brief}\n\nWe can keep pretending or we can actually do something about it.",
    "Unpopular opinion on {topic}:\n\n{brief}\n\nThe discomfort is where growth lives. Fight me. 🔥",
    "Enough playing it safe with {topic}.\n\n{brief}\n\nGo big or go home. Your choice.",
  ],
  Educational: [
    "📚 {topic} — explained simply:\n\n{brief}\n\nSave this post. You'll want to come back to it.",
    "Here's everything I wish I knew about {topic} from day one:\n\n{brief}\n\nKnowledge is power. Share it forward.",
    "Let's break down {topic} step by step:\n\n{brief}\n\nUnderstanding the 'why' makes the 'how' so much easier.",
    "The complete guide to {topic} in 60 seconds:\n\n{brief}\n\nBookmark this. Future you will be grateful. 📖",
  ],
  Witty: [
    "Plot twist: {topic} is actually fascinating once you get past the boring parts.\n\n{brief}\n\n*adjusts intellectual glasses* 🤓",
    "If {topic} were a movie, it would be a thriller:\n\n{brief}\n\n*popcorn not included* 🍿",
    "Fun fact: {topic} is more interesting than whatever you were about to scroll to.\n\n{brief}\n\nYou're welcome for the entertainment.",
    "Breaking: Local person discovers {topic} is actually cool.\n\n{brief}\n\nMore at 11. 📺",
  ],
  Empathetic: [
    "I know {topic} can feel overwhelming. You're not alone.\n\n{brief}\n\nTake it one step at a time. You've got this. 💛",
    "If you've been struggling with {topic}, this is for you:\n\n{brief}\n\nBe gentle with yourself. Progress isn't linear.",
    "Hey, it's okay if {topic} doesn't come easily.\n\n{brief}\n\nEvery small step forward counts. I'm rooting for you.",
    "To everyone navigating {topic} right now:\n\n{brief}\n\nYour pace is valid. Your journey matters. ❤️",
  ],
};

function pickHashtags(platform: Platform, topic: string, rng: () => number): string[] {
  const pool = HASHTAG_POOLS[platform] || HASHTAG_POOLS.Instagram;
  const topicWords = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .map((w) => w.replace(/\s+/g, ""));

  const topicTags = topicWords.slice(0, 3).map((w) => w);
  const shuffled = [...pool].sort(() => rng() - 0.5);
  const generic = shuffled.slice(0, 5 - topicTags.length);

  return [...topicTags, ...generic].filter(Boolean).slice(0, 5);
}

function pickCta(type: string, custom?: string): string {
  if (type === "Custom") return custom || "Check it out!";
  return CTA_MAP[type] || "";
}

export async function POST(req: NextRequest) {
  const body: CaptionRequest = await req.json();
  const { topic, brief, tone, style, platform, count, ctaType, customCta } =
    body;

  if (!topic.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const templates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.Professional;
  const rng = seededRandom(Date.now());
  const cta = pickCta(ctaType, customCta);

  const captions: GeneratedCaption[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < Math.min(count, 6); i++) {
    let idx: number;
    do {
      idx = Math.floor(rng() * templates.length);
    } while (usedIndices.has(idx) && usedIndices.size < templates.length);
    usedIndices.add(idx);

    const template = templates[idx];
    const text = template
      .replace(/\{topic\}/g, topic)
      .replace(/\{brief\}/g, brief || "Here's the key insight you need to know.");

    const hashtags = pickHashtags(platform, topic, rng);
    const fullText = cta ? `${text}\n\n${cta}` : text;

    captions.push({
      id: `cap-${Date.now()}-${i}`,
      text: fullText,
      hashtags,
      cta,
      platform,
      tone,
      style,
      charCount: fullText.length,
      createdAt: Date.now(),
    });
  }

  return NextResponse.json({ captions });
}
