import { NextRequest, NextResponse } from "next/server";
import { store, applyFilters } from "@/lib/store";
import { eventsQuerySchema } from "@/lib/validation";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  const rl = rateLimit(`events:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const sp = req.nextUrl.searchParams;
  const parsed = eventsQuerySchema.safeParse({
    query: sp.get("query") ?? undefined,
    category: sp.get("category") ?? undefined,
    date: sp.get("date") ?? undefined,
    price: sp.get("price") ?? undefined,
    city: sp.get("city") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    limit: sp.get("limit") ?? undefined,
    offset: sp.get("offset") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const f = parsed.data;
  const filtered = applyFilters(store.getAll(), f);
  const page = filtered.slice(f.offset, f.offset + f.limit);

  return NextResponse.json(
    { total: filtered.length, offset: f.offset, events: page },
    { headers: { "Cache-Control": "no-store" } }
  );
}
