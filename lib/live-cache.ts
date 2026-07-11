/**
 * One server-side poller, many SSE subscribers.
 *
 * All connected browsers share this module-level cache, so upstream APIs
 * (GitHub, LeetCode, the product domains) see a constant, tiny request rate
 * no matter how many people are watching the page:
 *   - uptime pings      every 30s
 *   - GitHub events     every 4min   (~15/hr)
 *   - GitHub profile    every 30min  (~2/hr)   → comfortably inside the 60/hr anonymous cap
 *   - LeetCode stats    every 30min
 * Timers only run while at least one subscriber is connected, and failures
 * never clear previously fetched data.
 */
import type { GitHubEvent, LiveSnapshot } from "./types";
import { pingAll, initialProducts } from "./uptime";
import { fetchEvents, fetchProfile, derivePresence } from "./github";
import { fetchLeetCode } from "./leetcode";

const TICK_MS = 30_000;
const EVENTS_MS = 4 * 60_000;
const PROFILE_MS = 30 * 60_000;
const LEETCODE_MS = 30 * 60_000;
const SNAPSHOT_FRESH_MS = 10_000;

type Subscriber = (snap: LiveSnapshot) => void;

type Store = {
  snapshot: LiveSnapshot;
  events: GitHubEvent[];
  subscribers: Set<Subscriber>;
  timer: ReturnType<typeof setInterval> | null;
  refreshing: boolean;
  lastUptimeAt: number;
  lastEventsAt: number;
  lastProfileAt: number;
  lastLeetCodeAt: number;
};

// Survive dev-mode module reloads without stacking timers.
const g = globalThis as unknown as { __liveStore?: Store };

function freshStore(): Store {
  return {
    snapshot: {
      at: new Date().toISOString(),
      products: initialProducts(),
      presence: null,
      events: [],
      leetcode: null,
      github: null,
      githubOk: false,
      watching: 0,
    },
    events: [],
    subscribers: new Set(),
    timer: null,
    refreshing: false,
    lastUptimeAt: 0,
    lastEventsAt: 0,
    lastProfileAt: 0,
    lastLeetCodeAt: 0,
  };
}

const store: Store = g.__liveStore ?? (g.__liveStore = freshStore());

function broadcast() {
  store.snapshot = { ...store.snapshot, at: new Date().toISOString() };
  for (const fn of store.subscribers) {
    try {
      fn(store.snapshot);
    } catch {
      // subscriber gone; cleanup happens in unsubscribe
    }
  }
}

async function refreshUptime() {
  store.lastUptimeAt = Date.now();
  const products = await pingAll();
  store.snapshot = { ...store.snapshot, products };
}

async function refreshEvents() {
  store.lastEventsAt = Date.now(); // set first so failures back off too
  const result = await fetchEvents();
  if (result) {
    store.events = result.events;
    store.snapshot = {
      ...store.snapshot,
      events: result.events.slice(0, 10),
      presence: derivePresence(result.events, result.latestCommit),
      githubOk: true,
    };
  }
}

async function refreshProfile() {
  store.lastProfileAt = Date.now();
  const gh = await fetchProfile();
  if (gh) store.snapshot = { ...store.snapshot, github: gh };
}

async function refreshLeetCode() {
  store.lastLeetCodeAt = Date.now();
  const leetcode = await fetchLeetCode();
  if (leetcode) store.snapshot = { ...store.snapshot, leetcode };
}

async function runTick() {
  if (store.refreshing) return;
  store.refreshing = true;
  try {
    const jobs: Promise<void>[] = [refreshUptime()];
    if (Date.now() - store.lastEventsAt > EVENTS_MS) jobs.push(refreshEvents());
    if (Date.now() - store.lastProfileAt > PROFILE_MS) jobs.push(refreshProfile());
    if (Date.now() - store.lastLeetCodeAt > LEETCODE_MS) jobs.push(refreshLeetCode());
    await Promise.allSettled(jobs);
    broadcast();
  } finally {
    store.refreshing = false;
  }
}

function ensureLoop() {
  if (store.timer) return;
  store.timer = setInterval(() => {
    if (store.subscribers.size === 0) {
      if (store.timer) clearInterval(store.timer);
      store.timer = null;
      return;
    }
    void runTick();
  }, TICK_MS);
  void runTick();
}

export function getSnapshot(): LiveSnapshot {
  return store.snapshot;
}

function setWatching() {
  store.snapshot = { ...store.snapshot, watching: store.subscribers.size };
}

export function subscribe(fn: Subscriber): () => void {
  store.subscribers.add(fn);
  setWatching();
  broadcast(); // everyone learns the new viewer count immediately
  ensureLoop();
  return () => {
    store.subscribers.delete(fn);
    setWatching();
    broadcast();
  };
}

/** For the JSON snapshot route and the hero's "run a live check" button. */
export async function getFreshSnapshot(): Promise<LiveSnapshot> {
  const stale = Date.now() - store.lastUptimeAt > SNAPSHOT_FRESH_MS;
  if (stale && !store.refreshing) await runTick();
  return store.snapshot;
}
