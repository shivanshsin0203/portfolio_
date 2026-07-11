import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8">
        <div className="mono flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11.5px] text-ink-faint">
          <span>© 2026 {profile.name}</span>
          <span aria-hidden>·</span>
          <a
            href={profile.links.source}
            target="_blank"
            rel="noopener noreferrer"
            className="link-ink"
          >
            source of this site ↗
          </a>
          <span aria-hidden>·</span>
          <a href="/llms.txt" className="link-ink">
            /llms.txt for the robots
          </a>
          <span aria-hidden>·</span>
          <a href="/api/snapshot" className="link-ink">
            /api/snapshot for the curious
          </a>
          <span aria-hidden>·</span>
          <span>{profile.docRev}</span>
        </div>
      </div>
    </footer>
  );
}
