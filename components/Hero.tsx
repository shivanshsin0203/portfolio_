"use client";

import { profile } from "@/data/profile";
import { PingBoard } from "./PingBoard";
import { Reveal } from "./atoms";

export function Hero() {
  return (
    <section id="top" className="mx-auto w-full max-w-[1180px] px-5 pt-14 pb-14 sm:px-8 sm:pt-18">
      <Reveal>
        <p className="eyebrow mb-5">
          00 · {profile.name} · {profile.role} · B.Tech ’26
        </p>
      </Reveal>

      <Reveal delay={60}>
        <h1 className="display text-[11.5vw] text-ink sm:text-[76px] lg:text-[95px]">
          {profile.headline[0]}
          <br />
          <span className="text-ultra">{profile.headline[1]}</span>
        </h1>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal delay={120} className="lg:col-span-5">
          <a href="#contact" className="hire-chip mb-5">
            <span className="dot dot-ok" aria-hidden />
            {profile.hireLine}
          </a>
          <p className="max-w-[52ch] text-[17px] leading-relaxed text-ink-soft">
            {profile.intro}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={profile.links.x}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              DM me on X ↗
            </a>
            <a href={`mailto:${profile.email}`} className="btn">
              {profile.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={200} className="lg:col-span-7">
          <PingBoard />
        </Reveal>
      </div>
    </section>
  );
}
