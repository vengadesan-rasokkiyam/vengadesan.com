"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import KeniMark from "@/components/keni/KeniMark";
import { useKeni, type KeniMode } from "@/components/keni/KeniProvider";

const STAGES: { mode: KeniMode; title: string; line: string }[] = [
  { mode: "idle", title: "Idle", line: "Floating & subtle glow" },
  { mode: "hover", title: "Hover", line: "Grows brighter + shows message" },
  { mode: "active", title: "Click", line: "Opens Leni chat panel" },
  { mode: "success", title: "Guide", line: "Helps you navigate sections" },
  { mode: "curious", title: "Curious", line: "One brow lifts while it listens" },
  { mode: "thinking", title: "Thinking", line: "Three dots while an answer is prepared" },
  { mode: "sleep", title: "Sleep", line: "Quieter after a stretch with no interaction" },
];

const STATES: { mode: KeniMode; title: string; line: string; bubble?: string }[] = [
  { mode: "idle", title: "Idle", line: "Curious and relaxed. Soft glow, no constant bubble." },
  { mode: "hover", title: "Hover", line: "Lifts a little and brightens.", bubble: "Oh, you're here!" },
  { mode: "active", title: "Click", line: "Opens the assistant panel.", bubble: "Want a quick tour?" },
  { mode: "success", title: "Guide", line: "Helps you navigate sections.", bubble: "Nice! You found a case study." },
  { mode: "curious", title: "Curious", line: "One brow lifts while it listens." },
  { mode: "thinking", title: "Thinking", line: "Three dots while an answer is prepared." },
  { mode: "sleep", title: "Sleep / Away", line: "Quieter after a stretch with no interaction.", bubble: "I'll be here when you need me." },
  { mode: "knock", title: "Door Knock", line: "A small hand knocks, with a short lean.", bubble: "Hey! I'm Leni. Need a moment?" },
  { mode: "wave", title: "Wave", line: "A friendly wave from one hand.", bubble: "Hi there! Let's explore together." },
  { mode: "point", title: "Pointing", line: "Points toward a section.", bubble: "Check this out!" },
  { mode: "happy", title: "Happy", line: "A short lift and a warmer glow.", bubble: "Awesome! You're on the right track." },
  { mode: "shy", title: "Shy", line: "A small tilt and a heart.", bubble: "Aww... you're awesome!" },
  { mode: "surprised", title: "Surprised", line: "A quick lift, then it settles.", bubble: "Whoa! That's new and interesting." },
  { mode: "welcome", title: "Door Open", line: "Opens the way into a section.", bubble: "Welcome to this section!" },
  { mode: "celebrate", title: "Celebrate", line: "Both hands up for a finished tour.", bubble: "All done! That's progress." },
  { mode: "listening", title: "Listening", line: "Stays with you while you type." },
  { mode: "processing", title: "Processing", line: "A quiet pulse while an answer is prepared.", bubble: "Give me a moment…" },
  { mode: "helpful", title: "Helpful Guide", line: "A small gesture toward the next place.", bubble: "Let me show you around." },
  { mode: "reminder", title: "Gentle Reminder", line: "A soft hand raise, without a bubble loop.", bubble: "Need a hand finding something?" },
  { mode: "encouraging", title: "Encouraging", line: "A small bounce after a case study.", bubble: "Nice! You found a case study." },
  { mode: "goodbye", title: "Goodbye", line: "A slower wave, then back to idle.", bubble: "Thanks for exploring. See you around!" },
];

const TOUR = [
  { n: "01", title: "About Vengat", line: "Learn who he is and his journey.", href: "/#both" },
  { n: "02", title: "Selected Work", line: "Explore key projects and case studies.", href: "/#projects" },
  { n: "03", title: "Design Process", line: "See how he thinks and works.", href: "/#process" },
  { n: "04", title: "Skills & Tools", line: "Tools, skills and what he's good at.", href: "/#tools" },
  { n: "05", title: "Contact", line: "Let's connect and create together.", href: "/#contact" },
];

