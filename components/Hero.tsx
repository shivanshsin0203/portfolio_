"use client";

import { profile } from "@/data/profile";
import { relativeTime } from "@/lib/github";
import { useLive } from "./LiveProvider";
import { Reveal, StatusDot, stateLabel } from "./atoms";

function ProofStrip() {
  const { snap, connected } = useLive();
  const products = snap?.products ?? [];
  const presence = snap?.presence ?? null;
  const allUp = products.length > 0 && products.every((p) => p.state === "operational");

  return (
    <div className="panel overflow-hidden">
      <div className="panel-titlebar justify-between">
        <span className="flex items-center gap-2">
          <StatusDot state={connected ? "operational" : "checking"} />
          live proof · pinged server-side every 30s · streamed over SSE
        </span>
        <span className="hidden sm:inline">
          {allUp ? "all systems operational" : "monitoring"}
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-console-line sm:grid-cols-2 lg:grid-cols-4 sm:divide-y-0 sm:divide-x">
        {products.map((p) => (
          <a
            key={p.slug}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-console-raise"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <StatusDot state={p.state} />
              <span className="mono truncate text-[13px] text-console-text group-hover:text-white">
                {p.domain}
              </span>
            </span>
            <span className="mono flex-none text-[11px] tabular-nums text-console-dim">
              {p.state === "checking"
                ? "…"
                : p.latencyMs !== null
                  ? `${p.latencyMs}ms`
                  : stateLabel(p.state)}
            </span>
          </a>
        ))}

        {products.length === 0 && (
          <div className="col-span-full px-4 py-3.5">
            <span className="mono text-[12px] text-console-dim">establishing uplink…</span>
          </div>
        )}

        {products.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <span className="flex min-w-0 items-center gap-2.5">
              <StatusDot state={presence?.state ?? "away"} />
              <span className="mono truncate text-[13px] text-console-text">
                {presence?.state === "live"
                  ? "shipping right now"
                  : presence?.state === "today"
                    ? "active today"
                    : presence?.lastEventAt
                      ? `last commit ${relativeTime(presence.lastEventAt)}`
                      : "reading github…"}
              </span>
            </span>
            <span className="mono flex-none text-[11px] uppercase text-console-dim">me</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1180px] px-5 pt-16 pb-14 sm:px-8 sm:pt-24">
      <Reveal>
        <p className="eyebrow mb-6">
          00 · Abstract — {profile.role} · {profile.education}
        </p>
      </Reveal>

      <Reveal delay={60}>
        <h1 className="display text-[13.5vw] text-ink sm:text-[88px] lg:text-[112px]">
          {profile.headline[0]}
          <br />
          <span className="text-ultra">{profile.headline[1]}</span>
        </h1>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal delay={120} className="lg:col-span-5">
          <p className="max-w-[52ch] text-[17px] leading-relaxed text-ink-soft">
            {profile.intro}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={profile.links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              DM me on X ↗
            </a>
            <a href={`mailto:${profile.email}`} className="btn">
              {profile.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-7">
          <ProofStrip />
          <p className="mono mt-3 text-[11px] text-ink-faint">
            Every dot above is a real request from this page&apos;s server to a production domain.
            Click one and see for yourself.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
