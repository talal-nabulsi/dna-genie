import Link from "next/link";
import Bonds from "./Bonds";
import RangeStrip, { StatusWord } from "./RangeStrip";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import type { Judged } from "@/lib/labs/panel";
import type { TraitResult } from "@/lib/traits/types";

/** One marker across from its blood test. */
export default function Rung({ result, judged, hidden, hasPanel }: { result: TraitResult; judged: Judged[]; hidden: boolean; hasPanel: boolean }) {
  const { trait, reading } = result;
  const mine = (trait.labs ?? []).map((id) => judged.find((x) => x.id === id)).filter((x): x is Judged => !!x);
  const j = mine.find((x) => x.status !== "in") ?? mine[0];
  const first = trait.labs?.[0];
  return (
    <Link className="rung" href={`/traits/${trait.id}`}>
      <div>
        <div className="ln"><span className="nm">{trait.name}</span><span className="gt dna">{hidden ? "Hidden" : reading.genotype}</span></div>
        <p className="small muted">{hidden ? "You choose whether to see this one." : reading.label}</p>
      </div>
      <div className="mid"><Bonds n={trait.evidence} /></div>
      <div>
        {j ? (
          <>
            <div className="ln"><span>{j.marker.name}</span><span><strong className="num">{j.bound}{j.value}</strong> <StatusWord j={j} /></span></div>
            <RangeStrip j={j} />
          </>
        ) : (
          <span className="quiet">{first ? `${BIOMARKER_BY_ID.get(first)!.name.split(",")[0]}: ${hasPanel ? "not on your panel" : "add a blood test"}` : "No blood test for this"}</span>
        )}
      </div>
    </Link>
  );
}
