import { now } from "@/data/now";
import { Reveal } from "./atoms";

const columns = [
  { label: "Building", items: now.building },
  { label: "Exploring", items: now.exploring },
  { label: "Open to", items: now.openTo },
] as const;

export function NowSection() {
  return (
    <section id="now" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="eyebrow">03 · Currently</p>
              <h2 className="display-sub mt-3 text-[30px] text-ink sm:text-[38px]">
                The moving parts
              </h2>
            </div>
            <p className="mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              updated {now.updatedAt} · lives in data/now.ts
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {columns.map((col, i) => (
          <Reveal key={col.label} delay={i * 70}>
            <h3 className="mono text-[12px] uppercase tracking-[0.14em] text-ink">
              {col.label}
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5 border-t border-hairline pt-4">
              {col.items.map((item) => (
                <li key={item} className="text-[14.5px] leading-relaxed text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
