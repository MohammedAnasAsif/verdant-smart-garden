"use client";

import { useEffect } from "react";
import { useFeedApi } from "@/components/feed-provider";
import type { FeedMessage } from "@/lib/types";

/**
 * Mounts once inside the FeedProvider tree; owns the SSE lifecycle
 * and deep-link restoration (?event=<id>).
 */
export function LiveFeedConnector() {
  const api = useFeedApi();

  // SSE subscription
  useEffect(() => {
    let es: EventSource | null = null;
    let closed = false;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      es = new EventSource("/api/events/stream");

      es.onopen = () => api.getState().setStatus("live");

      es.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as FeedMessage;
          api.getState().applyMessage(msg);
        } catch {
          /* ignore malformed frame */
        }
      };

      es.onerror = () => {
        api.getState().setStatus("offline");
        es?.close();
        retry = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      closed = true;
      if (retry) clearTimeout(retry);
      es?.close();
    };
  }, [api]);

  // deep link: /?event=<id> opens the modal directly
  useEffect(() => {
    try {
      const id = new URLSearchParams(window.location.search).get("event");
      if (id && api.getState().events[id]) {
        api.getState().openEvent(id);
      }
    } catch {
      /* noop */
    }
  }, [api]);

  return null;
}
