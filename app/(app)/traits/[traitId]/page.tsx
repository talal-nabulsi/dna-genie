"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import citations from "@/lib/traits/citations.json";
import { useReport } from "@/lib/session/useReport";
import { update } from "@/lib/session/store";
import { LOCI } from "@/lib/traits/interpret";
import { GROUP_BY_ID } from "@/lib/traits/groups";
import { RETIRED, TRAIT_BY_ID } from "@/lib/traits/panel";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import { normalizeGenotype } from "@/lib/traits/interpret";
import Bonds, { EVIDENCE } from "@/components/Bonds";
import RangeStrip, { StatusWord } from "@/components/RangeStrip";
import Trace from "@/components/Trace";
import { Loading } from "@/components/Empty";

const CITE = citations as Record<string, { title: string; journal: string; year: number }>;

export default function TraitPage() {
  const id = useParams().traitId as string;
  const r = useReport();
  const t = TRAIT_BY_ID.get(id);

  if (!t) {
    return (
      <div className="wrap">
        <div className="ptitle"><h1>{RETIRED[id] ? "This marker was removed" : "Marker not found"}</h1></div>
        <p className="measure" style={{ marginBottom: 24 }}>{RETIRED[id] ?? "There is no marker at this address."}</p>
        <Link className="btn" href="/dashboard">Back to the report</Link>
      </div>
    );
  }
  if (r.loading) return <Loading />;

  const result = r.results.find((x) => x.trait.id === id);
  const hidden = !!t.sensitive && !r.opened.includes(id);
  const reading = result && !hidden ? result.reading : null;
  const insight = r.insights.find((i) => i.traitId === id);
  const rows = t.outcomes ?? Object.entries(t.table ?? {}).map(([genotype, x]) => ({ genotype, ...x }));
  const labs = (t.labs ?? []).map((l) => ({ marker: BIOMARKER_BY_ID.get(l)!, j: r.judged.find((x) => x.id === l) }));

  return (
    <div className="wrap">
      <div className="ptitle">
        <div>
          <p style={{ marginBottom: 14 }}><Link className="link" href={`/dashboard#${t.group}`}>{GROUP_BY_ID.get(t.group)!.name}</Link></p>
          <h1>{t.name}</h1>
        </div>
        <p><Bonds n={t.evidence} label={false} /> <span style={{ marginLeft: 8 }}>{EVIDENCE[t.evidence]}</span></p>
      </div>

      <div className="two">
        <div style={{ display: "grid", gap: 40 }}>
          {hidden ? (
            <div className="box strand-l">
              <h2 style={{ fontSize: "1.6rem", marginBottom: 10 }}>You choose whether to see this</h2>
              <p className="measure" style={{ marginBottom: 18 }}>{t.sensitive} A genetic counselor can help you decide.</p>
              <div className="row">
                <button className="btn fill" onClick={() => update({ opened: [...r.opened, id] })}>Show my result</button>
                <a className="btn" href="https://findageneticcounselor.nsgc.org/" target="_blank" rel="noopener noreferrer">Find a genetic counselor</a>
              </div>
            </div>
          ) : reading ? (
            <div className="box strand-l">
              <p className="big dna" style={{ fontFamily: "var(--mono)", fontWeight: 600, letterSpacing: 0, fontSize: "clamp(1.9rem,4vw,3rem)" }}>{reading.genotype}</p>
              <h2 style={{ fontSize: "1.6rem", margin: "14px 0 8px" }}>{reading.label}</h2>
              <p className="measure">{reading.text}</p>
            </div>
          ) : (
            <p className="err">{r.snps ? "This marker was not in your file, or could not be read." : <>Open a DNA file to see your result. <Link className="link" href="/upload">Read a file</Link></>}</p>
          )}

          {insight && !hidden && (
            <div className="box strand-l strand-r">
              <h2 style={{ fontSize: "1.45rem", marginBottom: 8 }}>{insight.title}</h2>
              <p className="measure">{insight.text}</p>
              {insight.ask && <p className="measure" style={{ marginTop: 10 }}><strong>Ask:</strong> {insight.ask}</p>}
            </div>
          )}

          <section>
            <h2 style={{ fontSize: "1.45rem", marginBottom: 10 }}>What it is</h2>
            <p className="measure">{t.about}</p>
          </section>
          <section>
            <h2 style={{ fontSize: "1.45rem", marginBottom: 10 }}>What it cannot tell you</h2>
            <p className="measure">{t.limits}</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", marginBottom: 10 }}>Every possible result</h2>
            <div className="tblwrap"><table className="tbl" style={{ background: "none" }}>
              <tbody>{rows.map((x) => {
                const mine = reading?.genotype === x.genotype;
                return <tr key={x.genotype} style={mine ? { background: "var(--dna-tint)" } : undefined}><th scope="row" className="mono" style={{ paddingLeft: 12 }}>{x.genotype}{mine && <span style={{ display: "block", fontFamily: "var(--text)", fontSize: 14 }}>Yours</span>}</th><td><strong>{x.label}</strong><br /><span className="muted">{x.text}</span></td></tr>;
              })}</tbody>
            </table></div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.45rem", marginBottom: 10 }}>Sources</h2>
            <ol style={{ display: "grid", gap: 12 }}>
              {t.pmids.map((p) => <li key={p}><a className="link" href={`https://pubmed.ncbi.nlm.nih.gov/${p}/`} target="_blank" rel="noopener noreferrer">{CITE[p].title}</a><br /><span className="small muted">{CITE[p].journal}, {CITE[p].year}. PubMed {p}</span></li>)}
              {t.dois?.map((d) => <li key={d.doi}><a className="link" href={`https://doi.org/${d.doi}`} target="_blank" rel="noopener noreferrer">{d.title}</a><br /><span className="small muted">{d.journal}, {d.year}. doi {d.doi}</span></li>)}
            </ol>
          </section>
        </div>

        <aside style={{ display: "grid", gap: 36 }}>
          <section>
            <h2 className="dna" style={{ fontSize: "1.25rem", marginBottom: 12 }}>{t.gene}</h2>
            {t.rsids.map((rs) => {
              const l = LOCI[rs], g = hidden ? undefined : normalizeGenotype(rs, r.snps?.get(rs));
              return (
                <div key={rs} style={{ marginBottom: 22 }}>
                  <p className="ln" style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                    <a className="link mono" href={`https://www.ncbi.nlm.nih.gov/snp/${rs}`} target="_blank" rel="noopener noreferrer">{rs}</a>
                    <span className="mono small muted">chr{l.chr}:{l.pos.toLocaleString("en-US")}</span>
                  </p>
                  <Trace flank={l.flank} genotype={g} />
                </div>
              );
            })}
            <p className="small muted" style={{ marginBottom: 14 }}>Letters are the real sequence on the GRCh37 plus strand. Peaks are drawn, not measured.</p>
            <Link className="btn" href={`/explore?site=${t.rsids[0]}`}>See it on the genome map</Link>
          </section>
          {labs.length > 0 && (
            <section>
              <h2 className="blood" style={{ fontSize: "1.25rem", marginBottom: 12 }}>In your blood</h2>
              <div style={{ display: "grid", gap: 20 }}>
                {labs.filter((x) => x.j).map(({ marker, j }) => <div key={marker.id}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>{marker.name}</span><span><strong className="num">{j!.bound}{j!.value}</strong> <StatusWord j={j!} /></span></div><RangeStrip j={j!} /></div>)}
                {labs.every((x) => !x.j) && <p className="muted">{labs.map((x) => x.marker.name.split(",")[0]).filter((n, i, a) => a.indexOf(n) === i).join(", ")}: {r.labs ? "not on your panel." : <Link className="link" href="/blood">add a blood test</Link>}</p>}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
