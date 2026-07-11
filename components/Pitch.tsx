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
        <h2 className="display mt-6 max-w-[16ch] text-[11vw] text-ink sm:text-[64px] lg:text-[84px]">
          Skip the screening call — you just watched me work.
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink-soft">
          I&apos;m looking for my first full-time role. If you&apos;re a founder or an engineer
          shipping AI products and you want someone who takes things from a planning doc to a
          production domain — my DMs are open, and the receipts are above.
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
