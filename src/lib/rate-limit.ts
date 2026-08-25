/**
 * Fixed-window in-memory rate limiter.
 * Per-IP counters with automatic reset + periodic GC.
 * Suitable for a single-node deployment; swap for Redis in multi-node setups.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastGc = Date.now();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): RateLimitResult {
  // opportunistic GC every ~2 min to keep memory bounded
  if (now - lastGc > 120_000) {
    lastGc = now;
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterMs: windowMs };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: Math.max(existing.resetAt - now, 0) };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterMs: existing.resetAt - now };
}

/** Extracts a best-effort client IP from proxy-aware headers. */
export function clientIpFrom(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "127.0.0.1";
}

export function resetRateLimits(): void {
  buckets.clear();
}
