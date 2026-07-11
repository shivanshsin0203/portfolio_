/**
 * The production systems. To add a project: append an entry, drop its media in
 * /public/media, and the case study, live monitor, OG data and llms.txt all update.
 */
export type Project = {
  slug: string;
  index: string; // SYS-01 …
  name: string;
  domain: string; // bare domain shown in UI
  url: string;
  repo?: string;
  tagline: string;
  summary: string;
  /** The engineering that would survive a founder's "so what was hard?" */
  hardParts: { title: string; detail: string }[];
  stack: string[];
  media:
    | { kind: "video"; src: string; poster?: string }
    | { kind: "terminal"; lines: TerminalLine[] };
  /** Three punchy numbers rendered under the media panel */
  stats: { value: string; label: string }[];
  /** Included in uptime monitoring */
  monitor: boolean;
};

export type TerminalLine = { prompt?: boolean; text: string; tone?: "dim" | "ok" | "warn" };

export const projects: Project[] = [
  {
    slug: "gitdocs",
    index: "SYS-01",
    name: "GitDocs",
    domain: "gitdocs.online",
    url: "https://gitdocs.online",
    repo: "https://github.com/shivanshsin0203/GitDocs",
    tagline: "Any GitHub repo → a polished, PR-ready README in about a minute.",
    summary:
      "Sign in with GitHub, point it at a repo, and a three-stage LLM pipeline reads the actual source, writes the README, hands you a split-pane editor, and ships the result as a single-commit pull request.",
    hardParts: [
      {
        title: "SSE job stream, not polling",
        detail:
          "Worker stage transitions travel Redis pub/sub → one EventSource per tab → pixels in ~50 ms. Refresh-safe and multi-tab safe.",
      },
      {
        title: "One atomic commit via the Git Data API",
        detail:
          "blob → tree → commit → branch → PR. No \"add file 1/2/3\" commit spam — a clean diff a maintainer would actually merge.",
      },
      {
        title: "Images validated twice, stored nowhere",
        detail:
          "MIME sniff client-side, magic-byte sniff server-side; screenshots travel browser → Node RAM → the repo itself. No S3, no orphans.",
      },
      {
        title: "Three storage layers, deliberately split",
        detail:
          "Redis holds in-flight jobs, Postgres holds terminal state, GitHub holds the artifact. Each layer does the one thing it's best at.",
      },
    ],
    stack: [
      "React 19",
      "TypeScript",
      "Express 5",
      "BullMQ",
      "Upstash Redis",
      "Neon Postgres",
      "Drizzle",
      "DeepSeek",
      "GitHub API",
    ],
    media: { kind: "video", src: "/media/gitdocs-promo.mp4", poster: "/media/gitdocs-hero.png" },
    stats: [
      { value: "~60s", label: "repo → open PR" },
      { value: "~50ms", label: "worker → pixel latency" },
      { value: "1", label: "atomic commit per PR" },
    ],
    monitor: true,
  },
  {
    slug: "squadwars",
    index: "SYS-02",
    name: "SquadWars",
    domain: "squadwars.online",
    url: "https://squadwars.online",
    repo: "https://github.com/shivanshsin0203",
    tagline: "A real-time 1v1 football auction against an AI manager that schemes.",
    summary:
      "Bid live on real footballers in 20-second lots against Micah Richards, Jamie Carragher or Thierry Henry — LLM-driven personas with budgets, lookahead and grudges. Build your XI, and the better squad takes the night.",
    hardParts: [
      {
        title: "One Durable Object per match",
        detail:
          "Every match is its own isolate with a promise-chain mutex — two bids in the same millisecond resolve deterministically, and matches self-delete via storage alarm after 24h.",
      },
      {
        title: "The clock lives in the browser; the server trusts nothing",
        detail:
          "425 Too Early on early lot-closes, anti-snipe extensions, and a reconciliation bid at close — suppressing the AI's network call gains a cheater nothing.",
      },
      {
        title: "The AI's max bid is a server secret",
        detail:
          "Computed and stored inside the DO, never serialized to the client. You can't read the opponent's wallet out of the network tab.",
      },
      {
        title: "LLM with a deterministic floor",
        detail:
          "DeepSeek plans budgets with difficulty-scaled lookahead (~78% warm prompt cache); a heuristic floor sits underneath, so an outage degrades flavour — never a match.",
      },
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Hono",
      "Cloudflare Workers",
      "Durable Objects",
      "Cloudflare KV",
      "DeepSeek",
      "@dnd-kit",
    ],
    media: {
      kind: "video",
      src: "/media/squadwars-promo.mp4",
      poster: "/media/squadwars-landing.png",
    },
    stats: [
      { value: "20s", label: "per auction lot" },
      { value: "1", label: "durable object per match" },
      { value: "3", label: "AI manager personas" },
    ],
    monitor: true,
  },
  {
    slug: "pricealert",
    index: "SYS-03",
    name: "PriceAlert",
    domain: "pricealert.store",
    url: "https://pricealert.store",
    repo: "https://github.com/shivanshsin0203",
    tagline: "Market alerts you write in plain English.",
    summary:
      "\"Ping me if BTC drops 5% in the next hour\" — parsed into a validated condition object, watched every minute, delivered to Telegram and in-app with a grounded AI explanation of why it fired.",
    hardParts: [
      {
        title: "NL → Zod-validated condition objects",
        detail:
          "Relative moves, volatility windows, indicator crosses, compound conditions — things painful in a form, trivial in a sentence. The LLM parses; Zod is the law.",
      },
      {
        title: "Asset-agnostic engine",
        detail:
          "BTC, gold, AAPL, USD/INR are just adapters. The watcher and evaluator never know what they're pricing — adding an asset class is one file.",
      },
      {
        title: "The watcher reads Redis, never Postgres",
        detail:
          "Active alerts live in a Redis hot set; Neon is only written on create and fire, so it sleeps — the whole system runs on one ~$5 VM.",
      },
      {
        title: "Three trust boundaries on a public VM",
        detail:
          "BFF calls carry user JWT + internal secret, Telegram's webhook carries its own secret, and nothing browser-facing touches Express directly.",
      },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Express",
      "BullMQ",
      "Redis",
      "Neon Postgres",
      "Drizzle",
      "Telegram Bot API",
      "DeepSeek",
    ],
    media: {
      kind: "terminal",
      lines: [
        { prompt: true, text: '"alert me if ETH drops 10% from its 24h high"' },
        { text: "parsing natural language → condition object …", tone: "dim" },
        {
          text: '{ asset: "ETH", type: "drop_from_high", pct: 10, window: "24h" }  ✓ zod',
          tone: "ok",
        },
        { text: "watcher armed · checking every 60s via Binance adapter", tone: "dim" },
        { text: "…", tone: "dim" },
        { text: "TRIGGERED 14:32 IST — ETH −10.2% from 24h high of $4,118", tone: "warn" },
        { text: "→ Telegram + in-app: \"ETH slid 10.2% off its 24h high…\"", tone: "ok" },
      ],
    },
    stats: [
      { value: "60s", label: "price check cadence" },
      { value: "6", label: "asset classes" },
      { value: "~$5", label: "monthly infra bill" },
    ],
    monitor: true,
  },
];

export const monitoredProducts = projects
  .filter((p) => p.monitor)
  .map((p) => ({ slug: p.slug, name: p.name, url: p.url, domain: p.domain }));
