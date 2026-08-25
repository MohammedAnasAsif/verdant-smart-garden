import { randomUUID } from "crypto";
import type {
  City,
  EventCategory,
  EventItem,
  FeedMessage,
} from "./types";
import { CITIES } from "./types";

/* ------------------------------------------------------------------ */
/* Content pools used by the seeder + live generator                   */
/* ------------------------------------------------------------------ */

const TITLES: Record<EventCategory, string[]> = {
  music: [
    "Rooftop Jazz Sessions",
    "Vinyl Only: Deep Cuts Night",
    "Midnight Synth Waveform",
    "Chamber Music by Candlelight",
    "Basement Drum & Bass",
    "Acoustic Sunset Circle",
  ],
  nightlife: [
    "Neon Warehouse Rave",
    "Silent Disco: Rooftop Edition",
    "After Hours Listening Bar",
    "Disco Ballroom Revival",
    "Late Night Karaoke League",
  ],
  art: [
    "Analog Photography Open Wall",
    "Ceramics Studio Social",
    "Street Art Walking Tour",
    "Life Drawing: Long Pose Night",
    "Independent Zine Fair",
  ],
  food: [
    "Midnight Ramen Pop-Up",
    "Natural Wine Tasting Social",
    "Sunday Bakery Crawl",
    "Omakase Counter Experience",
    "Farm Table Supper Club",
  ],
  tech: [
    "Indie Dev Show & Tell",
    "AI Builders Demo Night",
    "Open Source Contribution Day",
    "Hardware Hacking Workshop",
    "Design Systems Meetup",
  ],
  wellness: [
    "Sunrise Rooftop Yoga",
    "Cold Plunge & Sauna Ritual",
    "Sound Bath Meditation",
    "5K Sunrise Run Club",
    "Tea Ceremony Workshop",
  ],
  sports: [
    "Midnight Pickup Basketball",
    "Bouldering Social Climb",
    "Riverside Cycle Sprint",
    "Beach Volleyball League Night",
    "Table Tennis Tournament",
  ],
  film: [
    "35mm Cult Classics",
    "Rooftop Cinema: Director's Cut",
    "Short Film Slam",
    "Documentary Preview Night",
  ],
  community: [
    "Neighborhood Swap Meet",
    "Board Game Longplay Cafe",
    "Community Garden Workday",
    "Language Exchange Social",
    "Vintage Flea Market",
  ],
};

const DESCRIPTIONS = [
  "A small-room gathering with big energy. Expect good people, better sound, and zero pretense.",
  "Doors open early, the room fills slowly, and by hour two nobody wants to leave.",
  "Come for the main act, stay for the conversations that spill onto the street after.",
  "Low-key, high-taste. Bring a friend who appreciates the details.",
  "The kind of night you describe to people a week later, still smiling about it.",
  "Limited capacity on purpose — everyone here chose to be.",
];

const HOSTS = [
  { name: "Field Notes Collective", verified: true },
  { name: "Mara Ellison", verified: true },
  { name: "The Late Shift", verified: false },
  { name: "Jonas Reyer", verified: true },
  { name: "Studio Common", verified: true },
  { name: "Priya Anand", verified: false },
  { name: "Northside Social Club", verified: true },
  { name: "Kenji Watanabe", verified: false },
  { name: "Halcyon Group", verified: true },
  { name: "June Okafor", verified: false },
];

const TAG_POOL = [
  "indoor",
  "outdoor",
  "18+",
  "all-ages",
  "beginner-friendly",
  "sold-out-last-time",
  "hidden-gem",
  "walk-ins-ok",
  "rain-or-shine",
  "dog-friendly",
];

