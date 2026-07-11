import { now, type NowProcess } from "@/data/now";
import { Reveal } from "./atoms";

function StateChip({ state }: { state: NowProcess["state"] }) {
  const cls =
    state === "running" ? "chip-running" : state === "exploring" ? "chip-exploring" : "chip-open";
  const label = state === "open" ? "hiring?" : state;
  return <span className={`chip ${cls}`}>{label}</span>;
}

export function NowSection() {
  return (
    <section id="now" className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8">
      <Reveal>
        <div className="rule pt-6">
          <p className="eyebrow">03 · Currently</p>
          <h2 className="display-sub mt-3 text-[30px] text-ink sm:text-[38px]">
            Running processes
          </h2>
          <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-soft">
            What&apos;s actually open on my machine this month, straight from a data file I keep
            honest.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="panel mt-8 overflow-hidden">
          <div className="panel-titlebar justify-between">
            <span>process monitor</span>
            <span>updated {now.updatedAt} · edits live in data/now.ts</span>
          </div>
          <ol>
            {now.processes.map((p, i) => {
              const open = p.state === "open";
              const row = (
                <div
                  className={`grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[3rem_minmax(0,14rem)_1fr_auto] sm:px-5 ${
                    open ? "bg-console-raise" : ""
                  } ${p.href ? "transition-colors hover:bg-console-raise" : ""}`}
                >
                  <span className="mono text-[11.5px] tabular-nums text-console-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono truncate text-[13.5px] text-console-text">{p.name}</span>
                  <span className="mono col-span-3 col-start-1 text-[12px] leading-relaxed text-console-dim sm:col-span-1 sm:col-start-auto sm:truncate">
                    {p.detail}
                    {open && p.action ? (
                      <span className="ml-2 text-console-text underline underline-offset-2">
                        {p.action}
                      </span>
                    ) : null}
                  </span>
                  <span className="col-start-3 row-start-1 sm:col-start-4">
                    <StateChip state={p.state} />
                  </span>
                </div>
              );
              return (
                <li key={p.name} className="border-t border-console-line first:border-t-0">
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="block">
                      {row}
                    </a>
                  ) : (
                    row
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}
