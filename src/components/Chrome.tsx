"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { nav, profile } from "@/lib/content";
import { setGrade, useGrade } from "@/lib/grade";
import { trackPageview } from "@/lib/site-analytics";
import { play, setSound, useSound } from "@/lib/sfx";
import { toggleTheme, useTheme } from "@/lib/theme";
import HireDrawer, { openHireDrawer } from "./HireDrawer";
import KeniMark from "./keni/KeniMark";
import { useKeni } from "./keni/KeniProvider";
import Mark from "./Mark";
import ResumePreview from "./ResumePreview";

/** Fixed chrome: top bar, left rail, hire drawer. */
export default function Chrome() {
  return (
    <>
      <NavBar />
      <SideRail />
      <HireDrawer />
    </>
  );
}

const NAV_ICON: Record<string, ReactNode> = {
  "/": (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6.5 9.5V19h11V9.5" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  "/dashboard": (
    <>
      <path d="M4 19V11M10 19V5M16 19v-7M20 19H3" />
    </>
  ),
  "/#both": (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8" />
    </>
  ),
  "/#experience": (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8M4 13h16" />
    </>
  ),
  "/#education": (
    <>
      <path d="m3 10 9-5 9 5-9 5z" />
      <path d="M6.5 12.2V16c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-3.8" />
    </>
  ),
  "/myrole": (
    <>
      <path d="M12 4.5 14.2 9l4.8.7-3.5 3.4.8 4.8L12 15.8 7.7 17.9l.8-4.8L5 9.7 9.8 9z" />
    </>
  ),
  "/#projects": (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  "/#tools": (
    <>
      <path d="M4 15.5 12 20l8-4.5" />
      <path d="M4 12 12 16.5 20 12" />
      <path d="m4 8.5 8-4.5 8 4.5-8 4.5z" />
    </>
  ),
  "/#learning": (
    <>
      <path d="M5 5.5h6.5A3.5 3.5 0 0 1 15 9v10.5H8.5A3.5 3.5 0 0 0 5 16z" />
      <path d="M19 5.5h-6.5A3.5 3.5 0 0 0 9 9v10.5H15.5A3.5 3.5 0 0 1 19 16z" />
    </>
  ),
};

/** Rail kickers — mono slate voice, short enough for the column. */
const RAIL_LABEL: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dash",
  "/#both": "About",
  "/#experience": "Exp",
  "/#education": "Edu",
  "/myrole": "Role",
  "/#projects": "Work",
  "/#tools": "Stack",
  "/#learning": "Learn",
};

/** Home sections that map onto a rail item, in page order. */
const HOME_SPY: { id: string; href: string }[] = [
  { id: "both", href: "/#both" },
  { id: "experience", href: "/#experience" },
  { id: "education", href: "/#education" },
  { id: "projects", href: "/#projects" },
  { id: "services", href: "/myrole" },
  { id: "tools", href: "/#tools" },
  { id: "learning", href: "/#learning" },
];
function resolveNavItem(
  item: (typeof nav)[number],
  pathname: string,
): { href: string; label: string; short: string; iconHref: string; active: boolean } {
  const hashLink = item.href.includes("#");
  const onHome = pathname === "/";

  if (item.href === "/dashboard") {
    if (onHome) {
      return {
        href: "/dashboard",
        label: "Dashboard",
        short: "Dash",
        iconHref: "/dashboard",
        active: false,
      };
    }
    return { href: "/", label: "Home", short: "Home", iconHref: "/", active: false };
  }

  return {
    href: item.href,
    label: item.label,
    short: RAIL_LABEL[item.href] ?? item.label,
    iconHref: item.href,
    active: !hashLink && pathname.startsWith(item.href),
  };
}

