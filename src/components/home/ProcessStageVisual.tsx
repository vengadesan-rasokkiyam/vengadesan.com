/** Coded stage panels for How I Work — no external photos. */

const STAGES = [
  {
    eyebrow: "DISCOVERY LOG",
    nodes: ["Interview 01", "Pain map", "Jobs to be done", "Constraints"],
    grid: [
      ["Stakeholder", "Ops lead · 42m"],
      ["Signal", "Exception queue too deep"],
      ["Outcome", "One triage surface"],
    ],
  },
  {
    eyebrow: "JOURNEY MAP",
    nodes: ["Aware", "Enter", "Act", "Resolve", "Return"],
    grid: [
      ["Lane", "End-to-end flow"],
      ["Friction", "Tool switch ×3"],
      ["Fix", "Shared IA spine"],
    ],
  },
  {
    eyebrow: "SYSTEM · UI",
    nodes: ["Tokens", "Components", "States", "Patterns"],
    grid: [
      ["Surface", "Dashboard shell"],
      ["Density", "Ops-first tables"],
      ["Handoff", "Annotated frames"],
    ],
  },
  {
    eyebrow: "VALIDATE",
    nodes: ["Heuristic", "Task test", "A11y pass", "QA notes"],
    grid: [
      ["Sample", "5 operators"],
      ["Pass", "What’s next < 8s"],
      ["Blocker", "Filter reset bug"],
    ],
  },
  {
    eyebrow: "HANDOFF",
    nodes: ["Specs", "Tokens", "Prototype", "QA checklist"],
    grid: [
      ["Build", "Ready for eng"],
      ["Tokens", "Color · type · space"],
      ["Owner", "Design ↔ eng sync"],
    ],
  },
] as const;

export default function ProcessStageVisual({
  index,
  active,
}: {
  index: number;
  active: boolean;
}) {
  const stage = STAGES[index] ?? STAGES[0];

  return (
    <div
      className="absolute inset-0 p-4 transition-all duration-700 md:p-6"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "scale(1)" : "scale(1.03)",
        pointerEvents: active ? "auto" : "none",
      }}
      aria-hidden={!active}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[16px] border border-white/10 bg-ink">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 md:px-5">
          <p className="mono text-[10px] tracking-[0.14em] text-code">{stage.eyebrow}</p>
          <p className="mono text-[10px] text-faint">
            STAGE {String(index + 1).padStart(2, "0")} / 05
          </p>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 p-4 md:grid-cols-12 md:gap-4 md:p-5">
          <div className="flex flex-col gap-2 md:col-span-5">
            {stage.nodes.map((n, ni) => (
              <div
                key={n}
                className="flex items-center gap-3 rounded-[10px] border border-white/10 bg-ink-2 px-3 py-2.5"
                style={{ opacity: 1 - ni * 0.08 }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                  style={{
                    background: ni === 0 ? "var(--color-code)" : "rgb(255 255 255 / .06)",
                    color: ni === 0 ? "var(--color-ink)" : "var(--color-dim)",
                  }}
                >
                  {ni + 1}
                </span>
                <span className="truncate text-[13px] text-paper/90">{n}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-between rounded-[12px] border border-white/10 bg-ink-2 p-4 md:col-span-7 md:p-5">
            <div className="space-y-3">
              {stage.grid.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                  <span className="label text-faint">{k}</span>
                  <span className="text-right text-[13px] text-paper/85">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full bg-code transition-all duration-700"
                  style={{ width: `${((index + 1) / 5) * 100}%` }}
                />
              </span>
              <span className="mono text-[10px] text-code">{Math.round(((index + 1) / 5) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
