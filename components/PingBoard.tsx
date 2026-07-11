"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveSnapshot, ProductStatus } from "@/lib/types";
import { useLive } from "./LiveProvider";
import { StatusDot } from "./atoms";

type RowPhase = "idle" | "pinging" | "done";

type Row = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  phase: RowPhase;
  shownMs: number | null;
  state: ProductStatus["state"];
};

function statusLine(state: ProductStatus["state"], ms: number | null): string {
  if (state === "operational") return ms !== null ? `up · answered in ${ms} ms` : "up";
  if (state === "slow") return ms !== null ? `up, but slow · ${ms} ms` : "up, but slow";
  if (state === "offline") return "unreachable right now";
  return "checking…";
}

/**
 * The hero's proof panel. Shows live SSE status by default; the button
 * re-runs the checks theatrically — fresh fetch, sequential count-up.
 */
export function PingBoard() {
  const { snap } = useLive();
  const [override, setOverride] = useState<Row[] | null>(null);
  const [running, setRunning] = useState(false);
  const [ranOnce, setRanOnce] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const liveRows: Row[] = (snap?.products ?? []).map((p) => ({
    slug: p.slug,
    name: p.name,
    domain: p.domain,
    url: p.url,
    phase: "done",
    shownMs: p.latencyMs,
    state: p.state,
  }));

  const rows = override ?? liveRows;

  async function runCheck() {
    if (running) return;
    setRunning(true);
    const base = liveRows.length
      ? liveRows
      : rows;
    setOverride(base.map((r) => ({ ...r, phase: "idle", shownMs: null, state: "checking" })));

    let data: LiveSnapshot | null = null;
    try {
      const res = await fetch("/api/snapshot", { cache: "no-store" });
      data = (await res.json()) as LiveSnapshot;
    } catch {
      // keep last SSE data if the fetch itself fails
    }
    const fresh = data?.products ?? snap?.products ?? [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    fresh.forEach((p, i) => {
      const startAt = reduced ? 0 : i * 700;
      timers.current.push(
        setTimeout(() => {
          setOverride((prev) =>
            (prev ?? []).map((r) => (r.slug === p.slug ? { ...r, phase: "pinging" } : r)),
          );
          const target = p.latencyMs ?? 0;
          const steps = reduced ? 1 : 18;
          for (let s = 1; s <= steps; s++) {
            timers.current.push(
              setTimeout(() => {
                const value = Math.round((target * s) / steps);
                const finished = s === steps;
                setOverride((prev) =>
                  (prev ?? []).map((r) =>
                    r.slug === p.slug
                      ? {
                          ...r,
                          shownMs: p.latencyMs === null ? null : value,
                          phase: finished ? "done" : "pinging",
                          state: finished ? p.state : "checking",
                        }
                      : r,
                  ),
                );
              }, (s * 480) / steps),
            );
          }
        }, startAt),
      );
    });

    const total = reduced ? 600 : fresh.length * 700 + 600;
    timers.current.push(
      setTimeout(() => {
        setRunning(false);
        setRanOnce(true);
      }, total),
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="panel-titlebar justify-between">
        <span>live check · this page → my servers</span>
        <span className="hidden sm:inline">nothing here is hardcoded</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-console-line px-5 py-4">
        <p className="text-[14px] leading-snug text-console-text">
          These three products are mine, running in production.
          <br className="hidden sm:block" />
          <span className="text-console-dim"> Don&apos;t take the page&apos;s word for it:</span>
        </p>
        <button onClick={runCheck} disabled={running} className="btn-live" type="button">
          {running ? "checking…" : ranOnce ? "run it again ▸" : "run a live check ▸"}
        </button>
      </div>

      <ul>
        {rows.map((r) => (
          <li
            key={r.slug}
            className="flex items-center justify-between gap-4 border-b border-console-line px-5 py-4 last:border-b-0"
          >
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-w-0 items-center gap-3"
            >
              <StatusDot state={r.phase === "done" ? r.state : "checking"} />
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium text-console-text group-hover:text-white">
                  {r.name}
                  <span className="mono ml-2 text-[12px] font-normal text-console-dim">
                    {r.domain} ↗
                  </span>
                </span>
                <span className="mono block text-[11.5px] text-console-dim">
                  {r.phase === "pinging" ? "pinging…" : statusLine(r.state, r.shownMs)}
                </span>
              </span>
            </a>
            <span className="mono flex-none text-[20px] tabular-nums text-console-text">
              {r.shownMs !== null ? (
                <>
                  {r.shownMs}
                  <span className="text-[12px] text-console-dim"> ms</span>
                </>
              ) : r.phase === "pinging" ? (
                "…"
              ) : (
                "—"
              )}
            </span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="px-5 py-6">
            <span className="mono text-[12px] text-console-dim">establishing uplink…</span>
          </li>
        )}
      </ul>

      <p className="mono border-t border-console-line px-5 py-3 text-[11px] leading-relaxed text-console-dim">
        every check is a real request from this page&apos;s server to the domain — open the network
        tab and watch it happen. auto-refreshes every 30s over SSE.
      </p>
    </div>
  );
}
