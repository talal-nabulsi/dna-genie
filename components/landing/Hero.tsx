"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import hero from "@/lib/genome/hero.json";
import Smear from "./Smear";

const Helix3D = dynamic(() => import("@/components/Helix3D"), { ssr: false });

/** The sample carries A here on both copies. The reference letter is G. */
const SEQ = hero.seq.slice(0, hero.index) + "A" + hero.seq.slice(hero.index + 1);

const LEVELS = [
  { name: "Blood", bar: "20 µm", width: 15, text: "A blood smear. Rose red cells carry oxygen and hold no DNA. Drag to move the slide." },
  { name: "Cell", bar: "5 µm", width: 14.5, text: "A white cell. The violet nucleus is where its DNA is kept." },
  { name: "DNA", bar: "3.4 nm, one turn", width: 47.7, text: "The real sequence of chromosome 1 around MTHFR. Drag to turn it." },
];

export default function Hero({ markers }: { markers: number }) {
  const [level, setLevel] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const still = useReducedMotion() ?? false;
  const go = (n: number) => { if (n === 2) setLoaded(true); setLevel(n); };
  const l = LEVELS[level];

  return (
    <section className="hero">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>Read your DNA beside your blood test.</h1>
          <p className="lede">DNA shows what you inherited. Blood shows what is happening now. Open a 23andMe or AncestryDNA file to read {markers} well-studied markers, and add a blood test if you have one.</p>
          <div className="row">
            <Link className="btn fill" href="/demo">Open the sample report</Link>
            <Link className="btn" href="/upload">Read my file</Link>
          </div>
        </div>

        <figure className="scope">
          <div className="field-of-view" data-level={level}>
            <Smear level={level} still={still} />
            <div className="nucleus" data-on={level === 2}>
              {loaded && <Helix3D seq={SEQ} focus={hero.index} mode="quiet" tone="dark" across={22} fov={26} tilt={0.5} />}
            </div>
            <div className="scalebar" style={{ width: `${l.width}%` }} data-dark={level === 2}><span>{l.bar}</span></div>
          </div>
          <div className="turret" role="group" aria-label="Magnification">
            {LEVELS.map((x, i) => <button key={x.name} aria-pressed={i === level} onClick={() => go(i)}>{x.name}</button>)}
          </div>
          <figcaption aria-live="polite">{l.text} <span className="muted">Drawn, not photographed.</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
