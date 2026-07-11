import { profile } from "@/data/profile";
import type { LeetCodeStats } from "./types";

const QUERY = `
query userStats($username: String!) {
  matchedUser(username: $username) {
    profile { ranking }
    submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
  }
}`;

export async function fetchLeetCode(): Promise<LeetCodeStats> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: "https://leetcode.com",
        "user-agent": "Mozilla/5.0 (compatible; shivansh-portfolio/1.0)",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: profile.leetcodeUser } }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        matchedUser?: {
          profile?: { ranking?: number };
          submitStatsGlobal?: { acSubmissionNum?: { difficulty: string; count: number }[] };
        };
      };
    };
    const user = json.data?.matchedUser;
    const rows = user?.submitStatsGlobal?.acSubmissionNum;
    if (!rows) return null;
    const by = (d: string) => rows.find((r) => r.difficulty === d)?.count ?? 0;
    return {
      total: by("All"),
      easy: by("Easy"),
      medium: by("Medium"),
      hard: by("Hard"),
      ranking: user?.profile?.ranking ?? null,
    };
  } catch {
    return null;
  }
}
