import { NextRequest, NextResponse } from "next/server";
import type {
  CaptionRequest,
  GeneratedCaption,
  Platform,
  Language,
} from "@/lib/caption-types";

const HASHTAG_POOLS: Record<string, string[]> = {
  Instagram: [
    "instagood", "photooftheday", "instadaily", "love", "beautiful",
    "happy", "picoftheday", "instalike", "follow", "lifestyle",
    "travel", "food", "fashion", "fitness", "motivation",
    "business", "startup", "entrepreneur", "marketing", "content",
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
  "Link in Bio": "Link in bio for more!",
  "Follow for More": "Follow for more content like this!",
  "Drop a Comment": "Drop your thoughts in the comments!",
  "Share with a Friend": "Share this with someone who needs to see it!",
  "Save for Later": "Save this for later, you will thank yourself!",
  "DM Us": "DM us for more info!",
  "Visit Website": "Visit our website to learn more!",
  "Sign Up Free": "Sign up free, link in bio!",
};

const LANG_TRANSLATIONS: Record<Language, Record<string, string>> = {
  English: {},
  Spanish: {
    "Here's what most people miss about": "Esto es lo que la mayoria olvida sobre",
    "I've spent years working with": "He trabajado anos con",
    "doesn't have to be complicated": "no tiene por que ser complicado",
    "Okay so": "Bueno, entonces",
    "is honestly way simpler than people make it seem": "es honestamente mas simple de lo que la gente piensa",
    "Real talk about": "Hablemos seriamente sobre",
    "So I've been thinking about": "He estado pensando en",
    "a lot lately and here's the thing": "mucho últimamente y esto es lo queopino",
    "Me explaining": "Yo explicando",
    "to my friends at 2 AM": "a mis amigos a las 2 AM",
    "POV: You finally understand": "POV: Finalmente entiendes",
    "and now you can't stop talking about it": "y ahora no puedes dejar de hablar de ello",
    "Your journey with": "Tu camino con",
    "starts with one step": "comienza con un paso",
    "Every expert was once a beginner. Keep going.": "Todo experto fue alguna vez un principiante. Sigue adelante.",
    "The best time to start with": "El mejor momento para empezar con",
    "was yesterday. The second best time is now.": "fue ayer. El segundo mejor momento es ahora.",
    "Stop scrolling. This matters.": "Deja de scrollear. Esto importa.",
    "is changing fast": "esta cambiando rapido",
    "Don't get left behind": "No te quedes atras",
    "Hey friend!": "Hola amigo!",
    "Let's chat about": "Hablemos de",
    "Hope this makes your day a little easier!": "Espero que esto te haga el dia un poco mas facil!",
    "I'm going to say what nobody else will about": "Voy a decir lo que nadie mas dice sobre",
    "Unpopular opinion on": "Opinion impopular sobre",
    "enough playing it safe with": "ya basta de jugar a lo seguro con",
    "Here's everything I wish I knew about": "Esto es todo lo que desearia haber sabido sobre",
    "from day one": "desde el primer dia",
    "Plot twist:": "Giro inesperado:",
    "is actually fascinating once you get past the boring parts": "es realmente fascinante una vez que superas las partes aburridas",
    "Fun fact:": "Dato curioso:",
    "is more interesting than whatever you were about to scroll to": "es mas interesante que lo que ibas a ver",
    "I know": "Se que",
    "can feel overwhelming. You're not alone.": "puede sentirse abrumador. No estas solo.",
    "Hey, it's okay if": "Oye, esta bien si",
    "doesn't come easily.": "no te sale facil.",
    "To everyone navigating": "Para todos los que estan navegando",
    "Your pace is valid. Your journey matters.": "Tu ritmo es valido. Tu viaje importa.",
  },
  French: {
    "Here's what most people miss about": "Voici ce que la plupart des gens ratent sur",
    "I've spent years working with": "Ca fait des annees que je travaille avec",
    "doesn't have to be complicated": "n'a pas besoin d'etre complique",
    "Stop scrolling. This matters.": "Arrete de defiler. C'est important.",
    "Hey friend!": "Salut l'ami!",
    "Unpopular opinion on": "Opinion impopulaire sur",
  },
  German: {
    "Here's what most people miss about": "Das ist, was die meisten uber",
    "I've spent years working with": "Ich arbeite seit Jahren mit",
    "doesn't have to be complicated": "muss nicht kompliziert sein",
    "Stop scrolling. This matters.": "Hort auf zu scrollen. Das ist wichtig.",
    "Hey friend!": "Hey Freund!",
  },
  Portuguese: {
    "Here's what most people miss about": "Eis o que a maioria esquece sobre",
    "I've spent years working with": "Trabalho ha anos com",
    "doesn't have to be complicated": "nao precisa ser complicado",
    "Stop scrolling. This matters.": "Pare de rolar. Isso importa.",
    "Hey friend!": "Ola amigo!",
  },
  Arabic: {
    "Stop scrolling. This matters.": ".توقف عن التمرير. هذا مهم",
    "Hey friend!": "!مرحبا صديقي",
  },
  Hindi: {
    "Stop scrolling. This matters.": "स्क्रॉलिंग बंद करो। यह महत्वपूर्ण है।",
    "Hey friend!": "अरे दोस्त!",
  },
  Japanese: {
    "Stop scrolling. This matters.": "スクロールを止めて。これは重要です。",
    "Hey friend!": "やあ友達！",
  },
  Korean: {
    "Stop scrolling. This matters.": "스크롤을 멈추세요. 이것은 중요합니다.",
    "Hey friend!": "안녕 친구!",
  },
  Italian: {
    "Stop scrolling. This matters.": "Smetti di scorrere. Questo conta.",
    "Hey friend!": "Ciao amico!",
    "Here's what most people miss about": "Ecco cosa la maggior parte delle persone non capisce su",
    "I've spent years working with": "Lavoro con da anni",
    "doesn't have to be complicated": "non deve essere complicato",
  },
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

function translate(text: string, lang: Language): string {
  const dict = LANG_TRANSLATIONS[lang];
  if (!dict || Object.keys(dict).length === 0) return text;
  let result = text;
  for (const [en, translated] of Object.entries(dict)) {
    result = result.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), translated);
  }
  return result;
}

