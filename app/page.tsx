import { projects } from "@/data/projects";
import { LiveProvider } from "@/components/LiveProvider";
import { StatusBar } from "@/components/StatusBar";
import { Hero } from "@/components/Hero";
import { ProjectCase } from "@/components/ProjectCase";
import { Telemetry } from "@/components/Telemetry";
import { NowSection } from "@/components/NowSection";
import { Pitch } from "@/components/Pitch";
import { Footer } from "@/components/Footer";
import { Terminal } from "@/components/Terminal";
import { Reveal } from "@/components/atoms";

export default function Home() {
  return (
    <LiveProvider>
      <StatusBar />
      <main className="flex-1">
        <Hero />

        <section id="systems" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
          <Reveal>
            <div className="rule pt-6">
              <p className="eyebrow">01 · Production systems</p>
              <h2 className="display-sub mt-3 text-[30px] text-ink sm:text-[38px]">
                Built solo. Shipped to real domains.
              </h2>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
                Not repos — running products with users, uptime and bills. Each panel below carries
                its own live status, checked while you read this.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col gap-24">
            {projects.map((p, i) => (
              <ProjectCase key={p.slug} project={p} flip={i % 2 === 1} />
            ))}
          </div>
        </section>

        <Telemetry />
        <NowSection />
        <Pitch />
      </main>
      <Footer />
      <Terminal />
    </LiveProvider>
  );
}
