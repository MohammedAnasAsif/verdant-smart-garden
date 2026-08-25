import { NextRequest } from "next/server";
import { store } from "@/lib/store";
import { clientIpFrom, rateLimit } from "@/lib/rate-limit";
import type { FeedMessage } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events stream: pushes live feed messages to connected clients.
 * - max 6 concurrent connections per IP
 * - heartbeat comment every 20s keeps intermediaries from closing the pipe
 */
export async function GET(req: NextRequest) {
  const ip = clientIpFrom(req.headers);
  const rl = rateLimit(`sse:${ip}`, 6, 60_000);
  if (!rl.ok) {
    return new Response("rate limited", {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (msg: FeedMessage) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(msg)}\n\n`));
        } catch {
          cleanup();
        }
      };

      const unsub = store.subscribe(send);

      // initial hello so the client can paint live stats immediately
      send({ type: "hello", ...store.getStats(), serverTime: Date.now() });

      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          cleanup();
        }
      }, 20_000);

      function cleanup() {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        unsub();
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }

      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
