import type { Judged } from "@/lib/labs/panel";
import { formatRange } from "@/lib/labs/panel";

/** The shaded band is the range. The marker is the value. Both use one scale. */
export function scaleFor(range: Judged["range"], value: number): [number, number] {
  const { low, high } = range;
  if (low !== undefined && high !== undefined) {
    const pad = (high - low) * 0.5;
    return [Math.max(0, Math.min(low - pad, value - pad * 0.3)), Math.max(high + pad, value + pad * 0.3)];
  }
  if (high !== undefined) return [0, Math.max(high * 1.7, value * 1.12)];
  if (low !== undefined) return [0, Math.max(low * 2, value * 1.15)];
  return [0, value * 2 || 1];
}

export default function RangeStrip({ j, caption = true }: { j: Judged; caption?: boolean }) {
  const [a, b] = scaleFor(j.range, j.value);
  const x = (v: number) => Math.min(100, Math.max(0, ((v - a) / (b - a)) * 100));
  const lo = x(j.range.low ?? a), hi = x(j.range.high ?? b);
  const out = j.status !== "in";
  return (
    <>
      <svg className="strip" aria-hidden="true">
        <rect x="0" y="11" width="100%" height="4" fill="var(--line-2)" />
        <rect x={`${lo}%`} y="8" width={`${hi - lo}%`} height="10" fill="#cdd8e0" />
        <line x1={`${x(j.value)}%`} x2={`${x(j.value)}%`} y1="1" y2="25" stroke="var(--blood)" strokeWidth={out ? 5 : 3} />
        <circle cx={`${x(j.value)}%`} cy="13" r="6.5" fill={out ? "var(--blood)" : "var(--sheet)"} stroke="var(--blood)" strokeWidth="3" />
      </svg>
      {caption && <div className="cap"><span>{j.rangeSource === "lab" ? "Your lab" : "General range"}: {formatRange(j.range)}</span><span>{j.marker.unit}</span></div>}
    </>
  );
}

export function StatusWord({ j }: { j: Judged }) {
  if (j.status === "in") return <span className="muted">In range</span>;
  return <span className="flag">{j.status === "high" ? "High" : "Low"}</span>;
}
