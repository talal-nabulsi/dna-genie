import { COMP, type Base } from "@/lib/molecule/bdna";

/** Both strands as lettered tiles, in the molecule's colors. The marker is yellow for the reference letter and green for the other letter. */
export default function Seq({ flank, letters, span = 30 }: { flank: string; letters?: string; span?: number }) {
  const from = 30 - span, seq = flank.slice(from, 31 + span), mid = span;
  const own = letters ? [...new Set(letters)] : [seq[mid]];
  const row = (comp: boolean) => [...seq].map((b, i) => {
    const l = i === mid ? own.map((x) => (comp ? COMP[x as Base] : x)).join("/") : comp ? COMP[b as Base] : b;
    return <i key={i} className={i === mid ? (own.length === 1 && own[0] !== seq[mid] ? "t on alt" : "t on") : `t t-${l}`}>{l}</i>;
  });
  return (
    <div className="seq" tabIndex={0} role="img" aria-label={`Sequence ${seq}, marker letter ${own.join(" or ")}`}>
      <div aria-hidden="true">{row(false)}</div>
      <div aria-hidden="true">{row(true)}</div>
    </div>
  );
}