export default function KeniSections() {
  const keni = useKeni();
  const router = useRouter();
  const tourRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  const shown: KeniMode = keni.mode === "idle" && !keni.open ? keni.exhibit : keni.mode;
  const on = (mode: KeniMode) => shown === mode;

  const playStage = (mode: KeniMode) => {
    if (mode === "active") {
      if (!keni.open) keni.toggle();
      return;
    }
    if (mode === "success") {
      keni.preview("success");
      tourRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    keni.preview(mode);
  };

  return (
    <div className="relative pt-[var(--nav-h)]">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-4 px-[var(--gutter)] py-3 md:grid-cols-12 md:gap-10 md:py-5">
        <aside className="flex min-h-[calc(100svh-var(--nav-h)-2.5rem)] flex-col items-center md:sticky md:top-[calc(var(--nav-h)+1.25rem)] md:col-span-4 md:self-start">
          <div className="flex w-full flex-1 items-center justify-center">
            <div className="aspect-square w-full">
              <KeniMark mode={shown} live className="keni-mark--stage h-full w-full" />
            </div>
          </div>
          <div className="flex flex-col items-center px-2 pb-8 text-center">
            <p className="label text-paper">Portfolio Guide</p>
            <h1 className="mt-2.5 text-[clamp(40px,4.6vw,56px)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">Leni</h1>
            <p className="mt-2 text-[15px] leading-snug text-dim">Personal AI Guide</p>
          </div>
        </aside>

        <div className="space-y-16 pb-16 md:col-span-8 md:pt-2">
          <section
            aria-labelledby="keni-guide-title"
            onMouseEnter={() => keni.holdExhibit(true)}
            onMouseLeave={() => keni.holdExhibit(false)}
          >
            <p className="label flex items-center gap-3">
              <span className="mono rounded-[4px] bg-edit px-1.5 py-0.5 text-[10px] text-ink">01</span>
              Guide
            </p>
            <h2 id="keni-guide-title" className="mt-3 max-w-[16ch] text-[clamp(32px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">
              Leni AI Assistant
            </h2>
            <p className="mt-3 max-w-[42ch] text-[15px] text-dim">Your portfolio guide, always here.</p>
            <ol className="mt-6 border-t border-white/10">
              {STAGES.map((s, i) => (
                <li key={s.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => playStage(s.mode)}
                    className="group flex w-full items-center gap-4 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edit"
                  >
                    <span className={`mono w-7 shrink-0 text-[12px] ${on(s.mode) ? "text-edit" : "text-dim"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <KeniMark mode={s.mode} className="keni-mark--sm shrink-0" />
                    <span className="min-w-0">
                      <span className={`block text-[15px] font-medium tracking-[-0.02em] ${on(s.mode) ? "text-edit" : "text-paper group-hover:text-edit"}`}>
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-dim">{s.line}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="keni-states-title"
            onMouseEnter={() => keni.holdExhibit(true)}
            onMouseLeave={() => keni.holdExhibit(false)}
          >
            <p className="label flex items-center gap-3">
              <span className="mono rounded-[4px] bg-code px-1.5 py-0.5 text-[10px] text-ink">02</span>
              States
            </p>
            <h2 id="keni-states-title" className="mt-3 max-w-[16ch] text-[clamp(32px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">
              AI guide behaviour & states
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] text-dim">Leni&apos;s expressions and actions across different states.</p>
            <ul className="mt-6 grid border-t border-white/10 sm:grid-cols-2 sm:gap-x-10">
              {STATES.map((s) => (
                <li key={s.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => playStage(s.mode)}
                    className="group flex w-full items-start gap-3 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edit"
                  >
                    <KeniMark mode={s.mode} className="keni-mark--sm mt-0.5 shrink-0" />
                    <span className="min-w-0">
                      <span className={`block text-[15px] font-medium tracking-[-0.02em] ${on(s.mode) ? "text-code" : "text-paper group-hover:text-code"}`}>
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-dim">{s.line}</span>
                      {s.bubble && <span className="mt-1.5 block text-[13px] text-paper/80">{s.bubble}</span>}
                      {(s.mode === "thinking" || s.mode === "processing") && (
                        <span className="keni-dots mt-2" aria-hidden>
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section ref={tourRef} id="keni-tour" aria-labelledby="keni-tour-title">
            <p className="label flex items-center gap-3">
              <span className="mono rounded-[4px] bg-edit px-1.5 py-0.5 text-[10px] text-ink">03</span>
              Tour
            </p>
            <h2 id="keni-tour-title" className="mt-3 max-w-[16ch] text-[clamp(32px,4vw,48px)] font-medium leading-[0.95] tracking-[-0.04em] text-paper">
              5-step guided portfolio tour
            </h2>
            <p className="mt-3 max-w-[42ch] text-[15px] text-dim">A simple path to explore the work and the journey.</p>
            <ol className="mt-6 border-t border-white/10">
              {TOUR.map((t, i) => (
                <li key={t.n} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(i);
                      keni.preview(i === TOUR.length - 1 ? "celebrate" : i === 0 ? "welcome" : "encouraging");
                      router.push(t.href);
                    }}
                    aria-current={step === i ? "step" : undefined}
                    className="group grid w-full grid-cols-[auto_1fr] items-baseline gap-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edit"
                  >
                    <span
                      className={`display text-[28px] leading-none ${step === i ? "text-edit" : "text-dim group-hover:text-paper"}`}
                      style={{ fontStretch: "48%" }}
                    >
                      {t.n}
                    </span>
                    <span>
                      <span className={`block text-[16px] font-medium tracking-[-0.02em] ${step === i ? "text-edit" : "text-paper"}`}>
                        {t.title}
                      </span>
                      <span className="mt-1 block text-[13px] text-dim">{t.line}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <ul className="mt-6 space-y-2 text-[13px] leading-snug text-dim">
              <li>Follows the pointer with a small lift. It does not chase the cursor across the page.</li>
              <li>Hover brightens the glow and shows a short line.</li>
              <li>Click opens the chat. Close and minimize both work.</li>
              <li>Suggested prompts and the tour jump to real sections.</li>
              <li>Reduced motion turns off the float and the answer delay.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
