"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Karyogram, { SITES } from "@/components/Karyogram";
import { LOCI, normalizeGenotype } from "@/lib/traits/interpret";
import { GROUPS, GROUP_BY_ID } from "@/lib/traits/groups";
import { useReport } from "@/lib/session/useReport";

const Helix3D = dynamic(() => import("@/components/Helix3D"), { ssr: false });
const COMP: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };

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
  const seq = l.flank.slice(0, 30) + letter + l.flank.slice(31);

  const select = (rsid: string) => {
    router.replace(`/explore?site=${rsid}`, { scroll: false });
    if (window.innerWidth < 900) panel.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="wrap">
      <div className="ptitle">
        <div><h1>Genome map</h1><p className="muted measure" style={{ marginTop: 12 }}>Chromosomes 1 to 22 and X, to scale, with their stained bands. Choose a position to see the sequence around it.</p></div>
        <label className="field" style={{ minWidth: 220 }}><span>Show</span><select className="input" value={group} onChange={(e) => setGroup(e.target.value)}><option value="">Every position</option>{GROUPS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      </div>

      <Karyogram selected={site.rsid} onSelect={(s) => select(s.rsid)} dim={(s) => !!group && s.trait.group !== group} />

      <div ref={panel} className="two" style={{ marginTop: 36, scrollMarginTop: 90 }}>
        <div style={{ minWidth: 0 }}>
          <div className="map3d"><Helix3D key={site.rsid + letter} seq={seq} focus={30} mode="bases" across={17} fov={28} /></div>
          <div className="seq" aria-label="Sequence" tabIndex={0}>
            <div><span className="dna">5′ </span>{[...seq].map((b, i) => (i === 30 ? <mark key={i}>{b}</mark> : <span key={i} className={`b-${b}`}>{b}</span>))}<span className="dna"> 3′</span></div>
            <div><span className="blood">3′ </span>{[...seq].map((b, i) => (i === 30 ? <mark key={i}>{COMP[b]}</mark> : <span key={i} className={`b-${COMP[b]}`}>{COMP[b]}</span>))}<span className="blood"> 5′</span></div>
          </div>
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
            <dt className="muted">{r.sample ? "Sample" : "Yours"}</dt><dd>{hidden ? "Hidden until you choose to see it" : g ? <strong className="mono dna">{g}</strong> : <span className="muted">{r.snps ? "Not in this file" : "No file open"}</span>}</dd>
          </dl>
          {het && <div className="geno" role="group" aria-label="Copy shown" style={{ marginBottom: 24, marginTop: 0 }}>{[0, 1].map((k) => <button key={k} aria-pressed={copy === k} onClick={() => setShown({ rsid: site.rsid, k })} aria-label={`Show the copy with ${g![k]}`}>{g![k]}</button>)}</div>}
          <div className="row"><Link className="btn fill" href={`/traits/${site.trait.id}`}>Read this marker</Link>{!r.snps && <Link className="btn" href="/demo?next=/explore">Use the sample</Link>}</div>
        </aside>
      </div>
      <p className="small muted" style={{ marginTop: 20 }}>61 letters from GRCh37, plus strand on top. Wide blocks are A and G, narrow blocks are C and T. Dots are hydrogen bonds.</p>
    </div>
  );
}
