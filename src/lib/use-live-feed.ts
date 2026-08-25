"use client";

import { useEffect } from "react";
import { useFeedStore } from "./client-store";
import type { FeedMessage } from "./types";

/**
 * Subscribes to the SSE feed and dispatches messages into the store.
 * EventSource handles reconnection natively; we only track status.
 */
export function useLiveFeed(): void {
  const applyMessage = useFeedStore((s) => s.applyMessage);
  const setStatus = useFeedStore((s) => s.setStatus);

  useEffect(() => {
    let es: EventSource | null = null;
    let closed = false;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      es = new EventSource("/api/events/stream");

      es.onopen = () => setStatus("live");

      es.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as FeedMessage;
          applyMessage(msg);
        } catch {
          /* ignore malformed frames */
        }
      };

      es.onerror = () => {
        setStatus("connecting");
        es?.close();
        // gentle backoff; EventSource also retries on its own when not closed
        retryTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      closed = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  }, [applyMessage, setStatus]);
}
