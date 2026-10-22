/** Browser-local portfolio analytics — page views for this device only. */

const KEY = "ks:site-analytics";

export type AnalyticsSnapshot = {
  totalViews: number;
  sessions: number;
  days: { date: string; views: number }[];
  pages: { path: string; views: number; last: number }[];
};

type Store = {
  days: Record<string, number>;
  pages: Record<string, { views: number; last: number }>;
  sessions: number;
  lastSessionAt: number;
};

const empty = (): Store => ({ days: {}, pages: {}, sessions: 0, lastSessionAt: 0 });

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function read(): Store {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      days: parsed.days ?? {},
      pages: parsed.pages ?? {},
      sessions: parsed.sessions ?? 0,
      lastSessionAt: parsed.lastSessionAt ?? 0,
    };
  } catch {
    return empty();
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota / private mode */
  }
}

/** Normalize path for aggregation (drop query/hash). */
export function normalizePath(path: string) {
  const bare = path.split("?")[0]?.split("#")[0] || "/";
  return bare.length > 1 && bare.endsWith("/") ? bare.slice(0, -1) : bare || "/";
}

/**
 * Record a page view. Starts a new session after 30 minutes of idle.
 * Debounced per path so React strict-mode remounts don’t double-count.
 */
let lastTracked = "";
let lastAt = 0;

export function trackPageview(path: string) {
  if (typeof window === "undefined") return;
  const p = normalizePath(path);
  const now = Date.now();
  if (p === lastTracked && now - lastAt < 2500) return;
  lastTracked = p;
  lastAt = now;

  const store = read();
  const day = todayKey();
  store.days[day] = (store.days[day] ?? 0) + 1;
  const page = store.pages[p] ?? { views: 0, last: 0 };
  page.views += 1;
  page.last = now;
  store.pages[p] = page;

  if (now - store.lastSessionAt > 30 * 60 * 1000) {
    store.sessions += 1;
  }
  store.lastSessionAt = now;
  write(store);
}

/** Last N days of views (oldest → newest), zero-filled. */
export function getAnalyticsSnapshot(dayCount = 14): AnalyticsSnapshot {
  const store = read();
  const days: { date: string; views: number }[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(cursor.getDate() - i);
    const key = todayKey(d);
    days.push({ date: key, views: store.days[key] ?? 0 });
  }
  const pages = Object.entries(store.pages)
    .map(([path, v]) => ({ path, views: v.views, last: v.last }))
    .sort((a, b) => b.views - a.views);
  const totalViews = Object.values(store.days).reduce((n, v) => n + v, 0);
  return { totalViews, sessions: store.sessions, days, pages };
}

export function clearAnalytics() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  lastTracked = "";
  lastAt = 0;
}
