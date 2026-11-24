/** A drawn sequencing trace for one site. Peak heights are illustrative; the letters are the real sequence. */
const HUE: Record<string, string> = { A: "var(--A)", C: "var(--C)", G: "var(--G)", T: "var(--T)" };

export default function Trace({ flank, genotype }: { flank: string; genotype?: string }) {
  const from = 18, to = 43, seq = flank.slice(from, to), mid = 30 - from;
  const step = 34, w = seq.length * step + 20, base = 120;
  const jitter = (i: number) => 0.72 + (((i * 37) % 11) / 11) * 0.28;
  const letters = [...seq].map((b, i) => (i === mid && genotype ? [...new Set(genotype)] : [b]));
  const bell = (x: number, h: number) => {
    const s = 15;
    return `M${x - 2 * s} ${base} C${x - s} ${base} ${x - s * 0.55} ${base - h} ${x} ${base - h} S${x + s} ${base} ${x + 2 * s} ${base} Z`;
  };
  return (
    <svg className="trace" viewBox={`0 0 ${w} 164`} role="img" aria-label={`Sequence around the marker: ${seq}${genotype ? `, your letters ${genotype.split("").join(" and ")}` : ""}`}>
      <rect x={10 + mid * step} y="0" width={step} height="164" fill="var(--dna-tint)" />
      {letters.map((bs, i) => bs.map((b) => <path key={`${i}${b}`} d={bell(10 + i * step + step / 2, (bs.length > 1 ? 58 : 98) * jitter(i))} fill={HUE[b]} fillOpacity=".1" stroke={HUE[b]} strokeWidth="2.2" />))}
      <line x1="0" x2={w} y1={base} y2={base} stroke="var(--line)" />
      {letters.map((bs, i) => <text key={i} x={10 + i * step + step / 2} y="148" textAnchor="middle" fontSize={bs.length > 1 ? 18 : 21} fontWeight={i === mid ? 700 : 500} style={{ fontFamily: "var(--mono)" }} fill={bs.length > 1 ? "var(--ink)" : HUE[bs[0]]}>{bs.join("/")}</text>)}
    </svg>
  );
}
