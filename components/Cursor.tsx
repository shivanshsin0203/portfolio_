"use client";

import { useEffect, useRef } from "react";

/**
 * Warm glow cursor: a warm-white core with a soft amber halo that trails the
 * pointer, an expanding ripple ring on every click, and a glow that stretches
 * into a comet on fast scroll. Fine pointers only — touch keeps the native
 * cursor, text fields get their native I-beam back, instant + no ripple under
 * reduced motion, and the native cursor only hides once this has mounted.
 */
export function Cursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const core = coreRef.current;
    const glow = glowRef.current;
    if (!core || !glow) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let gx = tx;
    let gy = ty;
    let raf = 0;
    let shown = false;
    let vel = 0; // decaying scroll velocity
    let lastScroll = window.scrollY;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      core.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      if (!shown) {
        shown = true;
        root.classList.add("cursor-on");
      }
    };

    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const hot = !!t?.closest?.("a, button, [role='button'], [data-cursor]");
      const edit = !!t?.closest?.("input, textarea, [contenteditable='true']");
      core.classList.toggle("is-hover", hot);
      glow.classList.toggle("is-hover", hot);
      root.classList.toggle("is-text", edit);
    };

    const onScroll = () => {
      const y = window.scrollY;
      vel = Math.max(-48, Math.min(48, y - lastScroll));
      lastScroll = y;
    };

    const down = (e: PointerEvent) => {
      core.classList.add("is-down");
      window.setTimeout(() => core.classList.remove("is-down"), 170);
      if (reduced) return;
      const r = document.createElement("div");
      r.className = "cursor-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      window.setTimeout(() => r.remove(), 650);
    };

    const leave = () => root.classList.remove("cursor-on");
    const enter = () => {
      if (shown) root.classList.add("cursor-on");
    };

    const lerp = reduced ? 1 : 0.16;
    const loop = () => {
      gx += (tx - gx) * lerp;
      gy += (ty - gy) * lerp;
      vel *= 0.85;
      const stretch = reduced ? 0 : Math.min(Math.abs(vel) / 20, 0.85);
      const sy = (1 + stretch).toFixed(3);
      const sx = (1 - stretch * 0.5).toFixed(3);
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%) scale(${sx}, ${sy})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      root.classList.remove("has-cursor", "cursor-on", "is-text");
    };
  }, []);

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden />
      <div ref={coreRef} className="cursor-core" aria-hidden />
    </>
  );
}
