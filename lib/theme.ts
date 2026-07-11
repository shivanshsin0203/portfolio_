"use client";

/**
 * Theme switching with the View Transitions circle reveal.
 * The new theme sweeps out of the toggle button as an expanding circle;
 * falls back to an instant swap on unsupported browsers / reduced motion.
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
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const vt = doc.startViewTransition(() => apply(next));
  vt.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.25, 0.9, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // transition was skipped; theme is applied either way
    });

  return next;
}
