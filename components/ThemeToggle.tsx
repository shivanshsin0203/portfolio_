"use client";

import { useEffect, useRef, useState } from "react";
import { currentTheme, toggleTheme, type Theme } from "@/lib/theme";

/** Eight short rays that burst out of the button on click, then vanish. */
function burst(x: number, y: number, toDark: boolean) {
  const host = document.createElement("div");
  host.className = "ray-burst";
  host.style.left = `${x}px`;
  host.style.top = `${y}px`;
  host.dataset.tone = toDark ? "dark" : "light";
  for (let i = 0; i < 8; i++) {
    const ray = document.createElement("span");
    ray.style.setProperty("--a", `${i * 45}deg`);
    host.appendChild(ray);
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 700);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTheme(currentTheme());
    const onTheme = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener("portfolio:theme", onTheme);
    return () => window.removeEventListener("portfolio:theme", onTheme);
  }, []);

  const onClick = () => {
    const r = ref.current?.getBoundingClientRect();
    const origin = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined;
    const goingDark = theme !== "dark";
    if (origin && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      burst(origin.x, origin.y, goingDark);
    }
    toggleTheme(origin);
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      className="iconbtn"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "switch to light" : "switch to dark"}
    >
      <svg
        viewBox="0 0 24 24"
        width="15"
        height="15"
        className="theme-icon"
        data-mode={theme}
        aria-hidden
      >
        <g className="sun">
          <circle cx="12" cy="12" r="4.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.6" y1="4.6" x2="6.4" y2="6.4" />
            <line x1="17.6" y1="17.6" x2="19.4" y2="19.4" />
            <line x1="4.6" y1="19.4" x2="6.4" y2="17.6" />
            <line x1="17.6" y1="6.4" x2="19.4" y2="4.6" />
          </g>
        </g>
        <path
          className="moon"
          fill="currentColor"
          d="M21 14.5A9 9 0 0 1 9.5 3 9 9 0 1 0 21 14.5Z"
        />
      </svg>
    </button>
  );
}