const VENUES: Record<City, { name: string; neighborhood: string; lat: number; lng: number }[]> = {
  "New York": [
    { name: "The Loft on Grand", neighborhood: "SoHo", lat: 40.724, lng: -74.002 },
    { name: "Basement @ Bowery", neighborhood: "Lower East Side", lat: 40.722, lng: -73.987 },
    { name: "Prospect Park Nethermead", neighborhood: "Park Slope", lat: 40.66, lng: -73.963 },
    { name: "Industry Kitchen Rooftop", neighborhood: "Tribeca", lat: 40.715, lng: -74.009 },
    { name: "The Greenpoint Monastery", neighborhood: "Greenpoint", lat: 40.73, lng: -73.954 },
  ],
  "Los Angeles": [
    { name: "Echopark Supply Co.", neighborhood: "Echo Park", lat: 34.078, lng: -118.261 },
    { name: "The Roof on Wilshire", neighborhood: "Koreatown", lat: 34.062, lng: -118.3 },
    { name: "Highland Park Yard", neighborhood: "Highland Park", lat: 34.13, lng: -118.19 },
    { name: "Smorgasburg Alley Stage", neighborhood: "Downtown", lat: 34.043, lng: -118.235 },
    { name: "Silver Lake Meadow", neighborhood: "Silver Lake", lat: 34.086, lng: -118.274 },
  ],
  London: [
    { name: "The Bussey Building", neighborhood: "Peckham", lat: 51.474, lng: -0.069 },
    { name: "Vaults @ Waterloo", neighborhood: "Waterloo", lat: 51.504, lng: -0.111 },
    { name: "Victoria Park Pavilion", neighborhood: "Hackney", lat: 51.534, lng: -0.036 },
    { name: "The Camden Assembly Rooms", neighborhood: "Camden", lat: 51.539, lng: -0.143 },
    { name: "Wapping Project Annex", neighborhood: "Wapping", lat: 51.505, lng: -0.058 },
  ],
  Berlin: [
    { name: "Kraftwerk Halle", neighborhood: "Mitte", lat: 52.512, lng: 13.421 },
    { name: "Grunewald Pavillon", neighborhood: "Charlottenburg", lat: 52.502, lng: 13.31 },
    { name: "Funkturm Social Club", neighborhood: "Kreuzberg", lat: 52.497, lng: 13.42 },
    { name: "Treptower Ateliers", neighborhood: "Treptow", lat: 52.49, lng: 13.468 },
    { name: "The Wedding Bunker", neighborhood: "Wedding", lat: 52.55, lng: 13.36 },
  ],
  Tokyo: [
    { name: "WWW X Shibuya", neighborhood: "Shibuya", lat: 35.659, lng: 139.7 },
    { name: "Nakameguro Riverside", neighborhood: "Meguro", lat: 35.644, lng: 139.699 },
    { name: "Golden Gai Soundroom", neighborhood: "Shinjuku", lat: 35.693, lng: 139.706 },
    { name: "Kiyosumi Garden Hall", neighborhood: "Koto", lat: 35.687, lng: 139.789 },
    { name: "Yanaka Culture House", neighborhood: "Taito", lat: 35.728, lng: 139.767 },
  ],
  Paris: [
    { name: "Le Trabendo Hall", neighborhood: "19e", lat: 48.889, lng: 2.388 },
    { name: "Canal Saint-Martin Quay", neighborhood: "10e", lat: 48.871, lng: 2.365 },
    { name: "La Cité Radieuse Roof", neighborhood: "13e", lat: 48.83, lng: 2.364 },
    { name: "Belleville Atelier 12", neighborhood: "20e", lat: 48.872, lng: 2.377 },
    { name: "Palais de Tokyo Terrace", neighborhood: "16e", lat: 48.864, lng: 2.297 },
  ],
};

const ASPECTS: EventItem["aspect"][] = ["portrait", "tall", "square", "landscape"];

