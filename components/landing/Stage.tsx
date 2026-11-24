"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Molecule from "@/components/Molecule";
import { useNarrow, useShort } from "@/components/MoleculeBand";
import { MARKER_SITES, moleculeSite, place } from "@/lib/molecule/sites";
import { GROUPS } from "@/lib/traits/groups";
import { TRAITS } from "@/lib/traits/panel";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import type { Pose } from "@/lib/molecule/engine";

const START = MARKER_SITES.findIndex((s) => s.rsid === "rs1801133");
const CHRS = [...new Set(MARKER_SITES.map((s) => s.chr))].map((chr) => ({ chr, list: MARKER_SITES.map((s, i) => ({ ...s, i })).filter((s) => s.chr === chr) }));

export default function Stage() {
  const [i, setI] = useState(START);
  const [alt, setAlt] = useState(false);
  const [list, setList] = useState(false);
  const narrow = useNarrow(), short = useShort();
  const leader = useRef<HTMLDivElement>(null), note = useRef<HTMLDivElement>(null), rows = useRef<HTMLDivElement>(null), hero = useRef<HTMLElement>(null), strip = useRef<HTMLDivElement>(null);
  const s = MARKER_SITES[i];
  const go = (n: number) => { setI((n + MARKER_SITES.length) % MARKER_SITES.length); setAlt(false); };

  const pose = useMemo<Pose>(() => {
    if (narrow) return { span: 90, angle: -0.03, x: 0, y: -0.02 };
    return list ? { span: 56, angle: -Math.PI / 2 + 0.07, x: 0.235, y: 0 } : short ? { span: 60, angle: -0.04, x: 0.17, y: 0.14 } : { span: 47.5, angle: -0.045, x: 0.17, y: 0.092 };
  }, [list, narrow, short]);

  // The row in the middle of the screen is the one on the molecule.
  useEffect(() => {
    if (narrow || !rows.current) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const n = MARKER_SITES.findIndex((x) => x.rsid === (e.target as HTMLElement).dataset.rsid);
      if (n >= 0) { setI(n); setAlt(false); }
    }), { rootMargin: "-44% 0px -52% 0px" });
    rows.current.querySelectorAll("[data-rsid]").forEach((el) => io.observe(el));
    const top = new IntersectionObserver(([e]) => setList(!e.isIntersecting), { rootMargin: "-38% 0px 0px 0px" });
    if (hero.current) top.observe(hero.current);
    return () => { io.disconnect(); top.disconnect(); };
  }, [narrow]);

  useEffect(() => {
    const box = strip.current, el = box?.querySelector<HTMLElement>("[aria-current]");
    if (box && el) box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2, behavior: "smooth" });
  }, [i]);

  const onFrame = (p: { x: number; y: number; settled: boolean }) => {
    const l = leader.current, n = note.current;
    if (!l || !n) return;
    const top = n.offsetTop + n.offsetHeight + 10;
    l.style.transform = `translate(${p.x}px, ${top}px)`;
    l.style.height = `${Math.max(0, p.y - top - 92)}px`;
    l.style.opacity = p.settled ? "1" : "0";
  };

  return (
    <div className="stage" data-list={list}>
      <div className="stage-fix">
        <Molecule site={moleculeSite(s.rsid)} alt={alt} pose={pose} onFrame={onFrame} label={`Atom model of the DNA around ${s.trait.gene} ${s.rsid}. The marker is yellow for the reference letter and green for the other letter. Drag to turn.`} />
        {!narrow && <div className="leader" ref={leader} aria-hidden="true" />}
        <p className="side-note" aria-hidden="true">{s.trait.gene}<br /><span className="mono">{s.rsid}<br />{place(s)}</span></p>
      </div>

      <div className="stage-over">
        <section className="hero" ref={hero}>
          <div className="hero-copy">
            <h1>DNA Genie reads {TRAITS.length} markers from a 23andMe or AncestryDNA file.</h1>
            <p>You can add blood test results. Both files are read in your browser.</p>
            <div className="row">
              <Link className="btn fill" href="/upload">Open a DNA file</Link>
              <Link className="btn" href="/demo">Sample report</Link>
            </div>
          </div>
          <div className="hero-gap" aria-hidden="true" />
          <div className="note" ref={note}>
            <div className="note-id"><strong>{s.trait.gene}</strong> <span className="mono">{s.rsid}</span> <span className="mono">{place(s)}</span></div>
            <p>{s.trait.about}</p>
            <div className="row">
              {s.alt && <span className="swap" role="group" aria-label="Letter shown on the molecule">
                {[s.ref, s.alt].map((l, k) => <button key={l} className={k ? "t alt" : "t"} aria-pressed={(k === 1) === alt} onClick={() => setAlt(k === 1)}>{l}</button>)}
              </span>}
              <Link className="link" href={`/traits/${s.trait.id}`}>{s.trait.name}</Link>
            </div>
          </div>
          <div className="tiles-row">
            <button className="step" onClick={() => go(i - 1)} aria-label="Previous marker">←</button>
            <div className="tiles" ref={strip} role="group" aria-label="Markers in genome order">
              {CHRS.map((c) => (
                <div key={c.chr} className="chr" style={{ flexGrow: c.list.length }}>
                  <div>{c.list.map((m) => <button key={m.rsid} className={`t t-${m.ref}${m.i === i && alt ? " alt" : ""}`} aria-current={m.i === i ? "true" : undefined} aria-label={`${m.trait.gene}, ${m.rsid}`} title={`${m.trait.gene} ${m.rsid}`} onClick={() => go(m.i)}>{m.i === i && alt && m.alt ? m.alt : m.ref}</button>)}</div>
                  <span aria-hidden="true">{c.chr}</span>
                </div>
              ))}
            </div>
            <button className="step" onClick={() => go(i + 1)} aria-label="Next marker">→</button>
          </div>
        </section>

        <section className="mlist" id="markers" ref={rows}>
          <h2>Markers</h2>
          {GROUPS.map((g) => (
            <div key={g.id} className="mgroup">
              <h3>{g.name}</h3>
              <ul>
                {TRAITS.filter((t) => t.group === g.id).map((t) => {
                  const on = list && s.trait.id === t.id;
                  return (
                    <li key={t.id} data-rsid={t.rsids[0]} data-on={on} onPointerMove={(e) => { if (!narrow && !on && (e.movementX || e.movementY)) { setI(MARKER_SITES.findIndex((x) => x.rsid === t.rsids[0])); setAlt(false); } }}>
                      <Link href={`/traits/${t.id}`}>
                        <span className="gene">{t.gene}</span>
                        <span className="nm">{t.name}</span>
                        <span className="mt">{t.labs?.length ? BIOMARKER_BY_ID.get(t.labs[0])!.name.split(",")[0] : ""}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
