import type { NextRequest } from "next/server";
import { getSnapshot, subscribe } from "@/lib/live-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// On Vercel the function ends at maxDuration; EventSource reconnects transparently.
export const maxDuration = 300;

const encoder = new TextEncoder();

export async function GET(req: NextRequest) {
  let cleanup = () => {};

  const stream = new ReadableStream({
    start(controller) {
      let open = true;

      const write = (chunk: string) => {
        if (!open) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          open = false;
        }
      };

      const send = (event: string, data: unknown) =>
        write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

      // Ask EventSource to wait 3s before reconnecting after a drop.
      write("retry: 3000\n\n");
      send("snapshot", getSnapshot());

      const unsubscribe = subscribe((snap) => send("update", snap));
      const heartbeat = setInterval(() => write(`: hb ${Date.now()}\n\n`), 20_000);

      cleanup = () => {
        open = false;
        unsubscribe();
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      req.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
