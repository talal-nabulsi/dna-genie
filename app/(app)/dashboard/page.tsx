"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useReport } from "@/lib/session/useReport";
import { GROUPS } from "@/lib/traits/groups";
import { TRAITS, TRAIT_BY_ID } from "@/lib/traits/panel";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import { longDate } from "@/lib/date";
import { lead } from "@/lib/text";
import { Loading, Start } from "@/components/Empty";
import Rung from "@/components/Rung";
import Urgent from "@/components/Urgent";
import RangeStrip, { StatusWord } from "@/components/RangeStrip";

export default function ReportPage() {
  const r = useReport();
  const [q, setQ] = useState("");
  const [only, setOnly] = useState(false);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return r.results.filter((x) => {
      const hidden = !!x.trait.sensitive && !r.opened.includes(x.trait.id);
      const measured = x.trait.labs?.some((id) => r.judged.some((j) => j.id === id));
      if (only && !measured) return false;
      return !s || [x.trait.name, x.trait.gene, ...x.trait.rsids, hidden ? "" : x.reading.label].some((t) => t.toLowerCase().includes(s));
    });
  }, [r.results, r.judged, r.opened, q, only]);

  if (r.loading) return <Loading />;
  if (r.error) return <div className="wrap" style={{ paddingTop: 60 }}><p className="err">{r.error}</p></div>;
  if (!r.snps && !r.labs) return <Start />;

  const both = r.insights.filter((i) => i.state === "both" || i.state === "blood");
  const unread = r.snps ? TRAITS.length - r.results.length : 0;

  return (
    <div className="wrap">
      <div className="ptitle">
        <div>
          <h1>{r.sample ? "Sample report" : "Your report"}</h1>
          <p className="muted" style={{ marginTop: 12 }}>
            {r.snps ? `${r.results.length} of ${TRAITS.length} markers read` : "No DNA file yet"}
            {r.labs ? `, with ${r.labs.values.length} blood values from ${longDate(r.labs.date)}` : ", no blood test yet"}.
          </p>
        </div>
        <div className="row">
          {!r.snps && <Link className="btn fill" href="/upload">Open a DNA file</Link>}
          {!r.labs && <Link className="btn red" href="/blood">Add a blood test</Link>}
          {r.labs && <Link className="btn" href="/summary">Visit summary</Link>}
        </div>
      </div>

      <Urgent judged={r.judged} date={r.labs ? longDate(r.labs.date) : undefined} />

      <div className="report">
        <nav className="idx" aria-label="Sections">
          {r.labs && <a href="#findings">Out of range <span className="num">{both.length + r.loose.length}</span></a>}
          {r.snps && GROUPS.map((g) => { const n = rows.filter((x) => x.trait.group === g.id).length; return n ? <a key={g.id} href={`#${g.id}`}>{g.name} <span className="num">{n}</span></a> : null; })}
        </nav>

        <div style={{ minWidth: 0 }}>
          {r.labs && (
            <section className="sect" id="findings">
              <h2>Out of range</h2>
              <p className="muted">Blood values outside their range, with related DNA markers.</p>
              {both.length + r.loose.length === 0 && <p>Every value you entered is in range.</p>}
              {both.map((i) => {
                const t = TRAIT_BY_ID.get(i.traitId)!, res = r.results.find((x) => x.trait.id === t.id)!;
                return (
                  <article className="find" key={i.traitId}>
                    <div>
                      <h3><Link href={`/traits/${t.id}`} style={{ textDecoration: "none" }}>{i.title}</Link></h3>
                      <p className="measure">{i.text}</p>
                      {i.ask && <p className="measure" style={{ marginTop: 10 }}><strong>Question to ask:</strong> {i.ask}</p>}
                    </div>
                    <div className="ev">
                      <div className="dna">{t.gene} <span className="mono">{res.reading.genotype}</span></div>
                      {i.labs.map((id) => { const j = r.judged.find((x) => x.id === id)!; return <div className="blood" key={id}>{j.marker.name} <span className="num">{j.bound}{j.value} {j.marker.unit}</span> <StatusWord j={j} /></div>; })}
                    </div>
                  </article>
                );
              })}
              {r.loose.length > 0 && (
                <div style={{ borderTop: "2px solid var(--ink)", paddingTop: 22, marginTop: both.length ? 8 : 0 }}>
                  <h3 style={{ fontSize: "1.35rem", marginBottom: 6 }}>Other values out of range</h3>
                  <p className="muted" style={{ marginBottom: 14 }}>No related DNA marker is read for these. Ask a clinician what they mean and whether to repeat them.</p>
                  {r.loose.map((j) => <div key={j.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "4px 40px", padding: "12px 0", borderTop: "1px solid var(--line)" }}><span>{j.marker.name} <strong className="num">{j.bound}{j.value} {j.marker.unit}</strong> <StatusWord j={j} /></span><div><RangeStrip j={j} /></div></div>)}
                </div>
              )}
            </section>
          )}

          {r.labs && r.missing.length > 0 && (
            <section className="sect">
              <h2>Related tests not on this panel</h2>
              <p className="muted">These relate to your genotypes and were not measured.</p>
              <ul>{r.missing.map((m) => <li key={m.trait.trait.id} style={{ padding: "6px 0" }}><strong>{BIOMARKER_BY_ID.get(m.labs[0])!.name.split(",")[0]}</strong>, because of <Link className="link dna" href={`/traits/${m.trait.trait.id}`}>{m.trait.trait.gene}: {lead(m.trait.reading.label)}</Link></li>)}</ul>
            </section>
          )}

          {r.snps && (
            <>
              <div className="filters">
                <label className="field" style={{ flex: "1 1 260px" }}><span className="sr">Search markers</span><input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a gene, result or rsID" /></label>
                {r.labs && <label className="check"><input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} /> Only markers with a blood value</label>}
              </div>
              {rows.length === 0 && <p>No markers match.</p>}
              {GROUPS.map((g) => {
                const list = rows.filter((x) => x.trait.group === g.id);
                if (!list.length) return null;
                return (
                  <section className="sect" id={g.id} key={g.id}>
                    <h2>{g.name}</h2>
                    <p className="muted">{g.blurb}</p>
                    <div className="ladder-head"><span className="dna"><strong>DNA</strong></span><span className="mid">Evidence</span><span className="blood"><strong>Blood test</strong></span></div>
                    <div className="ladder">
                      {list.map((x) => <Rung key={x.trait.id} result={x} judged={r.judged} hasPanel={!!r.labs} hidden={!!x.trait.sensitive && !r.opened.includes(x.trait.id)} />)}
                    </div>
                  </section>
                );
              })}
              {unread > 0 && <p className="muted small">{unread} markers were not in your file or could not be read. Files differ by company and year. If you saved a file with an older version of this site, <Link className="link" href="/upload">open it again</Link> to add the newer markers.</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
