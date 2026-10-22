"use client";

import { useId } from "react";
import type { KeniMode } from "@/components/keni/KeniProvider";

function GlyphZ() {
  return (
    <svg className="keni-glyph" viewBox="0 0 24 24" aria-hidden>
      <path d="M5 6.5h14L6 17.5h13" />
    </svg>
  );
}

const HAND =
  "M14 34c-7-1-10-11-5-16 2-7 9-7 11-2 2-6 9-7 12-1 3-5 10-4 11 2 5-2 9 5 6 11 5 10-3 22-16 22-9 0-18-6-19-16z";

/** Round guide mark. Orange and teal move inside the sphere. The eyes stay white stadiums. */
export default function KeniMark({
  mode = "idle",
  variant = 0,
  live = false,
  className = "",
}: {
  mode?: KeniMode;
  variant?: 0 | 1;
  /** When false, the interior gradient holds still. */
  live?: boolean;
  className?: string;
}) {
  const id = `keni-orb-${useId().replace(/:/g, "")}`;

  return (
    <span
      className={`keni-mark ${className}`}
      data-mode={mode}
      data-variant={variant}
      data-live={live ? "on" : "off"}
      aria-hidden
    >
      <span className="keni-aura" />
      <svg className="keni-head" viewBox="0 0 140 140">
        <defs>
          <clipPath id={`${id}-clip`}>
            <circle cx="70" cy="70" r="62" />
          </clipPath>
          <filter id={`${id}-soft`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <radialGradient id={`${id}-shade`} cx="50%" cy="42%" r="68%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.72" stopColor="#06221f" stopOpacity="0.08" />
            <stop offset="1" stopColor="#06221f" stopOpacity="0.38" />
          </radialGradient>
          <radialGradient id={`${id}-gloss`} cx="36%" cy="30%" r="48%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="keni-orb-core" clipPath={`url(#${id}-clip)`}>
          <circle cx="70" cy="70" r="62" fill="#ff6a3d" />
          <g filter={`url(#${id}-soft)`}>
            <ellipse className="keni-orb-drift keni-orb-drift--teal" cx="98" cy="92" rx="54" ry="46" fill="#3fd8c9" />
            <ellipse className="keni-orb-drift keni-orb-drift--hot" cx="38" cy="40" rx="40" ry="34" fill="#ff8a55" />
            <ellipse className="keni-orb-drift keni-orb-drift--deep" cx="112" cy="34" rx="30" ry="26" fill="#0e7d74" />
          </g>
          <circle cx="70" cy="74" r="62" fill={`url(#${id}-shade)`} />
          <ellipse className="keni-orb-gloss" cx="50" cy="40" rx="28" ry="18" fill={`url(#${id}-gloss)`} />
        </g>
        <circle className="keni-orb-body" cx="70" cy="70" r="62" />
        <g className="keni-body">
          <g className="keni-face">
            <g className="keni-eyes">
              <rect className="keni-eye keni-eye--l" x="47" y="56" width="16" height="26" rx="8" />
              <rect className="keni-eye keni-eye--r" x="77" y="56" width="16" height="26" rx="8" />
            </g>
          </g>
          <g className="keni-hands" fill="#fff">
            <g className="keni-hand keni-hand--a">
              <path d={HAND} />
              <g className="keni-impact">
                <path d="M48 18 h10" />
                <path d="M50 26 h8" />
                <path d="M48 34 h10" />
              </g>
            </g>
            <g className="keni-hand keni-hand--b">
              <path d={HAND} />
            </g>
            <g className="keni-door">
              <rect x="4" y="36" width="14" height="58" rx="3" />
              <circle cx="14" cy="66" r="1.6" fill="#f2eee8" />
            </g>
          </g>
        </g>
      </svg>
      <span className="keni-fx keni-fx--heart" aria-hidden>
        ♥
      </span>
      <span className="keni-fx keni-fx--bang" aria-hidden>
        !
      </span>
      <span className="keni-fx keni-fx--ask" aria-hidden>
        <svg viewBox="0 0 32 32">
          <path d="M11.2 12.4a4.8 4.8 0 1 1 6.2 4.6c-1.15.5-1.85 1.3-1.85 2.6" />
          <circle cx="15.55" cy="24.15" r="1.7" />
        </svg>
      </span>
      <span className="keni-sparks" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      {(mode === "thinking" || mode === "processing") && (
        <span className="keni-dots keni-dots--mark">
          <span />
          <span />
          <span />
        </span>
      )}
      {mode === "sleep" && (
        <span className="keni-zzz" aria-hidden>
          <span>
            <GlyphZ />
          </span>
          <span>
            <GlyphZ />
          </span>
          <span>
            <GlyphZ />
          </span>
        </span>
      )}
    </span>
  );
}
