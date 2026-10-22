"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { replyTo, type KeniAnswer } from "@/lib/keni";
import { reducedMotion } from "@/lib/motion";

export type KeniMode =
  | "idle"
  | "hover"
  | "active"
  | "thinking"
  | "processing"
  | "listening"
  | "success"
  | "happy"
  | "encouraging"
  | "sleep"
  | "curious"
  | "wink"
  | "wow"
  | "surprised"
  | "grin"
  | "knock"
  | "reminder"
  | "wave"
  | "goodbye"
  | "point"
  | "helpful"
  | "shy"
  | "welcome"
  | "celebrate";

export type KeniMessage = { id: string; from: "you" | "keni"; text: string; href?: string; label?: string };

type KeniContextValue = {
  mode: KeniMode;
  variant: 0 | 1;
  setMode: (mode: KeniMode) => void;
  play: (mode: KeniMode, ms?: number) => void;
  poke: () => void;
  preview: (mode: KeniMode) => void;
  open: boolean;
  minimized: boolean;
  toggle: () => void;
  close: () => void;
  minimize: () => void;
  restore: () => void;
  messages: KeniMessage[];
  pending: boolean;
  send: (text: string) => void;
  clear: () => void;
  bubble: string | null;
  on: boolean;
  setOn: (on: boolean) => void;
  exhibit: KeniMode;
  holdExhibit: (hold: boolean) => void;
};

const KeniContext = createContext<KeniContextValue | null>(null);

export function useKeni() {
  const ctx = useContext(KeniContext);
  if (!ctx) throw new Error("useKeni must be used inside KeniProvider");
  return ctx;
}

const GESTURE = new Set<KeniMode>([
  "knock",
  "reminder",
  "wave",
  "goodbye",
  "point",
  "helpful",
  "thinking",
  "processing",
  "success",
  "happy",
  "encouraging",
  "shy",
  "wow",
  "surprised",
  "welcome",
  "celebrate",
  "curious",
  "listening",
  "grin",
  "wink",
]);

const SLEEP_MS = 45_000;
const THINK_MS = 650;
const EXHIBIT: KeniMode[] = ["curious", "hover", "active", "success", "thinking", "sleep"];

