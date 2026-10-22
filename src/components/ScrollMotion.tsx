"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, loadScrollTrigger } from "@/lib/gsap";
import { reducedMotion, scrollSync } from "@/lib/motion";

type StaggerKind = "up" | "left" | "right" | "scale" | "clip" | "fan";

/**
 * Distinct scroll languages per section via `data-motion` + varied `data-stagger`.
 * Never touches `#select` (home hero owns its intro).
 * No blur / filter — those caused the smoke look and scroll jank.
 */
export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion()) return;

    let killed = false;
    let ctx: gsap.Context | null = null;

    const failSafe = window.setTimeout(() => {
      html.classList.remove("motion-armed");
    }, 2800);

    void loadScrollTrigger().then((ScrollTrigger) => {
      if (killed) return;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const outsideHero = (el: Element) => !el.closest("#select");

          html.classList.add("motion-armed");

          // Strip any leftover blur/filter from prior motion (smoke lag)
          gsap.set(
            "[data-motion-body], [data-motion-head], [data-motion-media], [data-motion-item], [data-reveal], [data-stagger] > *",
            { clearProps: "filter" },
          );

          gsap.utils.toArray<HTMLElement>("[data-motion]").forEach((section) => {
            if (!outsideHero(section) || section.dataset.arrive) return;
            const kind = section.dataset.motion ?? "rise";
            const head = section.querySelector<HTMLElement>("[data-motion-head]");
            const body = section.querySelector<HTMLElement>("[data-motion-body]");
            const media = section.querySelector<HTMLElement>("[data-motion-media]");
            const extras = gsap.utils.toArray<HTMLElement>("[data-motion-item]", section);

            const baseTrigger = {
              trigger: section,
              start: "top 84%",
              once: true,
            } as const;

            switch (kind) {
              case "split": {
                if (media) {
                  gsap.fromTo(
                    media,
                    { clipPath: "inset(0 28% 0 0)", x: -24, autoAlpha: 0 },
                    {
                      clipPath: "inset(0 0% 0 0)",
                      x: 0,
                      autoAlpha: 1,
                      duration: 0.95,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                      onComplete: () => gsap.set(media, { clearProps: "clipPath" }),
                    },
                  );
                }
                if (body) {
                  gsap.fromTo(
                    body,
                    { x: 28 },
                    {
                      x: 0,
                      duration: 0.85,
                      delay: 0.08,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                    },
                  );
                }
                break;
              }
              case "curtain": {
                const target = body ?? section;
                gsap.fromTo(
                  target,
                  { clipPath: "inset(0 0 100% 0)", y: 24 },
                  {
                    clipPath: "inset(0 0 0% 0)",
                    y: 0,
                    duration: 0.95,
                    ease: "power3.out",
                    scrollTrigger: baseTrigger,
                    onComplete: () => gsap.set(target, { clearProps: "clipPath" }),
                  },
                );
                break;
              }
              case "rail": {
                if (head) {
                  gsap.fromTo(
                    head,
                    { x: -36, autoAlpha: 0 },
                    { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", scrollTrigger: baseTrigger },
                  );
                }
                if (body) {
                  gsap.fromTo(
                    body,
                    { x: 36, autoAlpha: 0 },
                    {
                      x: 0,
                      autoAlpha: 1,
                      duration: 0.85,
                      delay: 0.06,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                    },
                  );
                }
                break;
              }
              case "bloom": {
                const target = body ?? section;
                gsap.fromTo(
                  target,
                  { scale: 0.97, autoAlpha: 0, y: 20 },
                  {
                    scale: 1,
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: baseTrigger,
                  },
                );
                break;
              }
              case "mask": {
                if (head) {
                  gsap.fromTo(
                    head,
                    { clipPath: "inset(0 0 0 100%)", x: 16 },
                    {
                      clipPath: "inset(0 0 0 0%)",
                      x: 0,
                      duration: 0.95,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                      onComplete: () => gsap.set(head, { clearProps: "clipPath" }),
                    },
                  );
                }
                if (body) {
                  gsap.fromTo(
                    body,
                    { y: 24, autoAlpha: 0 },
                    {
                      y: 0,
                      autoAlpha: 1,
                      duration: 0.8,
                      delay: 0.1,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                    },
                  );
                }
                break;
              }
              case "orbit": {
                const target = body ?? section;
                gsap.fromTo(
                  target,
                  { y: 28, autoAlpha: 0 },
                  {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.9,
                    ease: "power3.out",
                    scrollTrigger: baseTrigger,
                  },
                );
                break;
              }
              case "swipe": {
                if (extras.length) {
                  extras.forEach((el, i) => {
                    const fromX = i % 2 === 0 ? -36 : 36;
                    gsap.fromTo(
                      el,
                      { x: fromX, autoAlpha: 0 },
                      {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        delay: i * 0.05,
                        ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 90%", once: true },
                      },
                    );
                  });
                } else if (body) {
                  gsap.fromTo(
                    body,
                    { x: -28, autoAlpha: 0 },
                    { x: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", scrollTrigger: baseTrigger },
                  );
                }
                break;
              }
              case "depth": {
                // One-shot enter only — continuous scrub parallax was a scroll cost
                if (media) {
                  gsap.fromTo(
                    media,
                    { y: 28, autoAlpha: 0 },
                    {
                      y: 0,
                      autoAlpha: 1,
                      duration: 0.9,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                    },
                  );
                }
                if (body) {
                  gsap.fromTo(
                    body,
                    { y: 20, autoAlpha: 0 },
                    {
                      y: 0,
                      autoAlpha: 1,
                      duration: 0.85,
                      ease: "power3.out",
                      scrollTrigger: baseTrigger,
                    },
                  );
                }
                break;
              }
              case "fan": {
                if (extras.length) {
                  extras.forEach((el, i) => {
                    gsap.fromTo(
                      el,
                      { y: 28, autoAlpha: 0 },
                      {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        delay: i * 0.06,
                        ease: "power3.out",
                        scrollTrigger: { trigger: section, start: "top 82%", once: true },
                      },
                    );
                  });
                }
                break;
              }
              case "rise":
              default: {
                const target = body ?? head;
                if (target) {
                  gsap.fromTo(
                    target,
                    { y: 28, autoAlpha: 0 },
                    { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", scrollTrigger: baseTrigger },
                  );
                }
                break;
              }
            }
          });

          gsap.utils.toArray<HTMLElement>("[data-arrive='right']").forEach((section) => {
            if (!outsideHero(section)) return;
            const panel = section.firstElementChild as HTMLElement | null;
            if (!panel) return;
            gsap.fromTo(
              panel,
              { x: () => Math.round(window.innerWidth * 0.62) },
              {
                x: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "top 38%",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-ink]").forEach((heading) => {
            if (!outsideHero(heading)) return;
            const words = gsap.utils.toArray<HTMLElement>(".rise > span", heading);
            if (!words.length) return;
            const opaque = (value: string) => {
              const canvas = document.createElement("canvas");
              canvas.width = canvas.height = 1;
              const ctx = canvas.getContext("2d", { willReadFrequently: true });
              if (!ctx) return value;
              ctx.fillStyle = "#000";
              ctx.fillStyle = value;
              ctx.fillRect(0, 0, 1, 1);
              const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
              return `rgb(${r}, ${g}, ${b})`;
            };
            const inkDim = opaque(getComputedStyle(words[0]).color);
            const paper = getComputedStyle(document.documentElement).getPropertyValue("--color-paper").trim();
            const inkPaper = opaque(paper);
            if (inkDim === inkPaper) return;
            gsap.fromTo(
              words,
              { color: inkDim },
              {
                color: inkPaper,
                ease: "none",
                stagger: 0.9,
                scrollTrigger: {
                  trigger: heading,
                  start: "top 80%",
                  end: "bottom 46%",
                  scrub: true,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((root) => {
            if (!outsideHero(root)) return;
            const kind = (root.dataset.stagger || "up") as StaggerKind;
            const items = gsap.utils.toArray<HTMLElement>(
              root.querySelectorAll(":scope > [data-stagger-item], :scope > li, :scope > article, :scope > a, :scope > button"),
            );
            if (!items.length) return;

            const from = staggerFrom(kind);

            ScrollTrigger.batch(items, {
              start: "top 90%",
              once: true,
              onEnter: (batch) => {
                gsap.to(batch, {
                  ...from.to,
                  duration: from.duration,
                  ease: "power3.out",
                  stagger: from.stagger,
                  overwrite: true,
                  onComplete() {
                    gsap.set(batch, { clearProps: "clipPath" });
                  },
                });
              },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            if (!outsideHero(el)) return;
            const raw = el.dataset.count ?? el.textContent ?? "0";
            const match = raw.match(/^([\d.]+)(.*)$/);
            if (!match) return;
            const end = parseFloat(match[1]);
            const suffix = match[2] ?? "";
            const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
            const obj = { n: 0 };
            el.textContent = decimals ? (0).toFixed(decimals) + suffix : `0${suffix}`;

            ScrollTrigger.create({
              trigger: el,
              start: "top 88%",
              once: true,
              onEnter: () => {
                gsap.to(obj, {
                  n: end,
                  duration: 1.2,
                  ease: "power2.out",
                  onUpdate: () => {
                    el.textContent = (decimals ? obj.n.toFixed(decimals) : Math.round(obj.n).toString()) + suffix;
                  },
                });
              },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => {
            if (!outsideHero(line)) return;
            gsap.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.9,
                ease: "power3.out",
                transformOrigin: line.dataset.line === "right" ? "100% 50%" : "0% 50%",
                scrollTrigger: { trigger: line, start: "top 92%", once: true },
              },
            );
          });

          ScrollTrigger.refresh();
          scrollSync.refresh?.();
        });
      });
    });

    return () => {
      killed = true;
      window.clearTimeout(failSafe);
      html.classList.remove("motion-armed");
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}

function staggerFrom(kind: StaggerKind) {
  switch (kind) {
    case "left":
      return {
        to: { autoAlpha: 1, x: 0, y: 0 },
        duration: 0.7,
        stagger: 0.05,
      };
    case "right":
      return {
        to: { autoAlpha: 1, x: 0, y: 0 },
        duration: 0.7,
        stagger: 0.05,
      };
    case "scale":
      return {
        to: { autoAlpha: 1, scale: 1, y: 0 },
        duration: 0.65,
        stagger: 0.04,
      };
    case "clip":
      return {
        to: { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0 },
        duration: 0.8,
        stagger: 0.06,
      };
    case "fan":
      return {
        to: { autoAlpha: 1, y: 0, scale: 1 },
        duration: 0.7,
        stagger: 0.06,
      };
    case "up":
    default:
      return {
        to: { autoAlpha: 1, y: 0 },
        duration: 0.7,
        stagger: 0.05,
      };
  }
}
