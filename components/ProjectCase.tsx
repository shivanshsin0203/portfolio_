"use client";

import { useEffect, useRef, useState } from "react";
import type { Project, TerminalLine } from "@/data/projects";
import { useLive } from "./LiveProvider";
import { Reveal, StatusDot, stateLabel } from "./atoms";

/** Autoplays muted when scrolled into view, pauses when scrolled away. */
function CaseVideo({ src, poster, name }: { src: string; poster?: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting;
        if (visible) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      controls={false}
      preload="metadata"
      aria-label={`${name} product demo`}
      className="block w-full"
    />
  );
}

/** The PriceAlert story, told as a replaying terminal session. */
function CaseTerminal({ lines }: { lines: TerminalLine[] }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(lines.length);
      return;
    }
    if (shown >= lines.length) return;
    const id = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 300 : 850);
    return () => clearTimeout(id);
  }, [started, shown, lines.length]);

  return (
    <div ref={ref} className="min-h-[280px] p-5 sm:min-h-[320px] sm:p-6">
      <div className="mono flex flex-col gap-2.5 text-[12.5px] leading-relaxed sm:text-[13.5px]">
        {lines.slice(0, shown).map((l, i) => (
          <p
            key={i}
            className={
              l.tone === "dim"
                ? "text-console-dim"
                : l.tone === "ok"
                  ? "text-phos"
                  : l.tone === "warn"
                    ? "text-amber"
                    : "text-console-text"
            }
          >
            {l.prompt ? <span className="text-phos">❯ </span> : null}
            {l.text}
          </p>
        ))}
        {shown < lines.length && <p className="caret text-console-text" aria-hidden />}
        {shown >= lines.length && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-console-dim">
            demo film in production — the engine above is real
          </p>
        )}
      </div>
    </div>
  );
}

export function ProjectCase({ project, flip }: { project: Project; flip: boolean }) {
  const { snap } = useLive();
  const status = snap?.products.find((p) => p.slug === project.slug);

  return (
    <article id={project.slug} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
      {/* Written case — paper side */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <Reveal>
          <p className="eyebrow mb-3">{project.index}</p>
          <h3 className="display-sub text-[34px] text-ink sm:text-[40px]">{project.name}</h3>
          <p className="mt-2 text-[17px] font-medium text-ink">{project.tagline}</p>
          <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-ink-soft">
            {project.summary}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <ul className="mt-7 flex flex-col gap-4 border-l border-hairline pl-5">
            {project.hardParts.map((h) => (
              <li key={h.title}>
                <p className="text-[14.5px] font-semibold text-ink">{h.title}</p>
                <p className="mt-0.5 text-[13.5px] leading-relaxed text-ink-soft">{h.detail}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <p className="mono mt-7 text-[12px] leading-loose text-ink-faint">
            {project.stack.join(" · ")}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              open {project.domain} ↗
            </a>
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn">
                source ↗
              </a>
            )}
          </div>
        </Reveal>
      </div>

      {/* Evidence — instrument side */}
      <Reveal delay={100} className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
        <div className="panel overflow-hidden">
          <div className="panel-titlebar justify-between">
            <span className="flex items-center gap-2">
              <StatusDot state={status?.state ?? "checking"} />
              {project.domain}
            </span>
            <span className="tabular-nums">
              {status
                ? status.state === "operational" && status.latencyMs !== null
                  ? `${stateLabel(status.state)} · ${status.latencyMs}ms`
                  : stateLabel(status.state)
                : "CHECKING…"}
            </span>
          </div>
          {project.media.kind === "video" ? (
            <CaseVideo
              src={project.media.src}
              poster={project.media.poster}
              name={project.name}
            />
          ) : (
            <CaseTerminal lines={project.media.lines} />
          )}
        </div>
      </Reveal>
    </article>
  );
}
