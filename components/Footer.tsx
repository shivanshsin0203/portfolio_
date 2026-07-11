import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-5 py-8 sm:px-8">
        <p className="mono text-[11.5px] leading-relaxed text-ink-faint">
          Colophon — Next.js 16 · App Router · Tailwind 4 · live data over Server-Sent Events ·
          OG image rendered at the edge · deployed from a data file, not a CMS.
        </p>
        <div className="mono flex flex-wrap items-center gap-x-5 gap-y-1 text-[11.5px] text-ink-faint">
          <span>© 2026 {profile.name}</span>
          <span aria-hidden>·</span>
          <a href="/llms.txt" className="link-ink">
            /llms.txt for the robots
          </a>
          <span aria-hidden>·</span>
          <a href="/api/snapshot" className="link-ink">
            /api/snapshot for the curious
          </a>
          <span aria-hidden>·</span>
          <span>
            press <kbd className="rounded border border-hairline bg-paper-raise px-1.5 py-0.5">t</kbd>{" "}
            for terminal
          </span>
          <span aria-hidden>·</span>
          <span>{profile.docRev}</span>
        </div>
      </div>
    </footer>
  );
}
