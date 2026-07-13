# Build me a portfolio site — from scratch, your design

I'm Shivansh Singh, a '26 batch B.Tech graduate from NIT Hamirpur, a full-stack + AI
engineer. I'm hunting my first full-time role — I want to land at an early-stage startup,
and the people I most want to impress are founders and technical folks who'll find this
from my X profile.

I do **not** want a generic portfolio. Not the 2020/2022 template — no skills bar-charts,
no grid of GitHub repo cards, no "Hi, I'm X, here's my resume." Those are forgettable. I
want something fresh, modern, and genuinely memorable — something that makes a founder stop
scrolling and think "who is this?" **The design, structure, aesthetic, layout, and copy are
entirely yours. Bring a real point of view and take a creative risk. Do not show me a
template.** Plan your own direction before you build.

Build in a fresh empty folder. My three project source folders live on my Desktop
(`gitdocs`, `bestsquad`, `finance`) — you're welcome to read their READMEs for accurate
technical detail, but ignore anything about how they look.

---

## Me
- Shivansh Singh — '26 batch B.Tech, NIT Hamirpur
- Full-stack + AI engineer; I ship products end to end
- Goal: first full-time role, ideally at a startup / founder-led team
- Primary audience: founders and engineers on X (my main channel)
- Links:
  - X (most important): https://x.com/ShivanshSi0203
  - GitHub: https://github.com/shivanshsin0203
  - LinkedIn: https://www.linkedin.com/in/shivansh-singh-736521289/
  - LeetCode: https://leetcode.com/u/singhshivansh12may/  (~335 solved)
  - Email: singhshivansh12may@gmail.com

## What I've actually built (3 products, all live on their own domains)
Not class projects — real products in production, each with genuinely hard engineering.

**1. GitDocs — gitdocs.online**  (folder: Desktop/gitdocs)
Turns any GitHub repo into a polished, PR-ready README in ~60 seconds. Sign in with GitHub,
point at a repo; a three-stage LLM pipeline reads the real source, writes the README, gives
you a split-pane editor, and ships it as a single-commit pull request.
Hard parts worth showing off: a live job stream over SSE (not polling, ~50 ms worker→pixel);
one atomic commit via the Git Data API (no commit spam); screenshots validated twice and
stored nowhere (browser → RAM → repo); three deliberately-separated storage layers (Redis
for in-flight jobs, Postgres for terminal state, GitHub for the artifact).
Stack: React 19, TypeScript, Express 5, BullMQ, Upstash Redis, Neon Postgres, Drizzle,
DeepSeek, GitHub API.

**2. SquadWars — squadwars.online**  (folder: Desktop/bestsquad)
A real-time 1v1 football auction game against an AI manager that actually schemes. Bid on
real footballers in 20-second lots, build a starting XI, better squad wins the night.
Hard parts: one Cloudflare Durable Object per match (isolated, single-threaded, self-cleaning);
the game clock runs in the browser but the server trusts nothing (425 Too Early, anti-snipe,
a reconciliation bid so cheating gains nothing); the AI's max bid is a server-side secret
never sent to the client; the AI uses an LLM with a deterministic fallback, so an outage
degrades flavor, never breaks a match.
Stack: Next.js 16, React 19, Hono, Cloudflare Workers, Durable Objects, KV, DeepSeek, dnd-kit.

**3. PriceAlert — pricealert.store**  (folder: Desktop/finance)
Market alerts you write in plain English ("ping me if BTC drops 5% in the next hour") —
parsed into a validated condition, watched every minute, delivered to Telegram + in-app with
a short AI explanation of why it fired.
Hard parts: natural language → Zod-validated condition objects (relative moves, volatility,
indicator crosses, compound conditions); an asset-agnostic engine where each asset class is
just an adapter; the watcher reads a Redis hot-set, never Postgres, so it runs on one ~$5 VM;
three trust boundaries on a public VM.
Stack: Next.js, Express, BullMQ, Redis, Neon Postgres, Drizzle, Telegram Bot API, DeepSeek.

## Media / assets
I have promo/demo videos for **GitDocs** and **SquadWars**. I don't have one for
**PriceAlert** yet (coming later). For now: **use placeholder / dummy media everywhere**
(a tasteful placeholder block, gradient, or static frame — your call) and structure the code
so dropping in the real video or image later is a one-line change. Don't block on real files.

## Ideas I'm open to — NOT requirements (your judgment)
Things I think could be cool. Use, reshape, or ignore any of them as your design sees fit —
I don't want them forced in if they don't serve your vision:
- Live/dynamic touches: a "what I'm working on right now" I can update; something that hints
  whether I'm actively coding; pulling my live GitHub activity; live status of my products.
- Built in Next.js — use whatever modern capabilities help (SSR, streaming, edge, etc.).
- Good SEO, social/OG preview images, and being friendly to AI crawlers (llms.txt,
  structured data) would be a plus.
- Future-proof: I'll add more projects and update "what I'm working on" over time, so keep
  content easy to edit — ideally a data file, not hardcoded everywhere.

## What I want from you
- Plan your own design direction first — palette, typography, layout, and one signature idea
  that makes this site unmistakably mine. Then build it.
- Write the copy too, in a real human voice — confident but not arrogant. I'm early-career
  and honest about it. No generic AI filler.
- Responsive and polished on both mobile and desktop.
- Next.js moves fast — check the installed version's own docs before assuming any API.
- When done, tell me how to run it, how to update content, and how to swap in real media.

Full creative freedom. Surprise me.
