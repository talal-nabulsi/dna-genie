"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import hero from "@/lib/genome/hero.json";

const Helix3D = dynamic(() => import("@/components/Helix3D"), { ssr: false });

/** The sample carries A here on both copies. The reference letter is G. */
const SEQ = hero.seq.slice(0, hero.index) + "A" + hero.seq.slice(hero.index + 1);

export default function Hero({ markers }: { markers: number }) {
  return (
    <section className="hero">
      <div className="wrap hero-top">
        <h1>Read your DNA beside your blood test.</h1>
        <div>
          <p className="lede">DNA shows what you inherited. Blood shows what is happening now. Open your 23andMe or AncestryDNA file to read {markers} well-studied markers, then add a blood test if you have one.</p>
          <div className="row" style={{ marginTop: 24 }}>
            <Link className="btn fill" href="/demo">Open the sample report</Link>
            <Link className="btn" href="/upload">Read my file</Link>
          </div>
        </div>
      </div>
      <div className="stage">
        <Helix3D seq={SEQ} focus={hero.index} mode="quiet" across={34} at={0.6} fov={24} />
        <div className="lead dna top"><div><b>MTHFR, two C677T copies</b>chr1:11,856,378</div></div>
        <div className="lead blood bottom"><div><b>Homocysteine 11.2 µmol/L</b>in range on this sample</div></div>
      </div>
      <div className="wrap">
        <div className="ruler"><span>This is the real sequence of chromosome 1 around the lit pair. Drag to turn it.</span></div>
      </div>
    </section>
  );
}
