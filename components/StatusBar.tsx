"use client";

import { useLive } from "./LiveProvider";
import { Clock, StatusDot } from "./atoms";
import { ThemeToggle } from "./ThemeToggle";

export function StatusBar() {
  const { snap, connected } = useLive();
  const presence = snap?.presence ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <a href="#top" className="mono text-[11px] tracking-[0.14em] uppercase text-ink">
          Singh, Shivansh — System Spec
        </a>
        <div className="flex items-center gap-4 text-[11px] text-ink-soft">
          <a
            href="#contact"
            className="mono hidden items-center gap-2 uppercase tracking-[0.12em] text-ink transition-colors hover:text-ultra lg:flex"
          >
            <span className="dot dot-ok" aria-hidden />
            open to work
          </a>
          <span className="hidden sm:inline">
            <Clock />
          </span>
          <span
            className="hidden items-center gap-2 md:flex"
            title="Derived from live GitHub activity"
          >
            <StatusDot state={presence?.state ?? "away"} />
            <span className="mono uppercase tracking-[0.12em]">
              {presence ? presence.label : connected ? "acquiring signal…" : "connecting…"}
            </span>
          </span>
          <button
            className="iconbtn mono text-[11px]"
            onClick={() => window.dispatchEvent(new CustomEvent("portfolio:terminal"))}
            aria-label="Open terminal"
            title="terminal (t)"
          >
            <span aria-hidden>&gt;_</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
