# shivansh — system specification

A portfolio that doesn't claim, it proves: the page live-monitors my three production products
(gitdocs.online, squadwars.online, pricealert.store), streams my real GitHub presence over SSE,
and reads like an engineering spec sheet — claims on paper, evidence on dark instrument panels.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Update content (the whole point — no code needed)

| What | Where | How often |
|---|---|---|
| "Running processes" (what I'm on now) | [`data/now.ts`](data/now.ts) | Whenever life changes. Rows have a `state`: `running` / `exploring` / `open`. Update `updatedAt` too — it's rendered. |
| Bio, links, headline, hire line | [`data/profile.ts`](data/profile.ts) | Rarely |
| Projects / case studies | [`data/projects.ts`](data/projects.ts) | Per launch |

**Adding a project:** append an entry to `projects` in `data/projects.ts`, drop its demo video or
poster in `public/media/`, done — the case study, live uptime monitor, OG data and llms.txt all
pick it up automatically. `media.kind` can be `"video"` or `"terminal"` (an animated terminal
mock, used by PriceAlert until its demo film exists — swap it to `"video"` when ready).

## Live layer

- `app/api/live` — SSE stream. One server-side poller feeds every visitor: uptime pings every 30s,
  GitHub events every 2 min, LeetCode every 30 min. Timers stop when nobody's watching.
- `app/api/snapshot` — same data as JSON, for curl-ers and AI agents.
- Presence ("shipping right now / active today / last seen") is derived from public GitHub events,
  including the latest commit message straight from the push payload.
- `watching` — the live visitor counter is the number of open SSE connections. Zero extra infra.
- Dark mode is "blueprint mode": the spec sheet reprinted as a cyanotype — Prussian-blue paper,
  chalk ink, cyan accents, drafting grid. Circle-reveal via the View Transitions API
  (`lib/theme.ts`), persisted in localStorage, no first-paint flash (script in `app/layout.tsx`).

## Env vars

| Var | Needed? | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | in prod | Canonical URL for OG images, sitemap, llms.txt |
| `GITHUB_TOKEN` | optional locally, recommended on Vercel | Anonymous GitHub API calls are limited to 60/hr **per IP**, and Vercel's shared egress IPs often have that pool drained by other tenants — a token gives you your own 5000/hr. A classic PAT with **zero scopes** ticked is enough (it can only read public data). |

## Deploy (Vercel)

```bash
vercel --prod
```

Then set `NEXT_PUBLIC_SITE_URL` to the real domain and (optionally) `GITHUB_TOKEN` in the Vercel
dashboard. The SSE function has `maxDuration: 300`; when Vercel ends it, `EventSource` reconnects
by itself — visitors never notice.

## SEO / AI-crawler layer

- `app/opengraph-image.tsx` — OG card rendered at the edge (test with an X card validator)
- `app/llms.txt/route.ts` — token-cheap summary for AI crawlers, linked from robots + footer
- `app/robots.ts`, `app/sitemap.ts`, JSON-LD Person schema in `app/layout.tsx`

## Easter egg

Press `t` anywhere — a guest terminal opens. `help`, `ping`, `whoami`, `hire`, `sudo hire`.