export default function KeniProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<KeniMode>("idle");
  const [variant, setVariant] = useState<0 | 1>(0);
  const modeRef = useRef<KeniMode>("idle");
  const openRef = useRef(false);
  const playTimer = useRef(0);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<KeniMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [on, setOnState] = useState(true);
  const [exhibit, setExhibit] = useState<KeniMode>("idle");
  const exhibitLock = useRef(false);
  const previewTimer = useRef(0);
  const sleepTimer = useRef(0);
  const thinkTimer = useRef(0);
  const greeted = useRef(false);
  modeRef.current = mode;
  openRef.current = open;

  const setMode = useCallback((next: KeniMode | ((mode: KeniMode) => KeniMode)) => {
    setModeState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (value !== prev && GESTURE.has(value)) setVariant((v) => (v === 0 ? 1 : 0));
      return value;
    });
  }, []);

  const play = useCallback(
    (next: KeniMode, ms = 1400) => {
      window.clearTimeout(playTimer.current);
      setMode(next);
      playTimer.current = window.setTimeout(() => {
        setMode((m) => (m === next ? (openRef.current ? "active" : "idle") : m));
      }, reducedMotion() ? 0 : ms);
    },
    [setMode],
  );

  const wake = useCallback(() => {
    window.clearTimeout(sleepTimer.current);
    sleepTimer.current = window.setTimeout(() => {
      const current = modeRef.current;
      if (current === "thinking" || current === "processing" || current === "listening" || current === "active" || openRef.current) return;
      if (document.documentElement.dataset.keniLarge) return;
      setMode("sleep");
      setBubble("I'll be here when you need me.");
    }, SLEEP_MS);
  }, [setMode]);

  const poke = useCallback(() => {
    if (modeRef.current === "sleep") setMode("idle");
    setBubble((b) => (b === "I'll be here when you need me." ? null : b));
    wake();
  }, [setMode, wake]);

  useEffect(() => {
    try {
      if (localStorage.getItem("ks:keni") === "0") setOnState(false);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!on || reducedMotion()) return;
    let i = 0;
    let showTimer = 0;
    const loop = window.setInterval(() => {
      if (exhibitLock.current || open || pending) return;
      const next = EXHIBIT[i % EXHIBIT.length];
      i += 1;
      setExhibit(next);
      window.clearTimeout(showTimer);
      showTimer = window.setTimeout(() => setExhibit("idle"), 3400);
    }, 7000);
    return () => {
      window.clearInterval(loop);
      window.clearTimeout(showTimer);
    };
  }, [on, open, pending]);

  const holdExhibit = useCallback((hold: boolean) => {
    exhibitLock.current = hold;
    if (hold) setExhibit("idle");
  }, []);

  useEffect(() => {
    if (!on) return;
    wake();
    if (reducedMotion()) return;
    const show = window.setTimeout(() => {
      if (greeted.current) return;
      greeted.current = true;
      setBubble("Hey Buddy! Need help exploring?");
    }, 1400);
    const hide = window.setTimeout(() => setBubble((b) => (b === "Hey Buddy! Need help exploring?" ? null : b)), 8000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
      window.clearTimeout(sleepTimer.current);
      window.clearTimeout(previewTimer.current);
      window.clearTimeout(thinkTimer.current);
    };
  }, [on, wake]);

  const setOn = useCallback((next: boolean) => {
    setOnState(next);
    try {
      localStorage.setItem("ks:keni", next ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
    if (!next) {
      setOpen(false);
      setMinimized(false);
      setMode("idle");
      setBubble(null);
    }
  }, []);

  const preview = useCallback(
    (next: KeniMode) => {
      window.clearTimeout(previewTimer.current);
      setMode(next);
      wake();
      previewTimer.current = window.setTimeout(() => {
        setMode((m) => (m === next ? (open ? "active" : "idle") : m));
      }, 2600);
    },
    [open, wake],
  );

  const toggle = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      setMinimized(false);
      window.clearTimeout(playTimer.current);
      if (next) {
        setMode("curious");
        playTimer.current = window.setTimeout(() => {
          setMode((m) => (m === "curious" ? "welcome" : m));
          playTimer.current = window.setTimeout(() => {
            setMode((m) => (m === "welcome" ? "active" : m));
          }, reducedMotion() ? 0 : 700);
        }, reducedMotion() ? 0 : 420);
      } else {
        setMode("goodbye");
        playTimer.current = window.setTimeout(() => {
          setMode((m) => (m === "goodbye" ? "idle" : m));
        }, reducedMotion() ? 0 : 800);
      }
      setBubble(null);
      return next;
    });
    wake();
  }, [setMode, wake]);

  const close = useCallback(() => {
    setOpen(false);
    setMinimized(false);
    window.clearTimeout(playTimer.current);
    setMode("goodbye");
    playTimer.current = window.setTimeout(() => {
      setMode((m) => (m === "goodbye" ? "idle" : m));
    }, reducedMotion() ? 0 : 800);
    wake();
  }, [setMode, wake]);

  const minimize = useCallback(() => setMinimized(true), []);
  const restore = useCallback(() => {
    setMinimized(false);
    setOpen(true);
    setMode("active");
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;
      const you: KeniMessage = { id: `y-${Date.now()}`, from: "you", text: trimmed };
      setMessages((list) => [...list, you]);
      setPending(true);
      setMode("processing");
      setBubble(null);
      wake();
      window.clearTimeout(thinkTimer.current);
      thinkTimer.current = window.setTimeout(() => {
        let answer: KeniAnswer;
        try {
          answer = replyTo(trimmed);
        } catch {
          answer = {
            mood: "curious",
            text: "I couldn't answer that from the portfolio. The contact section is the sure path.",
            href: "/#contact",
            label: "Open contact",
          };
        }
        const keni: KeniMessage = {
          id: `k-${Date.now()}`,
          from: "keni",
          text: answer.text,
          href: answer.href,
          label: answer.label,
        };
        setMessages((list) => [...list, keni]);
        setPending(false);
        const asked = trimmed.toLowerCase();
        const next: KeniMode = /thank|awesome|love your/.test(asked)
          ? "shy"
          : answer.href?.startsWith("/work/")
            ? "celebrate"
            : answer.href
              ? "helpful"
              : answer.mood === "curious"
                ? "curious"
                : "happy";
        setMode(next);
        if (next === "helpful") {
          window.setTimeout(() => setMode((m) => (m === "helpful" ? "encouraging" : m)), reducedMotion() ? 0 : 700);
        }
        window.setTimeout(
          () => setMode((m) => (m === next || m === "encouraging" || m === "happy" ? "active" : m)),
          reducedMotion() ? 0 : 1700,
        );
      }, reducedMotion() ? 0 : THINK_MS);
    },
    [pending, wake],
  );

  const clear = useCallback(() => {
    window.clearTimeout(thinkTimer.current);
    setMessages([]);
    setPending(false);
    setMode(openRef.current ? "active" : "idle");
  }, [setMode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      variant,
      play,
      poke,
      preview,
      open,
      minimized,
      toggle,
      close,
      minimize,
      restore,
      messages,
      pending,
      send,
      clear,
      bubble,
      on,
      setOn,
      exhibit,
      holdExhibit,
    }),
    [mode, setMode, variant, play, poke, preview, open, minimized, toggle, close, minimize, restore, messages, pending, send, clear, bubble, on, setOn, exhibit, holdExhibit],
  );

  return <KeniContext.Provider value={value}>{children}</KeniContext.Provider>;
}