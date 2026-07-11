"use client";

import { profile } from "@/data/profile";
import { relativeTime } from "@/lib/github";
import { useLive } from "./LiveProvider";
import { Reveal, StatusDot } from "./atoms";

function ActivityBars({ days }: { days: number[] }) {
  const max = Math.max(1, ...days);
  const total = days.reduce((a, b) => a + b, 0);
  return (
    <div>
      <div
        className="flex h-16 items-end gap-[3px]"
        aria-label="GitHub events per day, last 14 days"
      >
        {days.map((n, i) => (
          <div
            key={i}
            className="bar w-full"
            style={{ height: `${Math.max(5, (n / max) * 100)}%`, opacity: n === 0 ? 0.18 : 1 }}
            title={`${n} event${n === 1 ? "" : "s"}`}
          />
        ))}
      </div>
      <p className="mono mt-2 text-[11px] text-console-dim">
        {total} public GitHub events in 14 days · one bar per day
      </p>
    </div>
  );
}

const LEGEND = [
  { state: "operational" as const, text: "pushed code within the last 45 min" },
  { state: "slow" as const, text: "active in the last 8 hours" },
  { state: "checking" as const, text: "otherwise: shows when I was last seen" },
];

export function Telemetry() {
  const { snap } = useLive();
  const presence = snap?.presence ?? null;
  const lc = snap?.leetcode ?? null;
  const gh = snap?.github ?? null;
  const githubOk = snap?.githubOk ?? false;
  const watching = snap?.watching ?? 0;

  return (
    <section id="telemetry" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">02 · Telemetry</p>
              <h2 className="display-sub mt-3 text-[30px] text-ink sm:text-[38px]">
                Coding heartbeat
              </h2>
            </div>
            {watching > 1 && (
              <p
                className="mono flex items-center gap-2 text-[12px] text-ink-soft"
                title="Open SSE connections to this page"
              >
                <span className="dot dot-ok" aria-hidden />
                you + {watching - 1} other{watching === 2 ? "" : "s"} reading this now
              </p>
            )}
          </div>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            Pulled from my public GitHub and LeetCode while the page is open. No screenshots, no
            self-reported numbers.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="panel mt-8 overflow-hidden">
          <div className="panel-titlebar justify-between">
            <span className="flex items-center gap-2">
              <StatusDot state={presence?.state ?? "away"} />
              @{profile.githubUser}
            </span>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-console-dim underline-offset-2 hover:text-console-text hover:underline"
            >
              verify on github ↗
            </a>
          </div>

          <div className="grid grid-cols-1 divide-y divide-console-line lg:grid-cols-12 lg:divide-x lg:divide-y-0">
            {/* Status + how it's derived */}
            <div className="flex flex-col justify-between gap-6 p-5 lg:col-span-5">
              <div>
                <p className="mono text-[20px] text-console-text">
                  {presence ? presence.label : "syncing with github…"}
                </p>
                {presence?.latestCommit ? (
                  <p className="mono mt-3 text-[12.5px] leading-relaxed text-console-dim">
                    my latest commit · {presence.latestCommit.repo}
                    <br />
                    <span className="text-console-text">
                      &ldquo;{presence.latestCommit.message}&rdquo;
                    </span>
                    {presence.lastEventAt ? ` · ${relativeTime(presence.lastEventAt)}` : ""}
                  </p>
                ) : !githubOk ? (
                  <p className="mono mt-3 text-[12px] leading-relaxed text-amber">
                    github&apos;s free API is throttling this page — it recovers on its own.
                    the profile link above always works.
                  </p>
                ) : null}
              </div>
              <div>
                <p className="eyebrow-console mb-2">how the status dot works</p>
                <ul className="flex flex-col gap-1.5">
                  {LEGEND.map((l) => (
                    <li key={l.text} className="mono flex items-center gap-2.5 text-[11.5px] text-console-dim">
                      <StatusDot state={l.state} />
                      {l.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 14-day cadence */}
            <div className="flex flex-col justify-between gap-6 p-5 lg:col-span-4">
              <p className="eyebrow-console">activity · last 14 days</p>
              <ActivityBars days={presence?.days ?? new Array(14).fill(0)} />
            </div>

            {/* Numbers */}
            <div className="flex flex-col gap-4 p-5 lg:col-span-3">
              <p className="eyebrow-console">the numbers</p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="mono text-[22px] tabular-nums text-console-text">
                    {lc ? lc.total : "—"}
                  </p>
                  <p className="mono text-[11px] text-console-dim">
                    leetcode solved{lc ? ` · ${lc.easy}E / ${lc.medium}M / ${lc.hard}H` : ""}
                  </p>
                </div>
                <div>
                  <p className="mono text-[22px] tabular-nums text-console-text">
                    {gh ? gh.repos : "—"}
                  </p>
                  <p className="mono text-[11px] text-console-dim">public repositories</p>
                </div>
                <div>
                  <p className="mono text-[22px] tabular-nums text-console-text">
                    {watching || "—"}
                  </p>
                  <p className="mono text-[11px] text-console-dim">
                    live readers on this page (SSE connections, including you)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