function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function imageFor(seed: string, aspect: EventItem["aspect"]): string {
  const dims =
    aspect === "portrait"
      ? [800, 1000]
      : aspect === "tall"
        ? [800, 1200]
        : aspect === "square"
          ? [900, 900]
          : [1200, 900];
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${dims[0]}/${dims[1]}`;
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

type Subscriber = (msg: FeedMessage) => void;

class EventStore {
  private events = new Map<string, EventItem>();
  private subscribers = new Set<Subscriber>();
  private viewers = 128;
  private timer: ReturnType<typeof setInterval> | null = null;
  private startedAt = Date.now();

  constructor() {
    this.seed();
    this.startGenerator();
  }

  /* ---------------- seeding ---------------- */

  private makeEvent(
    category: EventCategory,
    cityIndex: number,
    startOffsetMs: number,
    durationMs: number,
    index: number
  ): EventItem {
    const rand = seededRandom(`${category}-${cityIndex}-${index}-${Math.floor(startOffsetMs / 3.6e6)}`);
    const titles = TITLES[category];
    const title = titles[Math.floor(rand() * titles.length)] ?? titles[index % titles.length];
    const city = CITIES[cityIndex % CITIES.length];
    const venueList = VENUES[city];
    const venue = venueList[Math.floor(rand() * venueList.length)];
    const host = HOSTS[Math.floor(rand() * HOSTS.length)];
    const aspect = ASPECTS[index % ASPECTS.length];
    const free = rand() < 0.32;
    const priceMin = free ? 0 : 8 + Math.floor(rand() * 40);
    const priceMax = free ? 0 : priceMin + Math.floor(rand() * 30);
    const capacity = 40 + Math.floor(rand() * 220);
    const fillRatio = 0.25 + rand() * 0.7;
    const id = randomUUID();
    const seed = `${title}-${venue.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const tagCount = 1 + Math.floor(rand() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = TAG_POOL[Math.floor(rand() * TAG_POOL.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    const startsAt = this.startedAt + startOffsetMs;
    const createdAt = startsAt - (2 + Math.floor(rand() * 96)) * 3600_000;

    return {
      id,
      title,
      description: DESCRIPTIONS[index % DESCRIPTIONS.length],
      category,
      image: imageFor(seed, aspect),
      imageSeed: seed,
      aspect,
      startsAt,
      endsAt: startsAt + durationMs,
      venue,
      city,
      priceMin,
      priceMax,
      capacity,
      attendees: Math.min(capacity - 2, Math.round(capacity * fillRatio)),
      host,
      tags,
      trending: rand() < 0.22,
      createdAt,
    };
  }

  private seed(): void {
    const categories = Object.keys(TITLES) as EventCategory[];
    let index = 0;
    // spread events from -3h to +10 days across all cities/categories
    const slots = 56;
    for (let s = 0; s < slots; s++) {
      const category = categories[s % categories.length];
      const cityIndex = Math.floor(seededRandom(`city-${s}`)() * CITIES.length);
      const offsetMs = -3 * 3600_000 + Math.floor((s / slots) * 10.5 * 24 * 3600_000);
      const jitter = Math.floor(seededRandom(`j-${s}`)() * 5 * 3600_000);
      const durationMs = (2 + Math.floor(seededRandom(`d-${s}`)() * 4)) * 3600_000;
      const ev = this.makeEvent(category, cityIndex, offsetMs + jitter, durationMs, index++);
      this.events.set(ev.id, ev);
    }

    // guarantee a lively opening state: events live RIGHT NOW + starting soon
    for (let i = 0; i < 4; i++) {
      const startedMinAgo = 8 + i * 22; // started 8–74 min ago
      const ev = this.makeEvent(
        categories[(i * 2) % categories.length],
        Math.floor(seededRandom(`live-city-${i}`)() * CITIES.length),
        -startedMinAgo * 60_000,
        (2 + i) * 3600_000,
        index++
      );
      ev.attendees = Math.min(ev.capacity - 2, ev.attendees + 12);
      ev.trending = true;
      this.events.set(ev.id, ev);
    }
    for (let i = 0; i < 3; i++) {
      const inMin = 18 + i * 14; // starts within 18–46 min
      const ev = this.makeEvent(
        categories[(i * 3 + 1) % categories.length],
        Math.floor(seededRandom(`soon-city-${i}`)() * CITIES.length),
        inMin * 60_000,
        3 * 3600_000,
        index++
      );
      ev.attendees = Math.round(ev.capacity * 0.55);
      this.events.set(ev.id, ev);
    }
  }

  /* ---------------- live generator ---------------- */

  private startGenerator(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), 6500);
    if (typeof this.timer === "object" && "unref" in this.timer) {
      (this.timer as unknown as { unref: () => void }).unref();
    }
  }

  private tick(): void {
    const now = Date.now();
    const roll = Math.random();

    if (roll < 0.62) {
      // mutate an upcoming/live event's attendee count
      const list = [...this.events.values()].filter((e) => e.endsAt > now);
      if (list.length === 0) return;
      const ev = list[Math.floor(Math.random() * list.length)];
      const delta = Math.random() < 0.72 ? 1 + Math.floor(Math.random() * 3) : -1;
      ev.attendees = Math.max(0, Math.min(ev.capacity, ev.attendees + delta));
      this.broadcast({
        type: "event:update",
        id: ev.id,
        attendees: ev.attendees,
        statusHint: null,
      });
      if (delta > 0 && Math.random() < 0.5) {
        this.broadcastActivity(
          `${HOSTS[Math.floor(Math.random() * HOSTS.length)].name} checked in to ${ev.title}`,
          "rsvp"
        );
      }
    } else if (roll < 0.86) {
      // discover a brand-new event
      const categories = Object.keys(TITLES) as EventCategory[];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const inHours = 2 + Math.random() * 70;
      const ev = this.makeEvent(
        category,
        Math.floor(Math.random() * CITIES.length),
        inHours * 3600_000,
        (2 + Math.floor(Math.random() * 4)) * 3600_000,
        Math.floor(Math.random() * 10_000)
      );
      ev.createdAt = now;
      this.events.set(ev.id, ev);
      this.broadcast({ type: "event:new", event: ev });
      this.broadcastActivity(`New discovery: ${ev.title} · ${ev.city}`, ev.category);
    } else {
      // ambient viewers drift
      const drift = Math.floor(Math.random() * 21) - 10;
      this.viewers = Math.max(42, this.viewers + drift);
      this.broadcast({ type: "viewers", viewers: this.viewers });
    }
  }

  private broadcastActivity(
    text: string,
    category: Extract<FeedMessage, { type: "activity" }>["category"]
  ): void {
    this.broadcast({
      type: "activity",
      id: randomUUID(),
      text,
      category,
      at: Date.now(),
    });
  }

  /* ---------------- public API ---------------- */

  subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  private broadcast(msg: FeedMessage): void {
    for (const fn of this.subscribers) {
      try {
        fn(msg);
      } catch {
        this.subscribers.delete(fn);
      }
    }
  }

  getViewers(): number {
    return this.viewers;
  }

  getStats(): { viewers: number; liveCount: number; totalEvents: number } {
    const now = Date.now();
    let liveCount = 0;
    for (const e of this.events.values()) {
      if (e.startsAt <= now && e.endsAt > now) liveCount++;
    }
    return { viewers: this.viewers, liveCount, totalEvents: this.events.size };
  }

  getAll(): EventItem[] {
    return [...this.events.values()];
  }

  getById(id: string): EventItem | undefined {
    return this.events.get(id);
  }

  /** RSVP — returns null when the event does not exist, "full" when at capacity. */
  rsvp(id: string): { ok: true; attendees: number } | "not_found" | "full" {
    const ev = this.events.get(id);
    if (!ev) return "not_found";
    if (ev.attendees >= ev.capacity) return "full";
    ev.attendees += 1;
    return { ok: true, attendees: ev.attendees };
  }
}

/* ---------------- shared filter/sort logic lives in ./filters ---------------- */

export { applyFilters } from "./filters";

// one instance per server process
const globalForStore = globalThis as unknown as { __pulseStore?: EventStore };
export const store: EventStore = globalForStore.__pulseStore ?? new EventStore();
globalForStore.__pulseStore = store;