function NavIcon({ href, className = "h-5 w-5" }: { href: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} shrink-0 fill-none stroke-current stroke-[1.7]`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {NAV_ICON[href]}
    </svg>
  );
}

function NavBar() {
  const pathname = usePathname();
  const grade = useGrade();
  const keni = useKeni();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    setGrade(pathname.startsWith("/edit") ? "edit" : pathname.startsWith("/code") ? "code" : "neutral");
  }, [pathname]);

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: profile.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid bar after hero — transparent over #select; filled on later sections / other pages
  useEffect(() => {
    if (pathname !== "/") {
      setSolid(true);
      return;
    }
    setSolid(false);
    const hero = document.getElementById("select");
    if (!hero) {
      setSolid(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        // Hero still filling the top → keep chrome clear; once it leaves → full ink
        setSolid(!e.isIntersecting);
      },
      { rootMargin: "-64px 0px 0px 0px", threshold: [0, 0.01, 0.1] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
        solid
          ? "bg-ink"
          : "bg-transparent"
      }`}
      style={{ transform: hidden ? "translateY(-110%)" : "none" }}
      data-nav-solid={solid ? "" : undefined}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          solid ? "opacity-0" : "h-[120%] bg-gradient-to-b from-ink/35 via-ink/10 to-transparent opacity-100"
        }`}
        aria-hidden
      />
      <nav
        aria-label="Primary"
        className="relative mx-auto grid h-[var(--nav-h)] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 pl-[calc(var(--rail-w)+var(--gutter))] pr-[var(--gutter)] md:gap-4"
      >
        <div className="flex min-w-0 items-center gap-2 justify-self-start sm:gap-3">
          {/* Brand — mobile only (desktop brand is in the rail) */}
          <Link
            href="/"
            className="group flex min-w-0 shrink-0 items-center gap-2.5 lg:hidden"
            aria-label="Vengadesan R. — home"
            onClick={() => play("tick")}
          >
            <Mark size={20} className="shrink-0 transition-transform duration-500 group-hover:rotate-[-8deg]" />
            <span className="truncate whitespace-nowrap text-[13px] font-semibold tracking-[-0.01em]" style={{ fontStretch: "88%" }}>
              Vengadesan<span className="max-[440px]:hidden"> R.</span>
            </span>
            <span className="label-sm hidden shrink-0 text-faint sm:inline">V3</span>
          </Link>

          {/* Desktop — Chennai clock top-left (beside rail) */}
          <span className="label hidden tabular lg:inline" suppressHydrationWarning>
            Chennai <span className="text-paper">{time}</span> {profile.tzLabel}
          </span>

          {/* Mobile / tablet — compact icon row (desktop uses left rail) */}
          <ul className="flex min-w-0 items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1 lg:hidden">
          {nav.map((item) => {
              const resolved = resolveNavItem(item, pathname);
              const hashLink = item.href.includes("#");
            return (
                <li key={item.href} className={hashLink ? "hidden md:block" : undefined}>
                <Link
                    href={resolved.href}
                  onClick={() => play("tick")}
                    aria-label={resolved.label}
                    aria-current={resolved.active ? "page" : undefined}
                    className="group flex h-9 w-9 items-center justify-center rounded-full text-dim transition-colors duration-300 hover:bg-[var(--lift)] hover:text-paper focus-visible:bg-[var(--lift)] focus-visible:text-paper"
                    style={{
                      background: resolved.active ? "var(--lift)" : undefined,
                      color: resolved.active ? "var(--color-paper)" : undefined,
                    }}
                  >
                    <NavIcon href={resolved.iconHref} className="h-4 w-4" />
                </Link>
              </li>
            );
          })}
        </ul>
        </div>

        {profile.availability.open ? (
          <p className="inline-flex h-9 max-w-full items-center gap-2 rounded-full bg-ink-3 px-3 text-[11px] font-medium text-paper sm:px-3.5 sm:text-[12px]">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-code opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-code" />
          </span>
            <span className="truncate">Available for work</span>
          </p>
        ) : (
          <span className="justify-self-center" aria-hidden />
        )}

        <div className="flex shrink-0 items-center justify-end gap-1.5 justify-self-end sm:gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => {
              play("tick");
              keni.setOn(!keni.on);
            }}
            aria-pressed={keni.on}
            aria-label={keni.on ? "Turn Leni off" : "Turn Leni on"}
            title={keni.on ? "Leni on" : "Leni off"}
            className={`keni-nav-toggle shrink-0${keni.on ? " is-on" : " is-off"}`}
          >
            <KeniMark mode="idle" className="keni-mark--nav" />
          </button>
          <ResumePreview className="btn btn-ghost shrink-0 !h-9 !gap-1.5 !px-3 !text-[11px] sm:!px-3.5" />
          <button
            type="button"
            onClick={() => openHireDrawer()}
            className="btn shrink-0 !h-9 !gap-1.5 !px-3.5 !text-[11px] sm:!gap-2.5 sm:!px-4"
            style={{ background: grade === "neutral" ? "var(--color-paper)" : "var(--accent)" }}
          >
            <span className="max-[360px]:hidden">Hire me</span>
            <span className="min-[361px]:hidden">Hire</span> <span className="arr">→</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

/** Panel open / close glyphs for the rail toggle. */
function PanelIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[22px] w-[22px] fill-none stroke-current stroke-[1.7]"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M9.5 4v16" />
      {open ? <path d="M14 9.5 11.5 12 14 14.5" /> : <path d="M12.5 9.5 15 12l-2.5 2.5" />}
    </svg>
  );
}

const RAIL_W_COLLAPSED = "76px";
const RAIL_W_EXPANDED = "118px";

/**
 * Left rail — same icon+label column open or closed.
 * Width drives --rail-w so the page pushes with the menu (no overlay).
 */
function SideRail() {
  const pathname = usePathname();
  const sound = useSound();
  const theme = useTheme();
  const light = theme === "light";
  const [expanded, setExpanded] = useState(false);
  const [logoHover, setLogoHover] = useState(false);
  const [spy, setSpy] = useState<string | null>(null);

  const railItem =
    "group relative mx-auto flex w-full flex-col items-center gap-1.5 rounded-[10px] px-0.5 py-2 text-dim transition-colors duration-300 hover:bg-[var(--lift)] hover:text-paper focus-visible:bg-[var(--lift)] focus-visible:text-paper";
  const railLabel = `label-sm max-w-full text-center !text-[8px] !leading-[1.15] !tracking-[0.1em] ${expanded ? "px-0.5" : ""}`;

  useEffect(() => {
    if (pathname !== "/") {
      setSpy(null);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.38;
      let href: string | null = null;
      for (const item of HOME_SPY) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) href = item.href;
      }
      setSpy((prev) => (prev === href ? prev : href));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (!mq.matches) {
        root.style.removeProperty("--rail-w");
        return;
      }
      root.style.setProperty("--rail-w", expanded ? RAIL_W_EXPANDED : RAIL_W_COLLAPSED);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      root.style.removeProperty("--rail-w");
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const toggle = () => {
    play("tick");
    setExpanded((v) => !v);
  };

  return (
    <nav
      aria-label="Primary"
      data-rail={expanded ? "expanded" : "collapsed"}
      className="pointer-events-none fixed inset-y-0 left-0 z-50 hidden w-[var(--rail-w)] flex-col border-r bg-ink backdrop-blur-md lg:flex"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="pointer-events-auto flex h-full flex-col">
        <div
          className="grid h-[var(--nav-h)] shrink-0 place-items-center border-b"
          style={{ borderColor: "var(--hairline)" }}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse side menu" : "Expand side menu"}
            className="group relative grid h-full w-full place-items-center text-paper transition-colors hover:bg-[var(--lift)]"
          >
            <span
              className={`absolute transition-all duration-300 ease-[var(--ease-out-expo)] ${logoHover ? "scale-90 opacity-0" : "scale-100 opacity-100"}`}
            >
              <Mark size={22} />
            </span>
            <span
              className={`absolute text-dim transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:text-paper ${logoHover ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
            >
              <PanelIcon open={expanded} />
            </span>
          </button>
        </div>

        <ul className="flex w-full flex-1 flex-col items-stretch justify-center gap-0.5 px-1 py-3">
          {nav.map((item) => {
            const resolved = resolveNavItem(item, pathname);
            const active =
              pathname === "/"
                ? spy === item.href
                : item.href === "/dashboard"
                  ? pathname.startsWith("/dashboard")
                  : resolved.active;
            const accent = item.grade === "code" ? "var(--color-code)" : "var(--color-edit)";
            return (
              <li key={item.href} className="w-full">
                <Link
                  href={resolved.href}
                  onClick={() => play("tick")}
                  aria-label={resolved.label}
                  aria-current={active ? "true" : undefined}
                  title={resolved.label}
                  className="group relative mx-auto flex w-full flex-col items-center gap-1.5 rounded-[10px] px-0.5 py-2.5 text-dim transition-colors duration-300 hover:bg-[var(--lift)] hover:text-paper focus-visible:bg-[var(--lift)] focus-visible:text-paper"
                  style={{
                    background: active ? "var(--lift)" : undefined,
                    color: active ? "var(--color-paper)" : undefined,
                  }}
                >
                  <NavIcon href={resolved.iconHref} className="h-[18px] w-[18px] shrink-0" />
                  <span
                    className={`label-sm max-w-full text-center !leading-[1.15] !tracking-[0.1em] ${
                      expanded ? "!text-[8px] px-0.5" : "!text-[8px] !leading-none !tracking-[0.12em]"
                    }`}
                  >
                    {expanded ? resolved.label : resolved.short}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-y-2 right-0 w-px origin-center scale-y-0 rounded-full transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
                    style={{
                      background: accent,
                      transform: active ? "scaleY(1)" : undefined,
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex flex-col items-stretch gap-0.5 border-t px-1 py-2" style={{ borderColor: "var(--hairline)" }}>
          <button
            type="button"
            onClick={() => {
              play("tick");
              toggleTheme();
            }}
            aria-pressed={light}
            aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
            title={light ? "Dark" : "Light"}
            className={railItem}
          >
            <span className="relative grid h-[18px] w-[18px] place-items-center">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={`absolute h-[18px] w-[18px] fill-none stroke-current stroke-[1.7] transition-all duration-300 ${light ? "scale-50 opacity-0" : "scale-100 opacity-100"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={`absolute h-[18px] w-[18px] fill-none stroke-current stroke-[1.7] transition-all duration-300 ${light ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.5 13.4A7.8 7.8 0 0 1 10.6 3.5 7.9 7.9 0 1 0 20.5 13.4z" />
              </svg>
            </span>
            <span className={railLabel}>{light ? "Dark" : "Light"}</span>
          </button>

          <button
            type="button"
            onClick={() => setSound(!sound)}
            className={railItem}
            aria-pressed={sound}
            aria-label={sound ? "Turn interface sound off" : "Turn interface sound on"}
          >
            <SoundIcon on={sound} />
            <span className={railLabel}>{expanded ? (sound ? "Sound on" : "Sound off") : sound ? "On" : "Off"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

/** Speaker with waves (on) or muted slash (off). */
function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10v4h3.2L12 18V6L7.2 10H4z" />
      {on ? (
        <>
          <path d="M15.2 9.2a3.2 3.2 0 0 1 0 5.6" />
          <path d="M17.6 6.8a6.4 6.4 0 0 1 0 10.4" />
        </>
      ) : (
        <path d="m16 9 5 6M21 9l-5 6" />
      )}
    </svg>
  );
}

