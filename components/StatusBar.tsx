"use client";

import { profile } from "@/data/profile";
import { useLive } from "./LiveProvider";
import { Clock, StatusDot } from "./atoms";

export function StatusBar() {
  const { snap, connected } = useLive();
  const presence = snap?.presence ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
        <a href="#top" className="mono text-[11px] tracking-[0.14em] uppercase text-ink">
          Singh, Shivansh — System Spec
        </a>
        <div className="flex items-center gap-5 text-[11px] text-ink-soft">
          <span className="hidden sm:inline">
            <Clock />
          </span>
          <span className="flex items-center gap-2" title="Derived from live GitHub activity">
            <StatusDot state={presence?.state ?? "away"} />
            <span className="mono hidden uppercase tracking-[0.12em] md:inline">
              {presence ? presence.label : connected ? "acquiring signal…" : "connecting…"}
            </span>
          </span>
          <span className="mono hidden text-ink-faint lg:inline">{profile.docRev}</span>
        </div>
      </div>
    </header>
  );
}
