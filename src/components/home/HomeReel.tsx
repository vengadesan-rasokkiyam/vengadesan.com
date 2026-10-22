"use client";

import { useEffect, useRef } from "react";
import { SectionHead } from "@/components/ui";
import { reducedMotion } from "@/lib/motion";

const SRC = "/media/home/xfire.webm";

/**
 * Reel above Go deeper.
 * Starts as a small centered clip and grows to the full viewport
 * as you scroll through the section.
 */
export default function HomeReel() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const reduce = reducedMotion();
    let frame = 0;

    const apply = () => {
      frame = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const travel = Math.max(1, el.offsetHeight - vh);
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / travel));
      const stage = video.parentElement;
      if (!stage) return;
      const sw = stage.clientWidth;
      const sh = stage.clientHeight;
      // 16:9 player, centered, then zoom in from the middle to full screen.
      const startW = Math.min(sw * 0.9, 1120);
      const startH = startW * (9 / 16);
      const w = startW + (sw - startW) * p;
      const h = startH + (sh - startH) * p;
      video.style.left = `${(sw - w) / 2}px`;
      video.style.top = `${(sh - h) / 2}px`;
      video.style.width = `${w}px`;
      video.style.height = `${h}px`;
      video.style.transform = "none";
      video.style.borderRadius = `${Math.round(28 * (1 - p))}px`;

      const onScreen = r.bottom > vh * 0.08 && r.top < vh * 0.92;
      if (onScreen) void video.play().catch(() => undefined);
      else video.pause();
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="reel" aria-label="Play reel" className="bg-ink">
      <div className="mx-auto w-full max-w-[1440px] px-[var(--gutter)] pt-16 md:pt-24">
        <SectionHead
          index="P10"
          kicker="Reel"
          title="Play reel"
          lede="Scroll through — the clip stays small, then opens to full screen."
        />
      </div>
      <div
        ref={ref}
        className="relative mt-6 h-[200svh] motion-reduce:h-[100svh]"
      >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={videoRef}
          className="absolute object-cover will-change-transform"
          src={SRC}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
        />
      </div>
      </div>
    </section>
  );
}
