"use client";

import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventItem, EventFilters, FeedMessage } from "./types";

export interface ActivityItem {
  id: string;
  text: string;
  category: string;
  at: number;
}

export interface FeedState {
  events: Record<string, EventItem>;
  feedOrder: string[];
  activity: ActivityItem[];
  viewers: number;
  liveCount: number;
  status: "connecting" | "live" | "offline";
  filters: EventFilters;
  newIds: Set<string>;
  selectedId: string | null;

  hydrateSnapshot: (events: EventItem[], stats: { viewers: number; liveCount: number }) => void;
  applyMessage: (msg: FeedMessage) => void;
  setStatus: (s: FeedState["status"]) => void;
  patchAttendees: (id: string, attendees: number) => void;
  setFilter: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => void;
  resetFilters: () => void;
  openEvent: (id: string | null) => void;
  markSeen: () => void;
}

export const DEFAULT_FILTERS: EventFilters = {
  query: "",
  category: "all",
  date: "all",
  price: "all",
  city: "everywhere",
  sort: "soonest",
};

export type FeedStore = ReturnType<typeof createFeedStore>;

export function createFeedStore() {
  return createStore<FeedState>()((set, get) => ({
    events: {},
    feedOrder: [],
    activity: [],
    viewers: 0,
    liveCount: 0,
    status: "connecting",
    filters: { ...DEFAULT_FILTERS },
    newIds: new Set<string>(),
    selectedId: null,

    hydrateSnapshot: (events, stats) =>
      set({
        events: Object.fromEntries(events.map((e) => [e.id, e])),
        feedOrder: events.map((e) => e.id),
        viewers: stats.viewers,
        liveCount: stats.liveCount,
      }),

    applyMessage: (msg) => {
      const s = get();
      switch (msg.type) {
        case "hello":
          set({ viewers: msg.viewers, liveCount: msg.liveCount, status: "live" });
          break;
        case "event:new": {
          if (s.events[msg.event.id]) break;
          set({
            events: { ...s.events, [msg.event.id]: msg.event },
            feedOrder: [msg.event.id, ...s.feedOrder],
            newIds: new Set(s.newIds).add(msg.event.id),
          });
          break;
        }
        case "event:update": {
          const ev = s.events[msg.id];
          if (!ev || ev.attendees === msg.attendees) break;
          set({
            events: { ...s.events, [msg.id]: { ...ev, attendees: msg.attendees } },
          });
          break;
        }
        case "activity":
          set({
            activity: [
              { id: msg.id, text: sanitizeActivityText(msg.text), category: msg.category, at: msg.at },
              ...s.activity,
            ].slice(0, 5),
          });
          break;
        case "viewers":
          set({ viewers: msg.viewers });
          break;
      }
    },

    setStatus: (status) => set({ status }),
    patchAttendees: (id, attendees) => {
      const ev = get().events[id];
      if (!ev) return;
      set({ events: { ...get().events, [id]: { ...ev, attendees } } });
    },

    setFilter: (key, value) =>
      set({ filters: { ...get().filters, [key]: value }, newIds: new Set<string>() }),

    resetFilters: () =>
      set({ filters: { ...DEFAULT_FILTERS }, newIds: new Set<string>() }),

    openEvent: (id) => {
      set({ selectedId: id });
      try {
        const url = new URL(window.location.href);
        if (id) url.searchParams.set("event", id);
        else url.searchParams.delete("event");
        window.history.replaceState(null, "", url.toString());
      } catch {
        /* noop */
      }
    },

    markSeen: () => set({ newIds: new Set<string>() }),
  }));
}

/** Activity strings originate server-side, but we sanitize defensively anyway. */
function sanitizeActivityText(t: string): string {
  return t.replace(/[<>&"'`]/g, "").slice(0, 140);
}

/* ---------------- persistence for saved events ---------------- */

export interface SavedState {
  saved: Record<string, true>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  savedCount: () => number;
}

export function createSavedStore() {
  return createStore<SavedState>()(
    persist(
      (set, get) => ({
        saved: {},
        toggleSaved: (id) => {
          const next = { ...get().saved };
          if (next[id]) delete next[id];
          else next[id] = true;
          set({ saved: next });
        },
        isSaved: (id) => Boolean(get().saved[id]),
        savedCount: () => Object.keys(get().saved).length,
      }),
      {
        name: "pulse.saved.v1",
        storage: createJSONStorage(() => localStorage),
        partialize: (s) => ({ saved: s.saved }),
      }
    )
  );
}

/* ---------------- contexts ---------------- */

export const FeedStoreContext = createContext<FeedStore | null>(null);
export const SavedStoreContext = createContext<ReturnType<typeof createSavedStore> | null>(null);

export function useFeedStore<T>(selector: (s: FeedState) => T): T {
  const ctx = useContext(FeedStoreContext);
  if (!ctx) throw new Error("useFeedStore must be used within FeedProvider");
  return useStore(ctx, selector);
}

export function useSavedStore<T>(selector: (s: SavedState) => T): T {
  const ctx = useContext(SavedStoreContext);
  if (!ctx) throw new Error("useSavedStore must be used within SavedProvider");
  return useStore(ctx, selector);
}
