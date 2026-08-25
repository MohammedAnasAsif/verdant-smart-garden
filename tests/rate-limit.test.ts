import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, resetRateLimits } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => resetRateLimits());

  it("allows requests under the limit", () => {
    const now = 1_000_000;
    expect(rateLimit("k1", 3, 60_000, now).ok).toBe(true);
    expect(rateLimit("k1", 3, 60_000, now + 1).ok).toBe(true);
    expect(rateLimit("k1", 3, 60_000, now + 2).ok).toBe(true);
    expect(rateLimit("k1", 3, 60_000, now + 3).remaining).toBe(0);
  });

  it("blocks the request that exceeds the limit", () => {
    const now = 2_000_000;
    for (let i = 0; i < 8; i++) {
      expect(rateLimit("rsvp:ip", 8, 60_000, now).ok).toBe(true);
    }
    const blocked = rateLimit("rsvp:ip", 8, 60_000, now + 10);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after the window elapses", () => {
    const now = 3_000_000;
    for (let i = 0; i < 6; i++) rateLimit("sse:ip", 6, 5_000, now);
    expect(rateLimit("sse:ip", 6, 5_000, now + 100).ok).toBe(false);
    // window is 5s — at +5001ms a fresh bucket starts
    expect(rateLimit("sse:ip", 6, 5_000, now + 5_001).ok).toBe(true);
  });

  it("isolates keys per client", () => {
    const now = 4_000_000;
    rateLimit("a", 1, 60_000, now);
    expect(rateLimit("a", 1, 60_000, now).ok).toBe(false);
    expect(rateLimit("b", 1, 60_000, now).ok).toBe(true);
  });
});
