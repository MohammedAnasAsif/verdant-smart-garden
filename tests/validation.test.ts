import { describe, it, expect } from "vitest";
import { eventsQuerySchema, uuidSchema } from "@/lib/validation";
import { applyFilters } from "@/lib/filters";
import type { EventItem } from "@/lib/types";

describe("eventsQuerySchema — API input validation", () => {
  it("accepts a clean query", () => {
    const r = eventsQuerySchema.safeParse({ query: "ramen", category: "food", limit: "20" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.limit).toBe(20);
  });

  it("coerces numeric strings and clamps limit into the allowed range", () => {
    const big = eventsQuerySchema.safeParse({ limit: "5000" });
    expect(big.success).toBe(true);
    if (big.success) expect(big.data.limit).toBe(100);

    const small = eventsQuerySchema.safeParse({ limit: "0" });
    expect(small.success).toBe(true);
    if (small.success) expect(small.data.limit).toBe(1);

    const junk = eventsQuerySchema.safeParse({ limit: "<script>" });
    expect(junk.success).toBe(true);
    if (junk.success) expect(junk.data.limit).toBe(60); // NaN → default
  });

  it("falls back to defaults for hostile enum values instead of throwing", () => {
    const r = eventsQuerySchema.safeParse({ category: "<script>", date: "DROP TABLE" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.category).toBe("all");
      expect(r.data.date).toBe("all");
    }
  });

  it("sanitizes the query field", () => {
    const r = eventsQuerySchema.safeParse({ query: "<script>x</script>" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.query).not.toContain("<");
  });

  it("caps query length", () => {
    const r = eventsQuerySchema.safeParse({ query: "a".repeat(300) });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.query.length).toBeLessThanOrEqual(80);
  });

  it("clamps negative offsets to 0", () => {
    const r = eventsQuerySchema.safeParse({ offset: "-5" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.offset).toBe(0);
  });
});

describe("uuidSchema", () => {
  it("accepts valid v4 uuids and rejects everything else", () => {
    expect(uuidSchema.safeParse("3f2504e0-4f89-11d3-9a0c-0305e82c3301").success).toBe(true);
    for (const bad of ["1", "../../etc/passwd", "'; --", "null", ""]) {
      expect(uuidSchema.safeParse(bad).success).toBe(false);
    }
  });
});

/* ---------------- filter logic ---------------- */

function ev(partial: Partial<EventItem>): EventItem {
  const now = 1_700_000_000_000;
  return {
    id: partial.id ?? "00000000-0000-4000-8000-000000000000",
    title: partial.title ?? "Test Event",
    description: "d",
    category: partial.category ?? "music",
    image: "",
    imageSeed: "seed",
    aspect: "square",
    startsAt: partial.startsAt ?? now + 3600_000,
    endsAt: partial.endsAt ?? now + 4 * 3600_000,
    venue: partial.venue ?? { name: "V", neighborhood: "N", lat: 0, lng: 0 },
    city: partial.city ?? "Berlin",
    priceMin: partial.priceMin ?? 10,
    priceMax: partial.priceMax ?? 20,
    capacity: partial.capacity ?? 100,
    attendees: partial.attendees ?? 50,
    host: partial.host ?? { name: "H", verified: false },
    tags: partial.tags ?? [],
    trending: partial.trending ?? false,
    createdAt: now - 1000,
  };
}

const NOW = 1_700_000_000_000;

describe("applyFilters", () => {
  it("filters by category", () => {
    const out = applyFilters(
      [ev({ category: "music" }), ev({ category: "food" })],
      { category: "food" },
      NOW
    );
    expect(out).toHaveLength(1);
    expect(out[0].category).toBe("food");
  });

  it("excludes ended events", () => {
    const ended = ev({ startsAt: NOW - 7200_000, endsAt: NOW - 3600_000 });
    const live = ev({ startsAt: NOW - 600_000, endsAt: NOW + 3600_000 });
    const out = applyFilters([ended, live], {}, NOW);
    expect(out.map((e) => e.id)).toEqual([live.id]);
  });

  it("free/paid price filters", () => {
    const free = ev({ priceMin: 0, priceMax: 0 });
    const paid = ev({ priceMin: 15, priceMax: 25 });
    expect(applyFilters([free, paid], { price: "free" }, NOW)).toHaveLength(1);
    expect(applyFilters([free, paid], { price: "paid" }, NOW)).toHaveLength(1);
  });

  it("matches search across title, venue, host, tags case-insensitively", () => {
    const e = ev({ title: "Vinyl Night", venue: { name: "Echo Hall", neighborhood: "Mitte", lat: 0, lng: 0 }, tags: ["hidden-gem"] });
    expect(applyFilters([e], { query: "vinyl" }, NOW)).toHaveLength(1);
    expect(applyFilters([e], { query: "MITTE" }, NOW)).toHaveLength(1);
    expect(applyFilters([e], { query: "gem" }, NOW)).toHaveLength(1);
    expect(applyFilters([e], { query: "nonexistent" }, NOW)).toHaveLength(0);
  });

  it("sorts soonest first by default", () => {
    const later = ev({ id: "b", startsAt: NOW + 5 * 3600_000 });
    const sooner = ev({ id: "a", startsAt: NOW + 3600_000 });
    const out = applyFilters([later, sooner], { sort: "soonest" }, NOW);
    expect(out[0].id).toBe("a");
  });

  it("sorts popular by attendees", () => {
    const small = ev({ attendees: 5 });
    const big = ev({ attendees: 90 });
    const out = applyFilters([small, big], { sort: "popular" }, NOW);
    expect(out[0].attendees).toBe(90);
  });
});
