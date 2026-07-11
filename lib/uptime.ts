import { monitoredProducts } from "@/data/projects";
import type { ProductStatus } from "./types";

const TIMEOUT_MS = 6500;
const SLOW_MS = 1800;

async function pingOne(p: (typeof monitoredProducts)[number]): Promise<ProductStatus> {
  const started = Date.now();
  try {
    const res = await fetch(p.url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "shivansh-portfolio-monitor/1.0 (+portfolio uptime check)" },
    });
    const latencyMs = Date.now() - started;
    // 2xx-4xx means the box is up and answering; only 5xx/network is down.
    const up = res.status < 500;
    return {
      slug: p.slug,
      name: p.name,
      domain: p.domain,
      url: p.url,
      state: up ? (latencyMs > SLOW_MS ? "slow" : "operational") : "offline",
      latencyMs,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      slug: p.slug,
      name: p.name,
      domain: p.domain,
      url: p.url,
      state: "offline",
      latencyMs: null,
      checkedAt: new Date().toISOString(),
    };
  }
}

export async function pingAll(): Promise<ProductStatus[]> {
  return Promise.all(monitoredProducts.map(pingOne));
}

export function initialProducts(): ProductStatus[] {
  return monitoredProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    domain: p.domain,
    url: p.url,
    state: "checking",
    latencyMs: null,
    checkedAt: new Date().toISOString(),
  }));
}
