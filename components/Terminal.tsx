"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { toggleTheme } from "@/lib/theme";
import { useLive } from "./LiveProvider";

type Line = { text: string; tone?: "dim" | "ok" | "warn" | "cmd" };

const BANNER: Line[] = [
  { text: "shivansh@portfolio — guest session", tone: "dim" },
  { text: "press t anywhere to open this · esc closes · 'help' lists commands", tone: "dim" },
];

const COMMANDS = [
  ["help", "this menu"],
  ["whoami", "the short version"],
  ["ping", "live status of my three products"],
  ["open <name>", "gitdocs · squadwars · pricealert · x · github"],
  ["hire", "the important one"],
  ["theme", "lights on / lights off"],
  ["clear", "wipe the scrollback"],
] as const;

const OPEN_TARGETS: Record<string, string> = {
  gitdocs: projects.find((p) => p.slug === "gitdocs")?.url ?? "",
  squadwars: projects.find((p) => p.slug === "squadwars")?.url ?? "",
  pricealert: projects.find((p) => p.slug === "pricealert")?.url ?? "",
  x: profile.links.x,
  github: profile.links.github,
  linkedin: profile.links.linkedin,
  leetcode: profile.links.leetcode,
  source: profile.links.source,
};

export function Terminal() {
  const { snap } = useLive();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (!open && !typing && e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
      if (open && e.key === "Escape") setOpen(false);
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("portfolio:terminal", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("portfolio:terminal", onOpenEvent);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (cmd) {
        setHistory((h) => [raw.trim(), ...h.slice(0, 30)]);
        setHistIdx(-1);
      }
      const out: Line[] = [{ text: `❯ ${raw}`, tone: "cmd" }];

      const [word, ...rest] = cmd.split(/\s+/);
      const arg = rest.join(" ");

      switch (word) {
        case "":
          break;
        case "help":
          for (const [name, desc] of COMMANDS) {
            out.push({ text: `${name.padEnd(14)} ${desc}` });
          }
          break;
        case "whoami":
          out.push(
            { text: `${profile.name} — ${profile.role.toLowerCase()}, ${profile.batch}` },
            { text: "ships to real domains, argues with LLMs for sport", tone: "dim" },
            { text: "status: open to new opportunities", tone: "ok" },
          );
          break;
        case "ping": {
          const products = snap?.products ?? [];
          if (products.length === 0) {
            out.push({ text: "no snapshot yet — the SSE stream is still warming up", tone: "warn" });
          }
          for (const p of products) {
            const ok = p.state === "operational";
            out.push({
              text: `${p.domain.padEnd(18)} ${
                p.latencyMs !== null ? `${p.latencyMs}ms` : "—"
              }  ${p.state.toUpperCase()}`,
              tone: ok ? "ok" : "warn",
            });
          }
          break;
        }
        case "open": {
          const url = OPEN_TARGETS[arg];
          if (url) {
            out.push({ text: `opening ${url} …`, tone: "ok" });
            window.open(url, "_blank", "noopener,noreferrer");
          } else {
            out.push({
              text: `open what? try: ${Object.keys(OPEN_TARGETS).join(" · ")}`,
              tone: "warn",
            });
          }
          break;
        }
        case "hire":
          out.push(
            { text: "good call. I'm open to full-time engineering roles.", tone: "ok" },
            { text: `fastest route: ${profile.links.x}`, tone: "dim" },
            { text: `formal route:  ${profile.email}`, tone: "dim" },
          );
          break;
        case "theme":
          toggleTheme();
          out.push({ text: "lights toggled.", tone: "ok" });
          break;
        case "clear":
          setLines(BANNER);
          return;
        case "exit":
        case "q":
          setOpen(false);
          return;
        default:
          out.push({ text: `command not found: ${cmd} — try 'help'`, tone: "warn" });
      }
      setLines((prev) => [...prev, ...out]);
    },
    [snap],
  );

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      if (history[next]) {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(next);
      setInput(next >= 0 ? (history[next] ?? "") : "");
    }
  };

  return (
    <>
      <button
        className="term-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open guest terminal (or press t)"
        title="or press t"
      >
        <span aria-hidden>&gt;_</span>
        <span className="hidden sm:inline">
          terminal <span className="opacity-60">· press t</span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
        >
          <div
            className="panel flex max-h-[72vh] min-h-[320px] w-full max-w-[660px] flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-titlebar justify-between">
              <span>guest terminal</span>
              <button
                onClick={() => setOpen(false)}
                className="text-console-dim hover:text-console-text"
                aria-label="Close terminal"
              >
                esc ✕
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
              <div className="mono flex flex-col gap-1 text-[12.5px] leading-relaxed">
                {lines.map((l, i) => (
                  <p
                    key={i}
                    className={
                      l.tone === "dim"
                        ? "text-console-dim"
                        : l.tone === "ok"
                          ? "text-phos"
                          : l.tone === "warn"
                            ? "text-amber"
                            : l.tone === "cmd"
                              ? "text-white"
                              : "text-console-text"
                    }
                  >
                    {l.text}
                  </p>
                ))}
              </div>
            </div>

            {/* one-tap commands — the terminal works without a keyboard */}
            <div className="flex flex-wrap gap-1.5 border-t border-console-line px-3 py-2">
              {["ping", "whoami", "hire", "theme", "help"].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    run(c);
                    inputRef.current?.focus();
                  }}
                  className="mono rounded border border-console-line px-2 py-1 text-[11px] text-console-dim transition-colors hover:border-console-dim hover:text-console-text"
                >
                  {c}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-2 border-t border-console-line px-4 py-3"
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
                setInput("");
              }}
            >
              <span className="mono text-[13px] text-phos">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                className="mono w-full bg-transparent text-[13px] text-console-text outline-none placeholder:text-console-dim"
                placeholder="try: ping   (↑ for history)"
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal command"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
