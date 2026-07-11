"use client";

import { profile } from "@/data/profile";
import { relativeTime } from "@/lib/github";
import { useLive } from "./LiveProvider";
import { Reveal, StatusDot } from "./atoms";

function ActivityBars({ days }: { days: number[] }) {
  const max = Math.max(1, ...days);
  return (
    <div className="flex h-14 items-end gap-[3px]" aria-label="GitHub events per day, last 14 days">
      {days.map((n, i) => (
        <div
          key={i}
          className="bar w-full"
          style={{ height: `${Math.max(4, (n / max) * 100)}%`, opacity: n === 0 ? 0.18 : 1 }}
          title={`${n} event${n === 1 ? "" : "s"}`}
        />
      ))}
    </div>
  );
}

export function Telemetry() {
  const { snap } = useLive();
  const presence = snap?.presence ?? null;
  const events = snap?.events ?? [];
  const lc = snap?.leetcode ?? null;
  const gh = snap?.github ?? null;
  const githubOk = snap?.githubOk ?? false;

  return (
    <section id="telemetry" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <p className="eyebrow">02 · Telemetry</p>
          <h2 className="display-sub mt-3 text-[30px] text-ink sm:text-[38px]">
            Watch me work. Literally.
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            This section reads my public GitHub event stream and LeetCode profile while you look at
            it. If the bars are tall, I&apos;m in a shipping week. If the dot is green, I&apos;m
            probably at the keyboard now.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Presence + cadence */}
        <Reveal className="lg:col-span-5">
          <div className="panel flex h-full flex-col">
            <div className="panel-titlebar">
              <StatusDot state={presence?.state ?? "away"} />
              presence · derived from github events
            </div>
            <div className="flex flex-1 flex-col justify-between gap-6 p-5">
              <div>
                <p className="mono text-[20px] text-console-text">
                  {presence ? presence.label : "acquiring signal…"}
                </p>
                {presence?.lastEventLine && presence.lastEventAt && (
                  <p className="mono mt-2 text-[12.5px] leading-relaxed text-console-dim">
                    latest: {presence.lastEventLine} · {relativeTime(presence.lastEventAt)}
                  </p>
                )}
                {!githubOk && (
                  <p className="mono mt-2 text-[12px] text-amber">
                    github uplink throttled — retrying quietly
                  </p>
                )}
              </div>
              <div>
                <p className="eyebrow-console mb-2">event cadence · 14 days</p>
                <ActivityBars days={presence?.days ?? new Array(14).fill(0)} />
              </div>
              <div className="mono flex flex-wrap gap-x-6 gap-y-1 text-[12px] text-console-dim">
                {gh && (
                  <>
                    <span>{gh.repos} public repos</span>
                    <span>{gh.followers} followers</span>
                  </>
                )}
                {lc && (
                  <span title={`E ${lc.easy} · M ${lc.medium} · H ${lc.hard}`}>
                    {lc.total} leetcode solved
                    {lc.ranking ? ` · rank ${lc.ranking.toLocaleString()}` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Activity log */}
        <Reveal delay={80} className="lg:col-span-7">
          <div className="panel h-full">
            <div className="panel-titlebar justify-between">
              <span>
                activity log · @{profile.githubUser}
              </span>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-console-dim underline-offset-2 hover:text-console-text hover:underline"
              >
                open profile ↗
              </a>
            </div>
            <ol className="divide-y divide-console-line">
              {events.slice(0, 8).map((e) => (
                <li key={e.id}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 px-5 py-2.5 transition-colors hover:bg-console-raise"
                  >
                    <span className="mono min-w-0 truncate text-[13px] text-console-text group-hover:text-white">
                      {e.verb}
                    </span>
                    <span className="mono flex-none text-[11.5px] tabular-nums text-console-dim">
                      {relativeTime(e.at)}
                    </span>
                  </a>
                </li>
              ))}
              {events.length === 0 && (
                <li className="px-5 py-8">
                  <p className="mono text-[12.5px] text-console-dim">
                    {githubOk ? "no recent public events" : "tuning into github…"}
                  </p>
                </li>
              )}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
