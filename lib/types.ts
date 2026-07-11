export type ProductState = "operational" | "slow" | "offline" | "checking";

export type ProductStatus = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  state: ProductState;
  latencyMs: number | null;
  checkedAt: string; // ISO
};

export type GitHubEvent = {
  id: string;
  type: string;
  repo: string;
  verb: string; // "pushed 3 commits to"
  at: string; // ISO
  url: string;
};

export type PresenceState = "live" | "today" | "away";

export type Presence = {
  state: PresenceState;
  label: string; // "shipping right now"
  lastEventAt: string | null;
  lastEventLine: string | null; // "pushed 3 commits to gitdocs"
  /** first line of the newest commit message, straight from the push payload */
  latestCommit: { message: string; repo: string } | null;
  /** events per day, oldest → newest, last 14 days (IST) */
  days: number[];
};

export type LeetCodeStats = {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number | null;
} | null;

export type GitHubProfile = {
  repos: number;
  followers: number;
} | null;

export type LiveSnapshot = {
  at: string;
  products: ProductStatus[];
  presence: Presence | null;
  events: GitHubEvent[];
  leetcode: LeetCodeStats;
  github: GitHubProfile;
  /** true once real github data has loaded at least once */
  githubOk: boolean;
  /** open SSE connections to this page right now (including you) */
  watching: number;
};
