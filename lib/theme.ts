"use client";

/**
 * Theme switching with a "sunburst iris" view transition.
 *
 * The incoming theme opens out of the toggle button as a many-rayed aperture
 * that rotates as it expands — a camera iris crossed with a sunrise. Built on
 * the View Transitions API: we animate `clip-path` between star polygons on
 * the ::view-transition-new(root) snapshot, so the page itself never moves.
 * Falls back to an instant swap on unsupported browsers / reduced motion.
 */
export type Theme = "light" | "dark";

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

/** A star polygon around (cx, cy): `rays` soft points, rotated by `rot` radians. */
function sunburst(cx: number, cy: number, r: number, rot: number, rays = 14): string {
  const pts: string[] = [];
  const step = Math.PI / rays;
  for (let i = 0; i < rays * 2; i++) {
    const angle = i * step + rot;
    const rad = i % 2 === 0 ? r : r * 0.8;
    pts.push(
      `${(cx + Math.cos(angle) * rad).toFixed(1)}px ${(cy + Math.sin(angle) * rad).toFixed(1)}px`,
    );
  }
  return `polygon(${pts.join(",")})`;
}

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

export function toggleTheme(origin?: { x: number; y: number }): Theme {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  const doc = document as DocWithVT;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced) {
    apply(next);
    return next;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  // reach the farthest viewport corner, with margin so ray valleys clear it too
  const R =
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.28;

  const vt = doc.startViewTransition(() => apply(next));
  vt.ready
    .then(() => {
      // the aperture: five stops, expanding and slowly rotating
      const spin = next === "dark" ? 1 : -1; // night falls clockwise, day rises counter
      const frames = [0.012, 0.18, 0.42, 0.72, 1].map((f, i) => ({
        clipPath: sunburst(x, y, Math.max(R * f, 12), spin * i * 0.11),
        easing: "cubic-bezier(0.3, 0.6, 0.25, 1)",
      }));
      document.documentElement.animate(frames, {
        duration: 850,
        pseudoElement: "::view-transition-new(root)",
      });
      // the outgoing theme holds still underneath, dimming slightly at the end
      document.documentElement.animate(
        [{ filter: "brightness(1)" }, { filter: "brightness(1)", offset: 0.55 }, { filter: "brightness(0.82)" }],
        { duration: 850, pseudoElement: "::view-transition-old(root)" },
      );
    })
    .catch(() => {
      // transition was skipped; theme is applied either way
    });

  return next;
}
