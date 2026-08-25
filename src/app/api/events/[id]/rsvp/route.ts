import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/store";
import { rsvpBodySchema, uuidSchema } from "@/lib/validation";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = clientIpFrom(req.headers);
  // strict budget: 8 RSVPs / minute / IP
  const rl = rateLimit(`rsvp:${ip}`, 8, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
        },
      }
    );
  }

  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  // reject unexpected bodies (defense in depth)
  let raw: unknown = {};
  try {
    const text = await req.text();
    if (text.length > 0) raw = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!rsvpBodySchema.safeParse(raw).success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const result = store.rsvp(id);
  switch (result) {
    case "not_found":
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    case "full":
      return NextResponse.json({ error: "sold_out" }, { status: 409 });
    default:
      return NextResponse.json(
        { ok: true, attendees: result.attendees },
        { headers: { "Cache-Control": "no-store" } }
      );
  }
}
