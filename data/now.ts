/**
 * The "running processes" section. Edit whenever life changes — takes 30 seconds.
 * Keep `updatedAt` honest; it's rendered on the page.
 *
 * state: "running"   = actively building it this month  (green chip)
 *        "exploring" = reading / prototyping            (amber chip)
 *        "open"      = the slot I want YOU to fill      (highlighted row)
 */
export type ProcessState = "running" | "exploring" | "open";

export type NowProcess = {
  name: string;
  detail: string;
  state: ProcessState;
  /** optional link rendered as the row's action */
  href?: string;
  action?: string;
};

export const now = {
  updatedAt: "2026-07-11",
  processes: [
    {
      name: "pricealert",
      detail: "v1 polish + shooting the demo film",
      state: "running",
    },
    {
      name: "portfolio",
      detail: "this page — it monitors my own products",
      state: "running",
    },
    {
      name: "squadwars_multiplayer",
      detail: "1v1 vs a human, same Durable Object room",
      state: "exploring",
    },
    {
      name: "agentic_workflows",
      detail: "multi-step LLM pipelines beyond single prompts",
      state: "exploring",
    },
    {
      name: "next_role",
      detail: "full-stack / AI product engineering · available now",
      state: "open",
      href: "https://x.com/ShivanshSi0203",
      action: "get in touch →",
    },
  ] satisfies NowProcess[],
} as const;
