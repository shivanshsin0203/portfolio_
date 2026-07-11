/**
 * One server-side poller, many SSE subscribers.
 *
 * All connected browsers share this module-level cache, so upstream APIs
 * (GitHub, LeetCode, the product domains) see a constant, tiny request rate
 * no matter how many people are watching the page:
 *   - uptime pings      every 30s
 *   - GitHub events     every 2min  (well inside the unauthenticated 60/hr limit)
 *   - LeetCode stats    every 30min
 * Timers only run while at least one subscriber is connected.
 */
import type { GitHubEvent, LiveSnapshot } from "./types";
import { pingAll, initialProducts } from "./uptime";
import { fetchEvents, fetchProfile, derivePresence } from "./github";
import { fetchLeetCode } from "./leetcode";

const TICK_MS = 30_000;
const GITHUB_EVERY = 4; // ticks
const LEETCODE_EVERY = 60; // ticks

type Subscriber = (snap: LiveSnapshot) => void;

type Store = {
  snapshot: LiveSnapshot;
  events: GitHubEvent[];
  subscribers: Set<Subscriber>;
  timer: ReturnType<typeof setInterval> | null;
  tick: number;
  refreshing: boolean;
  lastGitHubAt: number;
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
    tick: 0,
    refreshing: false,
    lastGitHubAt: 0,
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
  const products = await pingAll();
  store.snapshot = { ...store.snapshot, products };
}

async function refreshGitHub() {
  const [result, gh] = await Promise.all([fetchEvents(), fetchProfile()]);
  store.lastGitHubAt = Date.now();
  if (result) {
    store.events = result.events;
    store.snapshot = {
      ...store.snapshot,
      events: result.events.slice(0, 10),
      presence: derivePresence(result.events, result.latestCommit),
      githubOk: true,
    };
  }
  if (gh) store.snapshot = { ...store.snapshot, github: gh };
}

async function refreshLeetCode() {
  const leetcode = await fetchLeetCode();
  store.lastLeetCodeAt = Date.now();
  if (leetcode) store.snapshot = { ...store.snapshot, leetcode };
}

async function runTick(full: boolean) {
  if (store.refreshing) return;
  store.refreshing = true;
  try {
    const jobs: Promise<void>[] = [refreshUptime()];
    const githubDue =
      full || store.tick % GITHUB_EVERY === 0 || Date.now() - store.lastGitHubAt > GITHUB_EVERY * TICK_MS;
    const leetcodeDue =
      full || Date.now() - store.lastLeetCodeAt > LEETCODE_EVERY * TICK_MS;
    if (githubDue) jobs.push(refreshGitHub());
    if (leetcodeDue) jobs.push(refreshLeetCode());
    await Promise.allSettled(jobs);
    store.tick++;
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
    void runTick(false);
  }, TICK_MS);
  void runTick(true);
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

/** For the JSON snapshot route: refresh once even with no SSE subscribers. */
export async function getFreshSnapshot(): Promise<LiveSnapshot> {
  const stale = Date.now() - new Date(store.snapshot.at).getTime() > TICK_MS;
  if (stale && !store.refreshing) await runTick(true);
  return store.snapshot;
}
