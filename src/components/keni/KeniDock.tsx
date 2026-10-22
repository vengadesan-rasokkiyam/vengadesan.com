"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import KeniMark from "@/components/keni/KeniMark";
import { useKeni, type KeniMode } from "@/components/keni/KeniProvider";
import { reducedMotion, scrollToTarget } from "@/lib/motion";

const LINES: Partial<Record<KeniMode, string>> = {
  knock: "Hey! I'm Leni. Need a moment?",
  wave: "Hi there! Let's explore together.",
  point: "Check this out! It's something special.",
  thinking: "Hmm... let me find the best information for you.",
  processing: "Give me a moment…",
  listening: "I'm listening.",
  success: "Awesome! You're on the right track.",
  happy: "Awesome! You're on the right track.",
  shy: "Aww... you're awesome!",
  wow: "Whoa! That's new and interesting.",
  surprised: "Whoa! That's new and interesting.",
  welcome: "Welcome to this section!",
  celebrate: "All done! That's progress.",
  curious: "What are you looking for?",
  helpful: "Let me show you around.",
  reminder: "Need a hand finding something?",
  encouraging: "Nice! You found a case study.",
  goodbye: "Thanks for exploring. See you around!",
  sleep: "I'll be here when you need me.",
};

const BURST_AFTER = 20_000;
const RETURN_HOLD = 5_000;
const LOGO_POSES = ["right", "left", "up", "down", "in", "out", "half", "rest"] as const;
const LOGO_POSE_GAP = 10_000;
const RETURN_LINES = [
  "The site is still open.",
  "Look through the work.",
  "See the process.",
  "Reach Vengat when you want.",
];

const NUDGES = [
  "Vengat designs products people can actually use.",
  "Educraft, Kenso, and Fresh Market are on this site.",
  "3.5+ years. 12 SaaS platforms. 6 mobile apps.",
  "He is open for work. I can show you how to reach him.",
  "Ask me about the work, the stack, or the process.",
  "Based in Chennai, designing for teams worldwide.",
];

const PROMPTS = [
  { label: "Selected work", prompt: "Show me his best SaaS project", icon: "work" },
  { label: "Experience", prompt: "How much experience does he have?", icon: "experience" },
  { label: "Skills & tools", prompt: "What tools does he use?", icon: "skills" },
  { label: "Design process", prompt: "Where can I see his design process?", icon: "process" },
  { label: "Contact", prompt: "How can I contact him?", icon: "contact" },
  { label: "Resume", prompt: "Where can I find his resume?", icon: "resume" },
] as const;

function PromptIcon({ icon }: { icon: (typeof PROMPTS)[number]["icon"] }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="keni-chip-icon" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icon === "work" && (
        <>
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </>
      )}
      {icon === "experience" && (
        <>
          <circle cx="12" cy="8" r="3" />
          <path d="M5.5 19.5c1.4-3 3.8-4.5 6.5-4.5s5.1 1.5 6.5 4.5" />
        </>
      )}
      {icon === "skills" && (
        <>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="M12 12 4 7.5" />
          <path d="m12 12 8-4.5" />
          <path d="M12 12v9" />
        </>
      )}
      {icon === "process" && (
        <>
          <circle cx="6" cy="7" r="2" />
          <circle cx="18" cy="12" r="2" />
          <circle cx="8" cy="18" r="2" />
          <path d="M8 8.2 16.2 11" />
          <path d="m16.2 13.2-6.4 3.4" />
        </>
      )}
      {icon === "contact" && (
        <>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="m5 7 7 6 7-6" />
        </>
      )}
      {icon === "resume" && (
        <>
          <path d="M7 3.5h7l4 4V20.5H7Z" />
          <path d="M14 3.5v4h4" />
          <path d="M9.5 12.5h5" />
          <path d="M9.5 16h5" />
        </>
      )}
    </svg>
  );
}

