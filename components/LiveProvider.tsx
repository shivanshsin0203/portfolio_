"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LiveSnapshot } from "@/lib/types";

type LiveContextValue = {
  snap: LiveSnapshot | null;
  connected: boolean;
};

const LiveContext = createContext<LiveContextValue>({ snap: null, connected: false });

export function useLive() {
  return useContext(LiveContext);
}

export function LiveProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<LiveSnapshot | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/live");

    const onData = (e: MessageEvent) => {
      try {
        setSnap(JSON.parse(e.data) as LiveSnapshot);
        setConnected(true);
      } catch {
        // malformed frame — skip
      }
    };

    es.addEventListener("snapshot", onData);
    es.addEventListener("update", onData);
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false); // EventSource retries on its own

    return () => es.close();
  }, []);

  const value = useMemo(() => ({ snap, connected }), [snap, connected]);

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}
