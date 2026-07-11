import { getFreshSnapshot } from "@/lib/live-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** JSON fallback for curl-ers, AI agents, and the terminal's `ping` command. */
export async function GET() {
  const snap = await getFreshSnapshot();
  return Response.json(snap, {
    headers: { "cache-control": "no-store" },
  });
}
