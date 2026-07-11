import { profile } from "@/data/profile";
import type { GitHubEvent, GitHubProfile, Presence } from "./types";

const API = "https://api.github.com";

function headers(): HeadersInit {
  const h: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": "shivansh-portfolio/1.0",
  };
  if (process.env.GITHUB_TOKEN) h.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

type RawEvent = {
  id: string;
  type: string;
  created_at: string;
  repo?: { name?: string };
  payload?: {
    commits?: { message?: string }[];
    action?: string;
    ref_type?: string;
    ref?: string | null;
    pull_request?: { html_url?: string };
  };
};

export type EventsResult = {
  events: GitHubEvent[];
  latestCommit: { message: string; repo: string } | null;
};

function shortRepo(full: string | undefined): string {
  if (!full) return "a repo";
  const [, name] = full.split("/");
  return name ?? full;
}

function describe(e: RawEvent): { verb: string; url: string } | null {
  const repo = shortRepo(e.repo?.name);
  const repoUrl = `https://github.com/${e.repo?.name ?? profile.githubUser}`;
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload?.commits?.length ?? 1;
      return { verb: `pushed ${n} commit${n === 1 ? "" : "s"} to ${repo}`, url: repoUrl };
    }
    case "CreateEvent":
      return {
        verb:
          e.payload?.ref_type === "repository"
            ? `created repository ${repo}`
            : `created ${e.payload?.ref_type ?? "ref"} ${e.payload?.ref ?? ""} in ${repo}`,
        url: repoUrl,
      };
    case "PullRequestEvent":
      return {
        verb: `${e.payload?.action ?? "opened"} a pull request in ${repo}`,
        url: e.payload?.pull_request?.html_url ?? repoUrl,
      };
    case "IssuesEvent":
      return { verb: `${e.payload?.action ?? "opened"} an issue in ${repo}`, url: repoUrl };
    case "IssueCommentEvent":
      return { verb: `commented on an issue in ${repo}`, url: repoUrl };
    case "WatchEvent":
      return { verb: `starred ${repo}`, url: repoUrl };
    case "ForkEvent":
      return { verb: `forked ${repo}`, url: repoUrl };
    case "ReleaseEvent":
      return { verb: `published a release in ${repo}`, url: repoUrl };
    case "PublicEvent":
      return { verb: `open-sourced ${repo}`, url: repoUrl };
    case "DeleteEvent":
      return null; // housekeeping noise
    default:
      return null;
  }
}

export async function fetchEvents(): Promise<EventsResult | null> {
  try {
    const res = await fetch(
      `${API}/users/${profile.githubUser}/events/public?per_page=100`,
      { headers: headers(), cache: "no-store", signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return null;
    const raw = (await res.json()) as RawEvent[];
    const events: GitHubEvent[] = [];
    let latestCommit: EventsResult["latestCommit"] = null;
    for (const e of raw) {
      if (!latestCommit && e.type === "PushEvent" && e.payload?.commits?.length) {
        // commits arrive oldest → newest; the last one is the head of the push
        const head = e.payload.commits[e.payload.commits.length - 1];
        const firstLine = head?.message?.split("\n")[0]?.trim();
        if (firstLine) {
          latestCommit = {
            message: firstLine.length > 90 ? `${firstLine.slice(0, 87)}…` : firstLine,
            repo: shortRepo(e.repo?.name),
          };
        }
      }
      const d = describe(e);
      if (!d) continue;
      events.push({ id: e.id, type: e.type, repo: e.repo?.name ?? "", verb: d.verb, at: e.created_at, url: d.url });
    }
    return { events, latestCommit };
  } catch {
    return null;
  }
}

export async function fetchProfile(): Promise<GitHubProfile> {
  try {
    const res = await fetch(`${API}/users/${profile.githubUser}`, {
      headers: headers(),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const u = (await res.json()) as { public_repos?: number; followers?: number };
    return { repos: u.public_repos ?? 0, followers: u.followers ?? 0 };
  } catch {
    return null;
  }
}

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < MIN) return "just now";
  if (ms < HOUR) return `${Math.floor(ms / MIN)}m ago`;
  if (ms < 24 * HOUR) return `${Math.floor(ms / HOUR)}h ago`;
  const days = Math.floor(ms / (24 * HOUR));
  return days === 1 ? "yesterday" : `${days}d ago`;
}

/** Day-bucketed activity, oldest → newest, in IST. */
function dayBuckets(events: GitHubEvent[], days = 14): number[] {
  const buckets = new Array<number>(days).fill(0);
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: profile.timezone });
  const dayKeys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dayKeys.push(fmt.format(new Date(Date.now() - i * 24 * HOUR)));
  }
  for (const e of events) {
    const key = fmt.format(new Date(e.at));
    const idx = dayKeys.indexOf(key);
    if (idx >= 0) buckets[idx]++;
  }
  return buckets;
}

export function derivePresence(
  events: GitHubEvent[],
  latestCommit: EventsResult["latestCommit"] = null,
): Presence {
  const latest = events[0] ?? null;
  const ageMs = latest ? Date.now() - new Date(latest.at).getTime() : Infinity;

  let state: Presence["state"];
  let label: string;
  if (ageMs < 45 * MIN) {
    state = "live";
    label = "shipping right now";
  } else if (ageMs < 8 * HOUR) {
    state = "today";
    label = "active today";
  } else {
    state = "away";
    label = latest ? `last seen coding ${relativeTime(latest.at)}` : "signal quiet";
  }

  return {
    state,
    label,
    lastEventAt: latest?.at ?? null,
    lastEventLine: latest ? latest.verb : null,
    latestCommit,
    days: dayBuckets(events),
  };
}
