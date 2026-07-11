import { profile } from "@/data/profile";
import { Reveal } from "./atoms";

export function Pitch() {
  return (
    <section id="contact" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <p className="eyebrow">04 · Contact</p>
        </div>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="display mt-6 max-w-[14ch] text-[11vw] text-ink sm:text-[64px] lg:text-[84px]">
          Like what you&apos;ve seen? <span className="text-ultra">Let&apos;s talk.</span>
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink-soft">
          I&apos;m open to full-time engineering roles — full-stack, AI products, or anywhere in
          between. The products above are the best introduction I can give; everything else I&apos;m
          happy to answer directly. X is the fastest way to reach me, email works just as well.
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
