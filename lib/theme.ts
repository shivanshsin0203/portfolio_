"use client";

/**
 * Theme switching: the raven sweep.
 *
 * A raven crosses the viewport and the incoming theme is revealed in its
 * wake — a slanted wipe whose edge is locked to the bird (both animations
 * share one easing curve, so they can't drift). Going dark, a black raven
 * drags the night in from the right; going light, a golden bird pulls the
 * day back in from the left.
 *
 * Built on the View Transitions API. Only transform/opacity/4-point
 * clip-path are animated — no filters, nothing that repaints — so it stays
 * smooth. Falls back to an instant swap without VT support / reduced motion.
 */
export type Theme = "light" | "dark";

const SWEEP_MS = 780;
const SWEEP_EASE = "cubic-bezier(0.52, 0.05, 0.28, 0.99)";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // private mode etc. — theme just won't persist
  }
  window.dispatchEvent(new CustomEvent("portfolio:theme", { detail: theme }));
}

/* Bird-from-above silhouette, head pointing +x. Two wing frames flap via CSS. */
const RAVEN_SVG = `
<svg viewBox="0 0 124 60" width="118" height="57" aria-hidden="true">
  <g class="raven-f raven-f1" fill="currentColor">
    <path d="M60 30 C 42 26 24 12 8 3 C 20 22 38 33 56 35 Z"/>
    <path d="M64 30 C 82 26 100 12 116 3 C 104 22 86 33 68 35 Z"/>
  </g>
  <g class="raven-f raven-f2" fill="currentColor">
    <path d="M60 32 C 42 34 26 45 12 56 C 26 41 40 29 56 28 Z"/>
    <path d="M64 32 C 82 34 98 45 112 56 C 98 41 84 29 68 28 Z"/>
  </g>
  <g fill="currentColor">
    <ellipse cx="62" cy="31" rx="17" ry="6.2"/>
    <circle cx="81" cy="29.4" r="4.6"/>
    <path d="M85 28 L 94 31 L 85 33.5 Z"/>
    <path d="M47 31 L 32 25 L 37 31 L 32 37 Z"/>
  </g>
</svg>`;

function flyRaven(toDark: boolean, fromX: number, toX: number, y: number) {
  const host = document.createElement("div");
  host.className = "raven-host";
  host.dataset.tone = toDark ? "dark" : "light";

  const bob = document.createElement("div");
  bob.className = "raven-bob";
  bob.innerHTML = RAVEN_SVG;
  if (!toDark) bob.style.transform = "scaleX(-1)"; // golden bird flies right
  host.appendChild(bob);
  document.body.appendChild(host);

  // horizontal flight — same curve as the wipe, so the edge rides the bird
  host.animate(
    [
      { transform: `translate(${fromX}px, ${y}px)` },
      { transform: `translate(${toX}px, ${y}px)` },
    ],
    { duration: SWEEP_MS, easing: SWEEP_EASE, fill: "forwards" },
  );
  // a gentle arc, independent of the sweep so sync is untouched
  bob.animate(
    [
      { translate: "0 26px" },
      { translate: "0 -18px", offset: 0.45 },
      { translate: "0 8px" },
    ],
    { duration: SWEEP_MS, easing: "ease-in-out", fill: "forwards", composite: "add" },
  );

  setTimeout(() => host.remove(), SWEEP_MS + 200);
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

let sweeping = false;

export function toggleTheme(origin?: { x: number; y: number }): Theme {
  void origin; // the sweep is viewport-wide; the button burst uses the origin
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  const doc = document as DocWithVT;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced || sweeping) {
    apply(next);
    return next;
  }

  sweeping = true;
  const vt = doc.startViewTransition(() => apply(next));

  vt.ready
    .then(() => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const toDark = next === "dark";
      const slant = Math.min(W * 0.08, 120);
      const lead = 30; // the bird flies just ahead of the edge

      // wipe edge travels with the bird's center
      const birdFrom = toDark ? W + 140 : -260;
      const birdTo = toDark ? -300 : W + 180;
      const edge = (x: number) => x + 59; // bird center offset (svg width/2)

      const clipAt = (x: number) =>
        toDark
          ? // night already owns everything right of the edge
            `polygon(${x - slant}px 0px, ${W + 400}px 0px, ${W + 400}px ${H}px, ${x + slant}px ${H}px)`
          : // day already owns everything left of the edge
            `polygon(-400px 0px, ${x + slant}px 0px, ${x - slant}px ${H}px, -400px ${H}px)`;

      document.documentElement.animate(
        [
          { clipPath: clipAt(edge(birdFrom) + (toDark ? lead : -lead)) },
          { clipPath: clipAt(edge(birdTo) + (toDark ? lead : -lead)) },
        ],
        { duration: SWEEP_MS, easing: SWEEP_EASE, pseudoElement: "::view-transition-new(root)" },
      );

      flyRaven(toDark, birdFrom, birdTo, H * 0.32);
    })
    .catch(() => {
      // transition skipped; theme is applied either way
    });

  vt.finished
    .finally(() => {
      sweeping = false;
    })
    .catch(() => {
      // aborted transitions (hidden tab etc.) still applied the theme
    });

  return next;
}
