"use client";

import { useEffect } from "react";
import { useFeedApi } from "@/components/feed-provider";

/**
 * Mounts once inside the FeedProvider tree; owns the SSE lifecycle
 * and deep-link restoration (?event=<id>).
 * Static build: SSE endpoint unavailable, status stays offline.
 */
export function LiveFeedConnector() {
  const api = useFeedApi();

  useEffect(() => {
    api.getState().setStatus("offline");
  }, [api]);

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
