"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { now } from "@/data/now";
import { projects } from "@/data/projects";
import { useLive } from "./LiveProvider";

type Line = { text: string; tone?: "dim" | "ok" | "warn" | "cmd" };

const BANNER: Line[] = [
  { text: `shivansh@portfolio — guest session`, tone: "dim" },
  { text: `type 'help' for commands`, tone: "dim" },
];

export function Terminal() {
  const { snap } = useLive();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      const out: Line[] = [{ text: `❯ ${raw}`, tone: "cmd" }];

      switch (cmd) {
        case "":
          break;
        case "help":
          out.push(
            { text: "help        this menu" },
            { text: "whoami      the short version" },
            { text: "ls          the production systems" },
            { text: "ping        live status of all three" },
            { text: "now         what I'm on this month" },
            { text: "socials     where to find me" },
            { text: "hire        the important one" },
            { text: "clear       wipe the scrollback" },
            { text: "exit        close (or press esc)" },
          );
          break;
        case "whoami":
          out.push(
            { text: `${profile.name} — ${profile.role.toLowerCase()}` },
            { text: profile.education, tone: "dim" },
            { text: "ships to real domains, argues with LLMs for sport", tone: "dim" },
          );
          break;
        case "ls":
        case "projects":
          for (const p of projects) {
            out.push({ text: `${p.index.toLowerCase()}  ${p.name.padEnd(11)} ${p.url}` });
          }
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
        case "now":
          out.push({ text: `as of ${now.updatedAt}:`, tone: "dim" });
          for (const b of now.building) out.push({ text: `building   ${b}` });
          for (const e of now.exploring) out.push({ text: `exploring  ${e}` });
          break;
        case "socials":
          out.push(
            { text: `x         ${profile.links.x}` },
            { text: `github    ${profile.links.github}` },
            { text: `linkedin  ${profile.links.linkedin}` },
            { text: `leetcode  ${profile.links.leetcode}` },
            { text: `email     ${profile.email}` },
          );
          break;
        case "hire":
        case "hire me":
          out.push(
            { text: "correct instinct.", tone: "ok" },
            { text: `fastest route: ${profile.links.x}`, tone: "dim" },
            { text: `formal route:  ${profile.email}`, tone: "dim" },
          );
          break;
        case "clear":
          setLines(BANNER);
          return;
        case "exit":
        case "q":
          setOpen(false);
          return;
        case "sudo":
        case "sudo hire":
          out.push({ text: "permission granted. we both knew.", tone: "ok" });
          break;
        default:
          out.push({ text: `command not found: ${cmd} — try 'help'`, tone: "warn" });
      }
      setLines((prev) => [...prev, ...out]);
    },
    [snap],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
    >
      <div
        className="panel flex max-h-[70vh] w-full max-w-[640px] flex-col overflow-hidden"
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
            className="mono w-full bg-transparent text-[13px] text-console-text outline-none placeholder:text-console-dim"
            placeholder="help"
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
