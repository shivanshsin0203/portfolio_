"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ProductStatus } from "@/lib/types";

export function StatusDot({ state }: { state: ProductStatus["state"] | "live" | "today" | "away" }) {
  const cls =
    state === "operational" || state === "live"
      ? "dot-ok"
      : state === "slow" || state === "today"
        ? "dot-warn"
        : state === "checking"
          ? "dot-idle"
          : state === "away"
            ? "dot-idle"
            : "dot-down";
  return <span className={`dot ${cls}`} aria-hidden />;
}

export function stateLabel(s: ProductStatus["state"]): string {
  switch (s) {
    case "operational":
      return "OPERATIONAL";
    case "slow":
      return "SLOW";
    case "offline":
      return "UNREACHABLE";
    default:
      return "CHECKING…";
  }
}

/** Scroll-reveal wrapper. Falls back to visible when IntersectionObserver is absent. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** IST wall clock, ticking. */
export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="mono tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"} IST
    </span>
  );
}
