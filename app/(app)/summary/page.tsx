"use client";

import Link from "next/link";
import { useReport } from "@/lib/session/useReport";
import { TRAIT_BY_ID } from "@/lib/traits/panel";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import { formatRange } from "@/lib/labs/panel";
import { longDate } from "@/lib/date";
import { lead } from "@/lib/text";
import { Loading, Start } from "@/components/Empty";
import Urgent from "@/components/Urgent";

export default function SummaryPage() {
  const r = useReport();
  if (r.loading) return <Loading />;
  if (!r.snps && !r.labs) return <Start title="Visit summary" />;

  const findings = r.insights.filter((i) => i.state === "both" || i.state === "blood");
  const asks = [...new Set(findings.map((i) => i.ask).filter(Boolean))] as string[];
  const out = r.judged.filter((j) => j.status !== "in");
  const notable = r.results.filter((x) => x.reading.tone === "notable" && (!x.trait.sensitive || r.opened.includes(x.trait.id)));

  return (
    <div className="wrap">
      <div className="ptitle">
        <div>
          <h1>Visit summary</h1>
          <p className="muted" style={{ marginTop: 12 }}>{r.sample ? "Sample. Invented values that belong to no one. " : ""}Prepared {longDate(new Date().toISOString().slice(0, 10))}{r.labs ? `. Blood drawn ${longDate(r.labs.date)}` : ""}.</p>
        </div>
        <button className="btn fill noprint" onClick={() => window.print()}>Print or save as PDF</button>
      </div>

      <Urgent judged={r.judged} date={r.labs ? longDate(r.labs.date) : undefined} />

      {!r.labs && <p className="err noprint" style={{ marginBottom: 30 }}>Add a <Link className="link" href="/blood">blood test</Link> to make this page useful at a visit.</p>}

      {asks.length > 0 && <section className="sect"><h2 style={{ marginBottom: 14 }}>Questions to ask</h2><ul style={{ display: "grid", gap: 12 }}>{asks.map((a) => <li key={a} className="check"><input type="checkbox" aria-label={`Asked: ${a}`} /> <span>{a}</span></li>)}</ul></section>}

      {out.length > 0 && (
        <section className="sect"><h2 style={{ marginBottom: 14 }}>Values outside their range</h2>
          <div className="tblwrap"><table className="tbl" style={{ background: "none" }}><thead><tr><th scope="col">Test</th><th scope="col">Value</th><th scope="col">Range</th><th scope="col">Related marker</th></tr></thead>
            <tbody>{out.map((j) => {
              const i = findings.find((x) => x.labs.includes(j.id)), t = i && TRAIT_BY_ID.get(i.traitId)!, res = t && r.results.find((x) => x.trait.id === t.id);
              return <tr key={j.id}><th scope="row">{j.marker.name}{j.derived ? " (calculated)" : ""}</th><td className="num">{j.bound}{j.value} {j.marker.unit} <span className="flag">{j.status === "high" ? "High" : "Low"}</span></td><td className="num">{formatRange(j.range)}{j.rangeSource === "general" ? " (general)" : ""}</td><td>{t && res ? <>{t.gene} <span className="mono">{res.reading.genotype}</span></> : <span className="muted">Not paired</span>}</td></tr>;
            })}</tbody></table></div>
        </section>
      )}

      {notable.length > 0 && (
        <section className="sect"><h2 style={{ marginBottom: 14 }}>Genotypes worth knowing</h2>
          <div className="tblwrap"><table className="tbl" style={{ background: "none" }}><thead><tr><th scope="col">Gene</th><th scope="col">Result</th><th scope="col">Markers</th></tr></thead>
            <tbody>{notable.map((x) => <tr key={x.trait.id}><th scope="row">{x.trait.gene}</th><td><span className="mono">{x.reading.genotype}</span>, {lead(x.reading.label)}</td><td className="mono small">{x.trait.rsids.join(", ")}</td></tr>)}</tbody></table></div>
        </section>
      )}

      {r.labs && r.missing.length > 0 && <section className="sect"><h2 style={{ marginBottom: 14 }}>Not measured on this panel</h2><ul>{r.missing.map((m) => <li key={m.trait.trait.id}>{BIOMARKER_BY_ID.get(m.labs[0])!.name.split(",")[0]} ({m.trait.trait.gene})</li>)}</ul></section>}

      <p className="small muted measure">Genotypes come from a consumer array on the GRCh37 plus strand and have not been clinically confirmed. Blood values were read from a report or typed in, then checked by the person. DNA Genie does not diagnose. dnagenie.app</p>
    </div>
  );
}
