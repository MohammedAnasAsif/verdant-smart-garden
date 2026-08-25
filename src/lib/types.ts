export const EVENT_CATEGORIES = [
  "music",
  "nightlife",
  "art",
  "food",
  "tech",
  "wellness",
  "sports",
  "film",
  "community",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const CITIES = [
  "New York",
  "Los Angeles",
  "London",
  "Berlin",
  "Tokyo",
  "Paris",
] as const;

export type City = (typeof CITIES)[number];

export interface Venue {
  name: string;
  neighborhood: string;
  lat: number;
  lng: number;
}

export interface EventHost {
  name: string;
  verified: boolean;
}

export type EventStatus = "scheduled" | "live" | "ended";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  image: string;
  imageSeed: string;
  aspect: "portrait" | "tall" | "square" | "landscape";
  startsAt: number;
  endsAt: number;
  venue: Venue;
  city: City;
  priceMin: number;
  priceMax: number;
  capacity: number;
  attendees: number;
  host: EventHost;
  tags: string[];
  trending: boolean;
  createdAt: number;
}

/** Payloads pushed over the SSE stream */
export type FeedMessage =
  | { type: "hello"; viewers: number; liveCount: number; totalEvents: number; serverTime: number }
  | { type: "event:new"; event: EventItem }
  | { type: "event:update"; id: string; attendees: number; statusHint: "live" | "ending_soon" | null }
  | { type: "activity"; id: string; text: string; category: EventCategory | "rsvp"; at: number }
  | { type: "viewers"; viewers: number };

export interface EventFilters {
  query: string;
  category: EventCategory | "all";
  date: "all" | "today" | "tomorrow" | "weekend" | "week";
  price: "all" | "free" | "paid";
  city: City | "everywhere";
  sort: "soonest" | "trending" | "popular";
}
