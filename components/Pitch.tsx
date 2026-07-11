import { profile } from "@/data/profile";
import { Reveal } from "./atoms";

export function Pitch() {
  return (
    <section id="contact" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <p className="eyebrow">04 · The ask</p>
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="display mt-6 max-w-[14ch] text-[11vw] text-ink sm:text-[64px] lg:text-[84px]">
          Looking for my first <span className="text-ultra">startup role.</span>
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink-soft">
          I want a small team, real users, and problems I can own end to end. The three products
          above are my resume; the live dots are my references. If your startup needs a full-stack
          or AI-product engineer who can start now, reach me on X — I reply fast.
        </p>
      </Reveal>
      <Reveal delay={180}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={profile.links.x}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            DM me on X ↗
          </a>
          <a href={`mailto:${profile.email}`} className="btn">
            email
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="btn">
            linkedin ↗
          </a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn">
            github ↗
          </a>
          <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="btn">
            leetcode ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
