"use client";

import { useEffect, useRef, useState } from "react";
import { currentTheme, toggleTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [spin, setSpin] = useState(false);
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
    setSpin((s) => !s);
    toggleTheme(origin);
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`iconbtn ${spin ? "spin" : ""}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "lights on" : "lights off"}
    >
      <span aria-hidden className="text-[13px] leading-none">
        {theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