const CAPTION_TEMPLATES: Record<string, string[]> = {
  Professional: [
    "Here's what most people miss about {topic}:\n\n{brief}\n\nThe difference between good and great comes down to understanding these fundamentals.",
    "I've spent years working with {topic}. Here's what I've learned:\n\n{brief}\n\nWhat's your experience been? I'd love to hear different perspectives.",
    "{topic} doesn't have to be complicated.\n\n{brief}\n\nStart with the basics, stay consistent, and the results will follow.",
    "A quick breakdown of {topic} that actually makes sense:\n\n{brief}\n\nHope this helps someone navigating the same space.",
    "3 things I wish someone told me about {topic} earlier:\n\n{brief}\n\nSave this for when you need it.",
  ],
  Casual: [
    "Okay so {topic} is honestly way simpler than people make it seem\n\n{brief}\n\nJust my two cents though — what do you think?",
    "Real talk about {topic}\n\n{brief}\n\nAnyone else feel this way?",
    "So I've been thinking about {topic} a lot lately and here's the thing:\n\n{brief}\n\nNo gatekeeping here",
    "Hot take on {topic}:\n\n{brief}\n\nAgree or disagree? Tell me",
    "The thing about {topic} that nobody talks about:\n\n{brief}\n\nNow you know",
  ],
  Humorous: [
    "Me explaining {topic} to my friends at 2 AM:\n\n{brief}\n\nThey didn't ask. I delivered.",
    "POV: You finally understand {topic} and now you can't stop talking about it\n\n{brief}\n\nMy friends are tired. I am not.",
    "{topic} hits different when you actually get it:\n\n{brief}\n\n*mic drop*",
    "Nobody:\n\nAbsolutely nobody:\n\nMe at 3 AM writing about {topic}:\n\n{brief}\n\nI regret nothing",
    "If {topic} were a personality trait, I'd have it in spades:\n\n{brief}\n\nIt's giving obsession",
  ],
  Inspirational: [
    "Your journey with {topic} starts with one step.\n\n{brief}\n\nEvery expert was once a beginner. Keep going.",
    "The best time to start with {topic} was yesterday. The second best time is now.\n\n{brief}\n\nYour future self will thank you.",
    "Dream big. Start small. Act now.\n\n{brief}\n\n{topic} is just the beginning of what's possible for you.",
    "Here's your sign to stop overthinking {topic} and just start:\n\n{brief}\n\nThe world needs what you're building.",
    "You are one decision away from a completely different relationship with {topic}:\n\n{brief}\n\nMake that decision today.",
  ],
  Urgent: [
    "Stop scrolling. This matters.\n\n{topic} is changing fast:\n\n{brief}\n\nDon't get left behind — act now.",
    "This could change everything about how you approach {topic}:\n\n{brief}\n\nThe window won't stay open forever.",
    "Time-sensitive: {topic} is evolving right now.\n\n{brief}\n\nFirst movers win. Are you one of them?",
    "NOW is the moment for {topic}.\n\n{brief}\n\nLater becomes never. Let's go.",
    "Breaking: {topic} just shifted. Here's what you need to know:\n\n{brief}\n\nAct on this before everyone else catches up.",
  ],
  Friendly: [
    "Hey friend! Let's chat about {topic}.\n\n{brief}\n\nHope this makes your day a little easier!",
    "You know what I love talking about? {topic}! Here's the scoop:\n\n{brief}\n\nSending good vibes your way",
    "Just wanted to share something cool about {topic}:\n\n{brief}\n\nHope you find this as exciting as I do!",
    "Friendly reminder that {topic} is awesome and so are you:\n\n{brief}\n\nNow go crush it!",
    "Guess what? I found something amazing about {topic}:\n\n{brief}\n\nHad to share with my favorite people",
  ],
  Bold: [
    "I'm going to say what nobody else will about {topic}:\n\n{brief}\n\nYeah, I said it. And I mean every word.",
    "{topic} needs a reality check. Here it is:\n\n{brief}\n\nWe can keep pretending or we can actually do something about it.",
    "Unpopular opinion on {topic}:\n\n{brief}\n\nThe discomfort is where growth lives. Fight me.",
    "Enough playing it safe with {topic}.\n\n{brief}\n\nGo big or go home. Your choice.",
    "I don't care if this is controversial. {topic} needs to be said:\n\n{brief}\n\nThis is the hill I'm dying on.",
  ],
  Educational: [
    "{topic} — explained simply:\n\n{brief}\n\nSave this post. You'll want to come back to it.",
    "Here's everything I wish I knew about {topic} from day one:\n\n{brief}\n\nKnowledge is power. Share it forward.",
    "Let's break down {topic} step by step:\n\n{brief}\n\nUnderstanding the 'why' makes the 'how' so much easier.",
    "The complete guide to {topic}:\n\n{brief}\n\nBookmark this. Future you will be grateful.",
    "5 things about {topic} that will change how you think:\n\n{brief}\n\nNumber 3 is a game changer.",
  ],
  Witty: [
    "Plot twist: {topic} is actually fascinating once you get past the boring parts.\n\n{brief}\n\n*adjusts intellectual glasses*",
    "If {topic} were a movie, it would be a thriller:\n\n{brief}\n\n*popcorn not included*",
    "Fun fact: {topic} is more interesting than whatever you were about to scroll to.\n\n{brief}\n\nYou're welcome for the entertainment.",
    "Breaking: Local person discovers {topic} is actually cool.\n\n{brief}\n\nMore at 11.",
    "The intersection of {topic} and chaos is my happy place:\n\n{brief}\n\nJoin me, it's fun here",
  ],
  Empathetic: [
    "I know {topic} can feel overwhelming. You're not alone.\n\n{brief}\n\nTake it one step at a time. You've got this.",
    "If you've been struggling with {topic}, this is for you:\n\n{brief}\n\nBe gentle with yourself. Progress isn't linear.",
    "Hey, it's okay if {topic} doesn't come easily.\n\n{brief}\n\nEvery small step forward counts. I'm rooting for you.",
    "To everyone navigating {topic} right now:\n\n{brief}\n\nYour pace is valid. Your journey matters.",
    "Sending love to everyone figuring out {topic} today:\n\n{brief}\n\nYou're doing better than you think.",
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

  const topicTags = topicWords.slice(0, 3);
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
  const { topic, brief, tone, style, platform, language, count, ctaType, customCta, abMode } =
    body;

  if (!topic.trim()) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const templates = CAPTION_TEMPLATES[tone] || CAPTION_TEMPLATES.Professional;
  const rng = seededRandom(Date.now());
  const cta = pickCta(ctaType, customCta);

  const captions: GeneratedCaption[] = [];
  const usedIndices = new Set<number>();

  const actualCount = abMode ? count * 2 : count;

  for (let i = 0; i < Math.min(actualCount, 12); i++) {
    let idx: number;
    do {
      idx = Math.floor(rng() * templates.length);
    } while (usedIndices.has(idx) && usedIndices.size < templates.length);
    usedIndices.add(idx);

    const template = templates[idx];
    let text = template
      .replace(/\{topic\}/g, topic)
      .replace(/\{brief\}/g, brief || "Here's the key insight you need to know.");

    text = translate(text, language);

    const hashtags = pickHashtags(platform, topic, rng);
    const abVariant: "A" | "B" | undefined = abMode
      ? i < count ? "A" : "B"
      : undefined;
    const fullText = cta ? `${text}\n\n${cta}` : text;

    captions.push({
      id: `cap-${Date.now()}-${i}`,
      text: fullText,
      hashtags,
      cta,
      platform,
      tone,
      style,
      language,
      charCount: fullText.length,
      createdAt: Date.now(),
      abVariant,
    });
  }

  return NextResponse.json({ captions });
}
