import type { Evidence } from "@/lib/traits/types";

export const EVIDENCE: Record<Evidence, string> = { 3: "Well established", 2: "Replicated", 1: "Early or mixed" };

export default function Bonds({ n, label = true }: { n: Evidence; label?: boolean }) {
  return (
    <span className="bonds" title={label ? `Evidence: ${EVIDENCE[n]}` : undefined}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= n ? "on" : ""} aria-hidden="true" />)}
      {label && <span className="sr">Evidence: {EVIDENCE[n]}</span>}
    </span>
  );
}
