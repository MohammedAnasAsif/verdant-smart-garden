"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventItem, EventFilters, FeedMessage } from "@/lib/types";

export interface ActivityItem {
  id: string;
  text: string;
  category: string;
  at: number;
}

export const DEFAULT_FILTERS: EventFilters = {
  query: "",
  category: "all",
  date: "all",
  price: "all",
  city: "everywhere",
  sort: "soonest",
};

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

  applyMessage: (msg: FeedMessage) => void;
  setStatus: (s: FeedState["status"]) => void;
  patchAttendees: (id: string, attendees: number) => void;
  setFilter: <K extends keyof EventFilters>(key: K, value: EventFilters[K]) => void;
  resetFilters: () => void;
  openEvent: (id: string | null) => void;
  markSeen: () => void;
}

/** Activity strings originate server-side, sanitized defensively anyway. */
function sanitizeActivityText(t: string): string {
  return t.replace(/[<>&"'`]/g, "").slice(0, 140);
}

function indexEvents(events: EventItem[]): Record<string, EventItem> {
  return Object.fromEntries(events.map((e) => [e.id, e]));
}

export function createFeedStore(init?: {
  events: EventItem[];
  viewers?: number;
  liveCount?: number;
}) {
  return createStore<FeedState>()((set, get) => ({
    events: init ? indexEvents(init.events) : {},
    feedOrder: init ? init.events.map((e) => e.id) : [],
    activity: [],
    viewers: init?.viewers ?? 0,
    liveCount: init?.liveCount ?? 0,
    status: "connecting",
    filters: { ...DEFAULT_FILTERS },
    newIds: new Set<string>(),
    selectedId: null,

    applyMessage: (msg) => {
      const s = get();
      switch (msg.type) {
        case "hello":
          set({ viewers: msg.viewers, liveCount: msg.liveCount });
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
          set({ events: { ...s.events, [msg.id]: { ...ev, attendees: msg.attendees } } });
          break;
        }
        case "activity":
          set({
            activity: [
              {
                id: msg.id,
                text: sanitizeActivityText(msg.text),
                category: msg.category,
                at: msg.at,
              },
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
    resetFilters: () => set({ filters: { ...DEFAULT_FILTERS }, newIds: new Set<string>() }),
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

export type FeedStoreApi = ReturnType<typeof createFeedStore>;

/* ---------------- saved events (persisted) ---------------- */

interface SavedState {
  saved: Record<string, true>;
  toggleSaved: (id: string) => boolean;
}

export function createSavedStore() {
  return createStore<SavedState>()(
    persist(
      (set, get) => ({
        saved: {},
        toggleSaved: (id) => {
          const next = { ...get().saved };
          let nowSaved: boolean;
          if (next[id]) {
            delete next[id];
            nowSaved = false;
          } else {
            next[id] = true;
            nowSaved = true;
          }
          set({ saved: next });
          return nowSaved;
        },
      }),
      {
        name: "pulse.saved.v1",
        storage: createJSONStorage(() => localStorage),
        partialize: (s) => ({ saved: s.saved }) as SavedState,
      }
    )
  );
}

export type SavedStoreApi = ReturnType<typeof createSavedStore>;

/* ---------------- contexts ---------------- */

const FeedCtx = createContext<FeedStoreApi | null>(null);
const SavedCtx = createContext<SavedStoreApi | null>(null);

export function FeedProvider({
  children,
  events,
  viewers,
  liveCount,
}: {
  children: React.ReactNode;
  events: EventItem[];
  viewers: number;
  liveCount: number;
}) {
  const ref = useRef<FeedStoreApi | null>(null);
  if (!ref.current) ref.current = createFeedStore({ events, viewers, liveCount });
  return <FeedCtx.Provider value={ref.current}>{children}</FeedCtx.Provider>;
}

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<SavedStoreApi | null>(null);
  if (!ref.current) ref.current = createSavedStore();
  return <SavedCtx.Provider value={ref.current}>{children}</SavedCtx.Provider>;
}

export function useFeed<T>(selector: (s: FeedState) => T): T {
  const ctx = useContext(FeedCtx);
  if (!ctx) throw new Error("useFeed outside FeedProvider");
  return useStore(ctx, selector);
}

export function useFeedApi(): FeedStoreApi {
  const ctx = useContext(FeedCtx);
  if (!ctx) throw new Error("useFeedApi outside FeedProvider");
  return ctx;
}

export function useSaved<T>(selector: (s: SavedState) => T): T {
  const ctx = useContext(SavedCtx);
  if (!ctx) throw new Error("useSaved outside SavedProvider");
  return useStore(ctx, selector);
}