export default function KeniDock() {
  const keni = useKeni();
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [voice, setVoice] = useState(false);
  const spokenId = useRef<string | null>(null);
  const inputId = useId();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [heroSlot, setHeroSlot] = useState(false);
  const [burst, setBurst] = useState(false);
  const [hoverLine, setHoverLine] = useState(false);
  const [nudge, setNudge] = useState<string | null>(null);
  const [ask, setAsk] = useState(false);
  const hoverSpoke = useRef(0);
  const modeNow = useRef(keni.mode);
  modeNow.current = keni.mode;
  const knocked = useRef(false);
  const [large, setLarge] = useState(false);
  const [returnStep, setReturnStep] = useState(0);
  const [logoPose, setLogoPose] = useState<(typeof LOGO_POSES)[number]>("rest");
  const [settled, setSettled] = useState(false);
  const [dimOn, setDimOn] = useState(false);
  const [hot, setHot] = useState(false);
  const poseRef = useRef<"rest" | "grow" | "big" | "shrink" | "to-nav" | "from-nav" | "parked">("rest");
  const restRef = useRef<{ x: number; y: number } | null>(null);
  const restingRef = useRef<(() => { x: number; y: number }) | null>(null);
  const [flight, setFlight] = useState<"to" | "from" | null>(null);
  const allowFlight = useRef(false);
  const wasOnRef = useRef(true);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const MORPH = "transform 0.95s cubic-bezier(0.22, 1, 0.36, 1)";
    let frame = 0;
    let morphEnd: ((event: TransitionEvent) => void) | null = null;

    const visibleCaption = () => {
      const hero = document.getElementById("select");
      if (!hero) return null;
      const h1 = [...hero.querySelectorAll("h1")].find((el) => el.getBoundingClientRect().height > 0);
      if (!h1) return null;
      const line = [...h1.querySelectorAll(".text-paper")].find((el) => el.getBoundingClientRect().height > 0);
      return line ?? h1;
    };

    const withLayoutBox = <T,>(read: (box: DOMRect) => T): T => {
      const prev = slot.style.transform;
      const prevTransition = slot.style.transition;
      slot.style.transition = "none";
      slot.style.transform = "none";
      const box = slot.getBoundingClientRect();
      const value = read(box);
      slot.style.transform = prev;
      slot.style.transition = prevTransition;
      return value;
    };

    const measureRest = () =>
      withLayoutBox((box) => {
        const caption = visibleCaption();
        if (!caption) return null;
        const cap = caption.getBoundingClientRect();
        const scrollY = document.scrollingElement?.scrollTop ?? window.scrollY;
        return {
          x: Math.round(cap.left + cap.width / 2 - (box.left + box.width / 2)),
          y: Math.round(cap.top + scrollY - 8 - box.bottom),
        };
      });

    const resting = () => {
      if (keni.open || !visibleCaption()) return { x: 0, y: 0, parked: false };
      restRef.current ??= measureRest();
      if (!restRef.current) return { x: 0, y: 0, parked: false };
      const scrollY = document.scrollingElement?.scrollTop ?? window.scrollY;
      const travel = Math.max(280, window.innerHeight * 0.42);
      const p = Math.min(1, Math.max(0, scrollY / travel));
      const eased = 1 - (1 - p) ** 3;
      return {
        x: Math.round(restRef.current.x * (1 - eased)),
        y: Math.round(restRef.current.y * (1 - eased)),
        parked: p < 1,
      };
    };

    const bigHeight = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return vw < 1024
        ? Math.min(vh * 0.42, (vw - 32) * 0.72)
        : Math.min(vh * 0.52, (vw - 48) * 0.46);
    };

    const centerShift = () =>
      withLayoutBox((box) => {
        const mark = slot.querySelector(".keni-trigger .keni-mark");
        const markBox = mark?.getBoundingClientRect() ?? box;
        const orb = slot.querySelector(".keni-trigger .keni-head")?.getBoundingClientRect().height || markBox.height * 0.72;
        const scale = bigHeight() / orb;
        return {
          x: Math.round(window.innerWidth / 2 - (box.left + box.width / 2)),
          y: Math.round(window.innerHeight / 2 - (box.top + box.height / 2)),
          scale,
        };
      });

    const dropMorph = () => {
      if (!morphEnd) return;
      slot.removeEventListener("transitionend", morphEnd);
      morphEnd = null;
    };

    const watchMorph = (next: "big" | "rest") => {
      dropMorph();
      morphEnd = (event: TransitionEvent) => {
        if (event.propertyName !== "transform" || event.target !== slot) return;
        dropMorph();
        poseRef.current = next;
        if (next === "big") setSettled(true);
        else {
          setLarge(false);
          setSettled(false);
          apply();
        }
      };
      slot.addEventListener("transitionend", morphEnd);
    };

    const apply = () => {
      frame = 0;
      const pose = poseRef.current;
      if (pose === "grow" || pose === "big" || pose === "shrink" || pose === "to-nav" || pose === "from-nav" || pose === "parked") return;
      const place = resting();
      slot.style.transition = keni.open ? "transform 0.45s var(--ease-out-expo)" : "none";
      slot.style.transform = `translate(${place.x}px, ${place.y}px) scale(1)`;
      setHeroSlot((on) => (on === place.parked ? on : place.parked));
    };

    const grow = () => {
      poseRef.current = "grow";
      setLarge(true);
      setSettled(false);
      const end = centerShift();
      slot.style.setProperty("--keni-scale", String(end.scale));
      void slot.offsetWidth;
      slot.style.transition = MORPH;
      slot.style.transform = `translate(${end.x}px, ${end.y}px) scale(${end.scale})`;
      watchMorph("big");
    };

    const shrink = () => {
      poseRef.current = "shrink";
      setSettled(false);
      const place = resting();
      slot.style.transition = MORPH;
      slot.style.transform = `translate(${place.x}px, ${place.y}px) scale(1)`;
      setHeroSlot((on) => (on === place.parked ? on : place.parked));
      watchMorph("rest");
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      restRef.current = null;
      schedule();
    };

    restingRef.current = () => {
      const place = resting();
      return { x: place.x, y: place.y };
    };

    if (poseRef.current === "to-nav" || poseRef.current === "from-nav" || poseRef.current === "parked") {
      /* the header flight owns the transform */
    } else if (burst) grow();
    else if (poseRef.current === "grow" || poseRef.current === "big" || poseRef.current === "shrink") shrink();
    else {
      restRef.current = measureRest();
      apply();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      dropMorph();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname, keni.open, burst, ask]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      allowFlight.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const was = wasOnRef.current;
    wasOnRef.current = keni.on;
    const head = () => slot.querySelector(".keni-trigger .keni-head") as HTMLElement | null;
    const navTarget = () => {
      const nav = document.querySelector(".keni-nav-toggle");
      if (!nav) return null;
      const prev = slot.style.transform;
      const prevTransition = slot.style.transition;
      slot.style.transition = "none";
      slot.style.transform = "none";
      const box = slot.getBoundingClientRect();
      const mark = slot.querySelector(".keni-trigger .keni-mark");
      const markBox = mark?.getBoundingClientRect() ?? box;
      const orb = head()?.getBoundingClientRect().height || markBox.height * 0.72;
      const navBox = nav.getBoundingClientRect();
      const navHead = nav.querySelector(".keni-head")?.getBoundingClientRect().height || navBox.width;
      const next = {
        x: Math.round(navBox.left + navBox.width / 2 - (box.left + box.width / 2)),
        y: Math.round(navBox.top + navBox.height / 2 - (box.top + box.height / 2)),
        scale: navHead / orb,
      };
      slot.style.transform = prev;
      slot.style.transition = prevTransition;
      return next;
    };
    const park = () => {
      poseRef.current = "parked";
      slot.style.visibility = "hidden";
      slot.style.pointerEvents = "";
      const face = head();
      if (face) {
        face.style.filter = "";
        face.style.transition = "";
      }
      delete document.documentElement.dataset.keniTravel;
      setFlight(null);
    };

    if (was && !keni.on) {
      setBurst(false);
      setLarge(false);
      setHot(false);
      setSettled(false);
      if (!allowFlight.current || reducedMotion()) {
        park();
        return;
      }
      const end = navTarget();
      if (!end) {
        park();
        return;
      }
      poseRef.current = "to-nav";
      setFlight("to");
      document.documentElement.dataset.keniTravel = "to";
      const face = head();
      if (face) {
        face.style.filter = "";
        face.style.transition = "";
      }
      slot.style.visibility = "visible";
      slot.style.pointerEvents = "none";
      void slot.offsetWidth;
      slot.style.transition = "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)";
      slot.style.transform = `translate(${end.x}px, ${end.y}px) scale(${end.scale})`;
      const done = (event: TransitionEvent) => {
        if (event.propertyName !== "transform" || event.target !== slot) return;
        slot.removeEventListener("transitionend", done);
        park();
      };
      slot.addEventListener("transitionend", done);
      return () => slot.removeEventListener("transitionend", done);
    }

    if (!was && keni.on) {
      if (!allowFlight.current || reducedMotion()) {
        slot.style.visibility = "visible";
        slot.style.pointerEvents = "";
        poseRef.current = "rest";
        delete document.documentElement.dataset.keniTravel;
        setFlight(null);
        return;
      }
      const place = restingRef.current?.() ?? { x: 0, y: 0 };
      const face = head();
      if (face) {
        face.style.filter = "";
        face.style.transition = "";
      }
      if (poseRef.current === "parked") {
        const end = navTarget();
        if (end) {
          slot.style.transition = "none";
          slot.style.transform = `translate(${end.x}px, ${end.y}px) scale(${end.scale})`;
        }
        void slot.offsetWidth;
      }
      poseRef.current = "from-nav";
      setFlight("from");
      document.documentElement.dataset.keniTravel = "from";
      slot.style.visibility = "visible";
      slot.style.pointerEvents = "none";
      slot.style.transition = "transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)";
      slot.style.transform = `translate(${place.x}px, ${place.y}px) scale(1)`;
      const done = (event: TransitionEvent) => {
        if (event.propertyName !== "transform" || event.target !== slot) return;
        slot.removeEventListener("transitionend", done);
        if (face) {
          face.style.filter = "";
          face.style.transition = "";
        }
        poseRef.current = "rest";
        delete document.documentElement.dataset.keniTravel;
        setFlight(null);
        slot.style.pointerEvents = "";
        setHeroSlot(place.y !== 0 || place.x !== 0);
      };
      slot.addEventListener("transitionend", done);
      return () => slot.removeEventListener("transitionend", done);
    }
  }, [keni.on]);

  useEffect(() => {
    if (!burst) {
      setDimOn(false);
      return;
    }
    const id = requestAnimationFrame(() => setDimOn(true));
    return () => cancelAnimationFrame(id);
  }, [burst]);

  useEffect(() => {
    if (!large) return;
    setReturnStep(0);
    const id = window.setInterval(() => {
      setReturnStep((step) => (step + 1) % (RETURN_LINES.length + 1));
    }, RETURN_HOLD);
    return () => window.clearInterval(id);
  }, [large]);

  useEffect(() => {
    if (!large || !settled) {
      setLogoPose("rest");
      return;
    }
    let step = 0;
    setLogoPose(LOGO_POSES[0]);
    const id = window.setInterval(() => {
      step = (step + 1) % LOGO_POSES.length;
      setLogoPose(LOGO_POSES[step]);
    }, LOGO_POSE_GAP);
    return () => window.clearInterval(id);
  }, [large, settled]);

  useEffect(() => {
    if (large) document.documentElement.dataset.keniLarge = "1";
    else delete document.documentElement.dataset.keniLarge;
    if (large && keni.mode === "sleep") keni.setMode("idle");
    return () => {
      delete document.documentElement.dataset.keniLarge;
    };
  }, [large, keni.mode, keni.setMode]);

  useEffect(() => {
    if (!keni.on || keni.open || reducedMotion() || pathname === "/leni") {
      setBurst(false);
      return;
    }
    let timer = window.setTimeout(() => setBurst(true), BURST_AFTER);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setBurst(true), BURST_AFTER);
      setBurst((on) => (on ? false : on));
    };
    const interact = () => {
      keni.poke();
      reset();
    };
    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("pointerdown", interact);
    window.addEventListener("keydown", interact);
    window.addEventListener("wheel", interact, opts);
    window.addEventListener("touchstart", interact, opts);
    window.addEventListener("mousemove", reset, opts);
    window.addEventListener("scroll", interact, opts);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", interact);
      window.removeEventListener("keydown", interact);
      window.removeEventListener("wheel", interact);
      window.removeEventListener("touchstart", interact);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("scroll", interact);
    };
  }, [keni.on, keni.open, keni.poke, pathname]);

  useEffect(() => {
    if (!hot || large || keni.open) return;
    if (modeNow.current === "thinking" || modeNow.current === "processing") return;
    keni.setMode("curious");
    const now = Date.now();
    const speak = now - hoverSpoke.current > 12000;
    const greet = window.setTimeout(() => {
      keni.setMode("hover");
      if (!speak) return;
      hoverSpoke.current = Date.now();
      setHoverLine(true);
    }, reducedMotion() ? 0 : 380);
    return () => {
      window.clearTimeout(greet);
      setHoverLine(false);
    };
  }, [hot, large, keni.open, keni.setMode]);

  useEffect(() => {
    if (knocked.current || !keni.on || keni.open || hot || large || reducedMotion()) return;
    const id = window.setTimeout(() => {
      knocked.current = true;
      keni.play("knock", 1500);
    }, 28000);
    return () => window.clearTimeout(id);
  }, [keni.on, keni.open, keni.play, keni.mode, hot, large]);

  useEffect(() => {
    if (keni.open) inputRef.current?.focus();
  }, [keni.open]);

  useEffect(() => {
    if (!keni.on || keni.open || large || reducedMotion()) {
      setNudge(null);
      return;
    }
    let index = 0;
    let hide = 0;
    const show = () => {
      setNudge(NUDGES[index % NUDGES.length]);
      index += 1;
      window.clearTimeout(hide);
      hide = window.setTimeout(() => setNudge(null), 4000);
    };
    const loop = window.setInterval(show, 5000);
    return () => {
      window.clearTimeout(hide);
      window.clearInterval(loop);
    };
  }, [keni.on, keni.open, large]);

  useEffect(() => {
    if (!keni.on || keni.open || large || reducedMotion()) {
      setAsk(false);
      return;
    }
    let wait = 0;
    let hide = 0;
    let stopped = false;
    const cycle = (delay: number) => {
      wait = window.setTimeout(() => {
        if (stopped) return;
        setAsk(true);
        hide = window.setTimeout(() => {
          setAsk(false);
          if (!stopped) cycle(20000);
        }, 5000);
      }, delay);
    };
    cycle(8000);
    return () => {
      stopped = true;
      window.clearTimeout(wait);
      window.clearTimeout(hide);
    };
  }, [keni.on, keni.open, large]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [keni.messages, keni.pending]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!voice || !keni.open) {
      window.speechSynthesis.cancel();
      return;
    }
    const latest = [...keni.messages].reverse().find((m) => m.from === "keni");
    if (!latest || spokenId.current === latest.id) return;
    spokenId.current = latest.id;
    const utter = new SpeechSynthesisUtterance(latest.text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1.05;
    const speak = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", speak);
      const voices = window.speechSynthesis.getVoices();
      const en = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      const pool = en.length ? en : voices;
      const preferred = ["google uk english female", "microsoft aria", "microsoft jenny", "microsoft libby", "microsoft zira", "samantha", "victoria", "karen", "moira", "tessa", "fiona", "serena"];
      const girl =
        preferred.map((name) => pool.find((v) => v.name.toLowerCase().includes(name))).find(Boolean) ||
        pool.find((v) => /female|woman/i.test(v.name));
      if (girl) {
        utter.voice = girl;
        utter.lang = girl.lang;
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    };
    if (window.speechSynthesis.getVoices().length) speak();
    else window.speechSynthesis.addEventListener("voiceschanged", speak);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", speak);
  }, [voice, keni.open, keni.messages]);

  const go = (href?: string) => {
    if (!href) return;
    const hash = href.includes("#") ? href.slice(href.indexOf("#")) : null;
    keni.play("welcome", 1200);
    if (hash && window.location.pathname === "/") {
      scrollToTarget(hash, -10);
      return;
    }
    router.push(href);
  };

  const submit = () => {
    const text = draft;
    setDraft("");
    keni.send(text);
  };

  const face: KeniMode = large && keni.mode === "sleep" ? "idle" : keni.mode;
  const showAsk = ask && !flight && !large && keni.on && !keni.open;
  const speech =
    flight || large || !keni.on || keni.open || showAsk
      ? null
      : hoverLine
        ? "Hey Buddy! Need help exploring?"
        : LINES[keni.mode] ?? keni.bubble ?? nudge;

  return (
    <>
    <div
      className={`keni-dock pointer-events-none fixed right-3 bottom-3 z-[90] flex items-end gap-3 sm:right-5 sm:bottom-5${large ? " keni-dock--large" : ""}`}
      style={large ? { zIndex: 130 } : flight ? { zIndex: 140 } : undefined}
    >
      {keni.open && (
        <section
          className="keni-panel pointer-events-auto flex w-[min(420px,calc(100vw-5.5rem))] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-ink-2"
          aria-label="Leni — Portfolio Guide"
        >
          <header className="keni-panel-head">
            <KeniMark mode={keni.mode} variant={keni.variant} live className="keni-mark--chat" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium leading-tight text-paper">Leni</p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] leading-tight text-dim">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-code" aria-hidden />
                Portfolio guide · on this site
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setVoice((on) => {
                  if (on) spokenId.current = null;
                  return !on;
                });
              }}
              className={`keni-icon-btn${voice ? " is-on" : ""}`}
              aria-pressed={voice}
              aria-label={voice ? "Turn voice off" : "Turn voice on"}
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.7]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5z" />
                {voice ? (
                  <>
                    <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
                    <path d="M18 7a7 7 0 0 1 0 10" />
                  </>
                ) : (
                  <path d="m16 9 5 6M21 9l-5 6" />
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                spokenId.current = null;
                window.speechSynthesis?.cancel();
                keni.clear();
              }}
              className="keni-icon-btn"
              aria-label="Clear chat"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.7]" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12a8 8 0 1 1-2.2-5.5" />
                <path d="M20 4v5h-5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                keni.close();
                triggerRef.current?.focus();
              }}
              className="keni-icon-btn"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div ref={logRef} className="keni-log flex flex-col overflow-y-auto px-4" aria-live="polite">
            <div className="keni-hello">
              <KeniMark mode={keni.pending ? "thinking" : "idle"} live className="keni-mark--hello" />
              <p className="text-[20px] font-medium tracking-[-0.03em] text-paper">Hey Buddy! Need help exploring?</p>
              <p className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-dim">
                I can walk you through the work, experience, skills, and how to get in touch.
              </p>
            </div>

            {keni.messages.map((m) => (
              <div key={m.id} className={m.from === "you" ? "ml-12 self-end" : "mr-8"}>
                <div
                  className={`rounded-[16px] px-3.5 py-2.5 text-[13px] leading-snug ${
                    m.from === "you" ? "bg-paper text-ink" : "border border-white/15 bg-white/[0.04] text-paper"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.href && m.label && (
                    <button type="button" onClick={() => go(m.href)} className="mt-2 text-[12px] font-medium underline underline-offset-2">
                      {m.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {keni.pending && (
              <p className="keni-dots self-start text-dim" aria-label="Leni is answering">
                <span />
                <span />
                <span />
              </p>
            )}

            {keni.messages.length === 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => keni.send(p.prompt)}
                    disabled={keni.pending}
                    className="keni-chip"
                  >
                    <PromptIcon icon={p.icon} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="keni-panel-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flex items-center rounded-full border border-white/15 bg-ink py-1 pr-1 pl-4">
              <label htmlFor={inputId} className="sr-only">
                Ask Leni about Vengat
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => {
                  if (!keni.pending && keni.mode !== "listening" && keni.mode !== "processing") keni.setMode("listening");
                }}
                onBlur={() => {
                  if (keni.mode === "listening") keni.setMode("active");
                }}
                placeholder="Ask about Vengat, work, skills…"
                className="h-11 min-w-0 flex-1 bg-transparent text-[14px] text-paper outline-none placeholder:text-faint"
              />
              <button type="submit" className="keni-send" aria-label="Send message" disabled={keni.pending || !draft.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-none stroke-current stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V6" />
                  <path d="m6.5 11 5.5-5.5L17.5 11" />
                </svg>
              </button>
            </div>
            <p className="mt-2.5 text-center text-[11px] leading-none text-faint">Answers come from this portfolio.</p>
          </form>
        </section>
      )}

      <div
        ref={slotRef}
        className={`keni-slot pointer-events-auto relative${heroSlot ? " keni-slot--hero" : ""}${large ? " keni-slot--large" : ""}${settled ? " is-settled" : ""}${settled && logoPose !== "rest" ? ` keni-slot--pose-${logoPose}` : ""}${hot ? " keni-slot--hot" : ""}${flight ? " keni-slot--flight" : ""}${flight === "to" ? " keni-slot--to-nav" : ""}${keni.open && !flight ? " is-hidden" : ""}${showAsk ? " keni-slot--ask" : ""}`}
        style={{ transformOrigin: "center center" }}
        onMouseEnter={() => {
          keni.holdExhibit(true);
          if (large || keni.open || keni.mode === "thinking" || keni.mode === "processing") return;
          setHot(true);
        }}
        onMouseLeave={() => {
          keni.holdExhibit(false);
          setHot(false);
          if (!keni.open && keni.mode !== "thinking" && keni.mode !== "processing" && keni.mode !== "listening") keni.setMode("idle");
        }}
      >
        <span className="keni-rings" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="keni-slot-sparks" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} style={{ "--i": i } as React.CSSProperties} />
          ))}
        </span>
        {speech && (
          <p className="keni-speech absolute right-0 bottom-[calc(100%+8px)] w-[210px] rounded-[14px] border border-white/12 bg-ink-2 px-3 py-2 text-[12.5px] leading-snug text-paper shadow-lg">
            {speech}
          </p>
        )}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            if (large) {
              setBurst(false);
              return;
            }
            keni.toggle();
          }}
          onFocus={() => {
            if (large || keni.open || keni.mode === "thinking" || keni.mode === "processing") return;
            setHot(true);
          }}
          onBlur={() => {
            setHot(false);
            if (!keni.open && keni.mode !== "thinking" && keni.mode !== "processing" && keni.mode !== "listening") keni.setMode("idle");
          }}
          aria-expanded={keni.open}
          aria-label={showAsk ? "Ask Leni" : large ? "Dismiss Leni" : keni.open ? "Close Leni chat" : "Open Leni, your portfolio guide"}
          className="keni-trigger relative grid place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edit"
        >
          <KeniMark mode={showAsk ? "idle" : face} variant={keni.variant} live={!showAsk} />
          {showAsk && <span className="keni-ask">Ask Leni</span>}
        </button>
      </div>
    </div>
    {large &&
      createPortal(
        <>
          <button
            type="button"
            className={`keni-takeover-dim${dimOn ? " is-on" : ""}`}
            aria-label="Dismiss Leni"
            onClick={() => setBurst(false)}
          />
          {returnStep < RETURN_LINES.length && (
            <p
              key={returnStep}
              className="keni-speech keni-return w-[210px] rounded-[14px] border border-white/12 bg-ink-2 px-3 py-2 text-[12.5px] leading-snug text-paper shadow-lg"
            >
              {RETURN_LINES[returnStep]}
            </p>
          )}
        </>,
        document.body,
      )}
    </>
  );
}
