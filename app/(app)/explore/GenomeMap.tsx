"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Karyogram, { SITES } from "@/components/Karyogram";
import { LOCI, normalizeGenotype } from "@/lib/traits/interpret";
import { GROUPS, GROUP_BY_ID } from "@/lib/traits/groups";
import Molecule from "@/components/Molecule";
import Seq from "@/components/Seq";
import { moleculeSite } from "@/lib/molecule/sites";
import { useReport } from "@/lib/session/useReport";


export default function GenomeMap() {
  const params = useSearchParams(), router = useRouter();
  const r = useReport();
  const [group, setGroup] = useState("");
  const [shown, setShown] = useState({ rsid: "", k: 0 });
  const panel = useRef<HTMLDivElement>(null);
  const site = SITES.find((s) => s.rsid === params.get("site")) ?? SITES.find((s) => s.rsid === "rs4988235")!;
  const l = LOCI[site.rsid];
  const hidden = !!site.trait.sensitive && !r.opened.includes(site.trait.id);
  const g = hidden ? undefined : normalizeGenotype(site.rsid, r.snps?.get(site.rsid));
  const copy = shown.rsid === site.rsid ? shown.k : 0;
  const het = !!g && g[0] !== g[1];
  const letter = g ? g[het ? copy : 0] : l.flank[30];
  const pose = useMemo(() => ({ span: 34, angle: -0.06, x: 0, y: 0 }), []);

  const select = (rsid: string) => {
    router.replace(`/explore?site=${rsid}`, { scroll: false });
    if (window.innerWidth < 900) panel.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="wrap">
      <div className="ptitle">
        <div><h1>Genome map</h1><p className="muted measure" style={{ marginTop: 12 }}>Chromosomes 1 to 22 and X, drawn to scale. Choose a position to see its sequence.</p></div>
        <label className="field" style={{ minWidth: 220 }}><span>Show</span><select className="input" value={group} onChange={(e) => setGroup(e.target.value)}><option value="">Every position</option>{GROUPS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      </div>

      <Karyogram selected={site.rsid} onSelect={(s) => select(s.rsid)} dim={(s) => !!group && s.trait.group !== group} />

      <div ref={panel} className="two" style={{ marginTop: 36, scrollMarginTop: 90 }}>
        <div style={{ minWidth: 0 }}>
          <div className="map3d"><Molecule site={moleculeSite(site.rsid)} alt={letter !== l.flank[30]} pose={pose} label={`DNA around ${site.trait.gene} ${site.rsid}. The marker is yellow. Drag to turn.`} /></div>
          <Seq flank={l.flank} letters={letter} span={14} />
        </div>
        <aside>
          <p className="muted">{GROUP_BY_ID.get(site.trait.group)!.name}</p>
          <h2 style={{ fontSize: "2rem", margin: "4px 0 12px" }}>{site.trait.name}</h2>
          <p style={{ marginBottom: 20 }}>{site.trait.about}</p>
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 22px", marginBottom: 24 }}>
            <dt className="muted">Gene</dt><dd>{site.trait.gene}</dd>
            <dt className="muted">Position</dt><dd className="mono">chr{l.chr}:{l.pos.toLocaleString("en-US")}</dd>
            <dt className="muted">Marker</dt><dd className="mono">{site.rsid}</dd>
            <dt className="muted">Letters seen</dt><dd className="mono">{l.alleles.join(" or ")}</dd>
            <dt className="muted">{r.sample ? "Sample" : "Yours"}</dt><dd>{hidden ? "Hidden" : g ? <strong className="mono dna">{g}</strong> : <span className="muted">{r.snps ? "Not in this file" : "No file open"}</span>}</dd>
          </dl>
          {het && <div className="geno" role="group" aria-label="Copy shown" style={{ marginBottom: 24, marginTop: 0 }}>{[0, 1].map((k) => <button key={k} aria-pressed={copy === k} onClick={() => setShown({ rsid: site.rsid, k })} aria-label={`Show the copy with ${g![k]}`}>{g![k]}</button>)}</div>}
          <div className="row"><Link className="btn fill" href={`/traits/${site.trait.id}`}>Marker details</Link>{!r.snps && <Link className="btn" href="/demo?next=/explore">Sample report</Link>}</div>
        </aside>
      </div>
      <p className="small muted" style={{ marginTop: 20 }}>Sequence from GRCh37, plus strand on top. The marker is yellow for the reference letter and green for the other letter. Each sphere is one atom. Hydrogen is left out. Real DNA bends more than this straight model.</p>
    </div>
  );
}
