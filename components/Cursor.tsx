"use client";

import { useEffect, useRef } from "react";

/**
 * A precision-reticle cursor that fits the instrument theme: a small exact dot
 * plus a spring-lagged crosshair ring that "locks on" (rotates + brightens)
 * over anything clickable. Fine pointers only — touch keeps the native cursor,
 * text fields get their native I-beam back, and it never renders on the server.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let raf = 0;
    let shown = false;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      if (!shown) {
        shown = true;
        root.classList.add("cursor-on");
      }
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const hot = !!t?.closest?.("a, button, [role='button'], [data-cursor]");
      const edit = !!t?.closest?.("input, textarea, [contenteditable='true']");
      ring.classList.toggle("is-hover", hot);
      root.classList.toggle("is-text", edit);
    };

    const down = () => ring.classList.add("is-down");
    const up = () => ring.classList.remove("is-down");
    const leave = () => root.classList.remove("cursor-on");
    const enter = () => {
      if (shown) root.classList.add("cursor-on");
    };

    const lerp = reduced ? 1 : 0.2;
    const loop = () => {
      rx += (tx - rx) * lerp;
      ry += (ty - ry) * lerp;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      root.classList.remove("has-cursor", "cursor-on", "is-text");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden>
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="13.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="20" y1="1.5" x2="20" y2="6.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="20" y1="33.5" x2="20" y2="38.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="1.5" y1="20" x2="6.5" y2="20" stroke="currentColor" strokeWidth="1.2" />
          <line x1="33.5" y1="20" x2="38.5" y2="20" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
