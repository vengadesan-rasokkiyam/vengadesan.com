"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/lib/content";
import { play } from "@/lib/sfx";
import { GradeZone, Reveal, Rise } from "@/components/ui";
import ProcessStageVisual from "@/components/home/ProcessStageVisual";

/**
 * How I work — heading/body left, stage image + taps right.
 */
export default function HowIWork() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const visible = useRef(false);
  const step = processSteps[i];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    const id = setInterval(() => {
      if (auto && visible.current) setI((n) => (n + 1) % processSteps.length);
    }, 3800);
    return () => {
      io.disconnect();
      clearInterval(id);
    };
  }, [auto]);

  return (
    <GradeZone
      grade="code"
      id="process"
      data-motion="depth"
      data-arrive="right"
      className="relative py-16 md:py-24"
    >
      <div
        ref={root}
        className="mx-auto grid w-full max-w-[1440px] items-start gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:gap-12"
      >
        {/* Left — index badge + title + lede */}
        <div data-motion-body="" className="lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
          <Reveal variant="left">
            <p className="label flex items-center gap-3">
              <span
                className="mono rounded-[4px] px-1.5 py-0.5 text-[10px] text-ink"
                style={{ background: "var(--accent)" }}
              >
                P6
              </span>
              Process
            </p>
          </Reveal>
          <Rise
            as="h2"
            text="HOW I WORK"
            className="display mt-5 max-w-[10ch] text-[clamp(40px,10vw,96px)] leading-[0.92] text-paper"
            style={{ fontStretch: "46%" }}
          />
          <Reveal delay={80} variant="fade">
            <p className="mt-4 max-w-[36ch] text-[14px] leading-relaxed text-dim sm:mt-5 sm:text-[15px] md:text-[16px]">
              A clear path from discovery to handoff — click a stage or let it play.
            </p>
          </Reveal>
        </div>

        {/* Right — image + stage taps */}
        <div data-motion-media="" className="lg:col-span-7">
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-ink-2/40 sm:rounded-[24px]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5">
              <p className="label flex items-center gap-2 text-paper/80">
                <span className="rec !h-1.5 !w-1.5" />
                <span className="max-[380px]:hidden">PRODUCT DESIGN PROCESS</span>
                <span className="min-[381px]:hidden">PROCESS</span>
              </p>
              <span className="label flex items-center gap-2" style={{ color: "var(--accent)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                LIVE
              </span>
            </div>

            <div className="relative aspect-[16/11] overflow-hidden bg-ink-2 sm:aspect-[16/10]">
              {processSteps.map((s, n) => (
                <ProcessStageVisual key={s.n} index={n} active={n === i} />
              ))}
              {/* Same inset as ProcessStageVisual so STEP + title share the panel’s left edge */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <div className="rounded-b-[16px] border border-white/10 bg-ink px-4 py-3 md:px-5 md:py-3.5">
                  <div className="flex flex-col items-start text-left">
                    <p
                      className="font-mono text-[10px] uppercase leading-none tracking-[0.14em] [-webkit-margin-start:-0.07em] [margin-inline-start:-0.07em]"
                      style={{ color: "var(--accent)" }}
                    >
                      STEP {step.n} OF {String(processSteps.length).padStart(2, "0")}
                    </p>
                    <p className="mt-1.5 max-w-[26ch] text-[clamp(15px,2.5vw,20px)] font-medium leading-snug tracking-[-0.02em] text-paper">
                      {step.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ol className="mt-3 grid grid-cols-5 gap-1 sm:gap-1.5" aria-label="Design process stages">
            {processSteps.map((s, n) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    setI(n);
                    setAuto(false);
                    play("tick");
                  }}
                  aria-current={n === i ? "step" : undefined}
                  className="relative w-full overflow-hidden rounded-[10px] border px-1.5 py-2 text-left transition-colors sm:rounded-[12px] sm:px-2.5 sm:py-2.5"
                  style={{
                    borderColor: n === i ? "var(--accent)" : "rgb(255 255 255 / .1)",
                    background: n === i ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                  }}
                >
                  <span className="mono block text-[9px] text-faint sm:text-[10px]">{s.n}</span>
                  <span
                    className="mt-0.5 block truncate text-[10px] sm:text-[12.5px]"
                    style={{ color: n === i ? "var(--color-paper)" : "var(--color-dim)" }}
                  >
                    {s.label}
                  </span>
                  {n === i && auto && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left"
                      style={{ background: "var(--accent)", animation: "howBar 3.8s linear forwards" }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        @keyframes howBar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
      `}</style>
    </GradeZone>
  );
}
