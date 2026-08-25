import { z } from "zod";
import { CITIES, EVENT_CATEGORIES } from "./types";
import { sanitizeText } from "./sanitize";

const CITY_OPTIONS = ["everywhere", ...CITIES] as const;
const CATEGORY_OPTIONS = ["all", ...EVENT_CATEGORIES] as const;

const cityEnum = z.enum(CITY_OPTIONS);
const categoryEnum = z.enum(CATEGORY_OPTIONS);

function clampInt(v: unknown, def: number, min: number, max: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/**
 * GET /api/events query schema.
 * Design principle: hostile or malformed values degrade to safe
 * defaults / truncation instead of surfacing validation errors.
 */
export const eventsQuerySchema = z.object({
  query: z
    .unknown()
    .optional()
    .transform((v) => sanitizeText(typeof v === "string" ? v : "", 80)),
  category: categoryEnum.optional().catch("all"),
  date: z.enum(["all", "today", "tomorrow", "weekend", "week"]).optional().catch("all"),
  price: z.enum(["all", "free", "paid"]).optional().catch("all"),
  city: cityEnum.optional().catch("everywhere"),
  sort: z.enum(["soonest", "trending", "popular"]).optional().catch("soonest"),
  limit: z.unknown().optional().transform((v) => clampInt(v, 60, 1, 100)),
  offset: z.unknown().optional().transform((v) => clampInt(v, 0, 0, 10_000)),
});

export type EventsQuery = z.infer<typeof eventsQuerySchema>;

export const uuidSchema = z.string().uuid();

/** POST /api/events/:id/rsvp body (currently empty, reserved for future fields) */
export const rsvpBodySchema = z.object({}).strict();
