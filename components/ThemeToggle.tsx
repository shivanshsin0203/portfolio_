"use client";

import { useEffect, useRef, useState } from "react";
import { currentTheme, toggleTheme, type Theme } from "@/lib/theme";

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
