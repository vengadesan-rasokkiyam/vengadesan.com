"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { profile, whatsappLink } from "@/lib/content";
import { play } from "@/lib/sfx";

type Choice = "edit" | "code" | "both";

/** Open the contact popup. Optional choice can seed the message. */
export const OPEN_HIRE_DRAWER = "ks:open-hire-drawer";

export function openHireDrawer(choice?: Choice) {
  window.dispatchEvent(new CustomEvent(OPEN_HIRE_DRAWER, { detail: choice ?? null }));
}

const SEED: Record<Choice, string> = {
  edit: "I'd like to learn more about working with you.",
  code: "I have a project in mind and would like to discuss scope.",
  both: "I'm looking for end-to-end product design support.",
};

/** Contact popup — site design system (label / display / btn / hairline). */
export default function HireDrawer() {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [sent, setSent] = useState(false);
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<Choice | null>).detail;
      setSeed(detail && detail in SEED ? SEED[detail] : "");
      setSent(false);
      setOpen(true);
      play("select");
    };
    window.addEventListener(OPEN_HIRE_DRAWER, onOpen);
    return () => window.removeEventListener(OPEN_HIRE_DRAWER, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const close = () => {
    play("tick");
    setOpen(false);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("name") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const body = [
      `Name: ${fullName}`,
      `Company: ${company || "—"}`,
      `Phone: ${phone || "—"}`,
      `Email: ${email}`,
      "",
      message,
    ].join("\n");

    const href = `mailto:${profile.email}?subject=${encodeURIComponent(`Hire — ${fullName || "Inquiry"}`)}&body=${encodeURIComponent(body)}`;
    play("select");
    setSent(true);
    window.location.href = href;
  };

  const address = profile.location.replace(/, India$/, "");
  const field =
    "mt-2 w-full rounded-[12px] border-0 bg-ink-3 px-4 py-3 text-[15px] text-paper outline-none ring-1 ring-white/15 placeholder:text-faint transition-[box-shadow] focus:ring-white/25 focus:shadow-[inset_0_0_0_1px_var(--color-code)]";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-[var(--gutter)] py-5 sm:py-8"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close contact form"
        tabIndex={open ? 0 : -1}
        className={`absolute inset-0 bg-ink/95 backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-out-expo)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-grade="code"
        className={`relative grid w-full max-w-[1180px] overflow-hidden rounded-[24px] border border-white/15 bg-ink-2 shadow-[0_24px_80px_rgb(0_0_0_/_0.45)] transition-all duration-500 ease-[var(--ease-out-expo)] max-h-[min(720px,calc(100svh-2.5rem))] sm:rounded-[28px] md:grid-cols-12 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-[0.98] opacity-0"
        }`}
      >
        {/* Left — identity + facts */}
        <div className="flex min-h-0 flex-col justify-between gap-8 border-b border-white/10 bg-ink-3/50 p-6 sm:p-8 md:col-span-5 md:border-b-0 md:border-r md:p-10">
          <div>
            <div className="flex items-start justify-between gap-3">
              <p className="label flex items-center gap-3">
                <span className="rec !h-1.5 !w-1.5" />
                Contact me
              </p>
              <button
                type="button"
                onClick={close}
                className="label shrink-0 rounded-full border border-white/15 bg-ink-2 px-3.5 py-1.5 text-paper transition hover:border-code/40 hover:text-code md:hidden"
              >
                Close <span aria-hidden>×</span>
              </button>
            </div>
            <h2
              id={titleId}
              className="display mt-5 text-[clamp(40px,6vw,64px)] leading-[0.9] text-paper"
              style={{ fontStretch: "46%" }}
            >
              Fill the form
            </h2>
            <p className="mt-4 max-w-[32ch] text-[14px] leading-relaxed text-dim sm:text-[15px]">
              {profile.availability.detail}
            </p>
          </div>

          <dl className="space-y-0">
            {[
              { k: "Phone", v: profile.phoneDisplay, href: `tel:+${profile.whatsapp}` },
              { k: "Email", v: profile.email, href: `mailto:${profile.email}` },
              { k: "Based", v: address, href: undefined as string | undefined },
            ].map((row, i) => (
              <div
                key={row.k}
                className={`flex items-baseline justify-between gap-4 py-3.5 ${i ? "border-t border-white/10" : ""}`}
              >
                <dt className="label shrink-0 text-faint">{row.k}</dt>
                <dd className="min-w-0 text-right text-[14px] text-paper sm:text-[15px]">
                  {row.href ? (
                    <a href={row.href} className="break-all underline decoration-white/25 underline-offset-4 transition hover:decoration-code">
                      {row.v}
                    </a>
                  ) : (
                    row.v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {profile.availability.open ? (
            <p className="flex items-center gap-2.5 text-[14px] text-paper/90">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-code opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-code" />
              </span>
              <span className="label text-faint">Status</span>
              <span>{profile.availability.label}</span>
            </p>
          ) : null}
        </div>

        {/* Right — form */}
        <form
          className="relative flex min-h-0 flex-col gap-4 bg-ink-2 p-6 sm:gap-5 sm:p-8 md:col-span-7 md:p-10"
          onSubmit={onSubmit}
        >
          <button
            type="button"
            onClick={close}
            className="label absolute right-5 top-5 hidden rounded-full border border-white/15 bg-ink-3 px-3.5 py-1.5 text-paper transition hover:border-code/40 hover:text-code md:inline-flex"
          >
            Close <span aria-hidden>×</span>
          </button>

          <label className="block min-w-0 md:mt-8">
            <span className="label">Full name</span>
            <input
              ref={nameRef}
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className={field}
            />
          </label>

          <label className="block min-w-0">
            <span className="label">Company name</span>
            <input name="company" autoComplete="organization" placeholder="Your company" className={field} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="block min-w-0">
              <span className="label">Phone</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="Your phone" className={field} />
            </label>
            <label className="block min-w-0">
              <span className="label">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email"
                className={field}
              />
            </label>
          </div>

          <label className="block min-w-0">
            <span className="label">Message</span>
            <textarea
              name="message"
              key={seed || "empty"}
              defaultValue={seed}
              placeholder="What should we talk about?"
              required
              className={`${field} h-[110px] resize-none sm:h-[128px]`}
            />
          </label>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            <button type="submit" className="btn !h-11 !px-6 !text-[12px]">
              Submit <span className="arr">→</span>
            </button>
            <a
              href={whatsappLink("Hi Vengadesan — I'd like to talk about: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !h-11 !px-5 !text-[12px]"
              onClick={() => play("select")}
            >
              WhatsApp
            </a>
            <p className="label ml-auto text-faint">{sent ? "Opening mail…" : "Email handoff"}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
