import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import Example from "@/components/landing/Example";
import Karyogram from "@/components/Karyogram";
import Bonds from "@/components/Bonds";
import { ALL_RSIDS, TRAITS } from "@/lib/traits/panel";
import { GROUPS } from "@/lib/traits/groups";
import { BIOMARKERS } from "@/lib/labs/biomarkers";
import { buildInsights, PAIRED_TRAITS } from "@/lib/insights/pairs";
import { judge } from "@/lib/labs/panel";
import { readAll } from "@/lib/traits/interpret";
import { SAMPLE_GENOME, SAMPLE_PANEL } from "@/lib/demo/sample";
import { longDate } from "@/lib/date";

export default function Home() {
  const printed = BIOMARKERS.length;
  const judged = judge(SAMPLE_PANEL);
  const sample = buildInsights(readAll(new Map(SAMPLE_GENOME)).filter((r) => !r.trait.sensitive), judged);
  return (
    <>
      <Header />
      <main id="main">
        <Hero markers={TRAITS.length} />

        <section className="section deep" id="example">
          <div className="wrap">
            <div className="head">
              <h2 className="h2">A marker means more next to a measurement.</h2>
              <p className="measure">{PAIRED_TRAITS.size} of the markers have a blood test that shows whether the tendency is happening. Change the letters and the value. The wording below comes from the same rules your report uses.</p>
            </div>
            <Example />
          </div>
        </section>

        <section className="section" id="markers">
          <div className="wrap">
            <div className="head">
              <h2 className="h2">{ALL_RSIDS.size} positions, drawn where they sit.</h2>
              <p className="measure">Your file lists about 600,000 positions. These are the ones read here, on chromosomes drawn to scale with their stained bands. <Link className="link" href="/explore">Open the genome map</Link> to see the sequence around each one.</p>
            </div>
          </div>
          <div className="wrap"><Karyogram /></div>
          <div className="wrap" style={{ marginTop: 36 }}>
            <div className="tblwrap">
              <table className="tbl" style={{ background: "none" }}>
                <thead><tr><th scope="col">Part of the report</th><th scope="col">Markers</th><th scope="col">What it covers</th></tr></thead>
                <tbody>
                  {GROUPS.map((g) => (
                    <tr key={g.id}>
                      <th scope="row">{g.name}</th>
                      <td className="num">{TRAITS.filter((t) => t.group === g.id).length}</td>
                      <td className="muted">{TRAITS.filter((t) => t.group === g.id).map((t) => t.name).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section sheet">
          <div className="wrap two">
            <div>
              <h2 className="h2" style={{ marginBottom: 22 }}>How sure we are is part of every result.</h2>
              <p className="measure">A pairs with T through two hydrogen bonds, and G pairs with C through three. We use the same marks for evidence. Every citation is pulled from PubMed, and every result says what it cannot tell you.</p>
              <p className="measure" style={{ marginTop: 14 }}>In this version we checked the whole panel again. Markers that did not hold up were removed, and results that were wrong were corrected.</p>
            </div>
            <dl style={{ display: "grid", gap: 18 }}>
              <div><dt><Bonds n={3} label={false} /> <strong style={{ marginLeft: 8 }}>Well established</strong></dt><dd className="muted">The mechanism is known, or the effect is large and seen again and again.</dd></div>
              <div><dt><Bonds n={2} label={false} /> <strong style={{ marginLeft: 8 }}>Replicated</strong></dt><dd className="muted">Seen in more than one study. The size is small or varies.</dd></div>
              <div><dt><Bonds n={1} label={false} /> <strong style={{ marginLeft: 8 }}>Early or mixed</strong></dt><dd className="muted">Interesting, and not a basis for any decision.</dd></div>
            </dl>
          </div>
        </section>

        <section className="section" id="privacy">
          <div className="wrap">
            <div className="head">
              <h2 className="h2">Both files are read on your device.</h2>
              <p className="measure">There is nowhere on our side to upload a raw file to. There are no analytics or ads on this site.</p>
            </div>
            <div className="tblwrap">
              <table className="tbl" style={{ background: "none", minWidth: 640 }}>
                <thead><tr><th scope="col" /><th scope="col" className="dna">DNA file</th><th scope="col" className="blood">Blood test, optional</th></tr></thead>
                <tbody>
                  <tr><th scope="row">What you open</th><td>23andMe or AncestryDNA raw data, .txt, .csv or .zip</td><td>A lab report as PDF or CSV, or values you type in</td></tr>
                  <tr><th scope="row">What is read</th><td>{ALL_RSIDS.size} positions. The rest is skipped.</td><td>Up to {printed} common tests. You check every value before it is used.</td></tr>
                  <tr><th scope="row">Without an account</th><td>Stays in this browser tab and goes when you close it</td><td>Stays in this browser tab and goes when you close it</td></tr>
                  <tr><th scope="row">With an account</th><td>The {ALL_RSIDS.size} genotypes are saved so you can come back. Delete them any time.</td><td>Saved only if you tick the box. Delete it any time.</td></tr>
                  <tr><th scope="row">Never sent</th><td>The raw file, or any other position in it</td><td>The report itself, your name, or anything else printed on it</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section sheet">
          <div className="wrap two" style={{ alignItems: "center" }}>
            <div>
              <h2 className="h2" style={{ maxWidth: "14ch", marginBottom: 22 }}>Bring a short summary to your next appointment.</h2>
              <p className="measure" style={{ marginBottom: 26 }}>The visit summary puts what stood out, the numbers behind it and the questions to ask, ready to print. Try it with the sample before you use your own data.</p>
              <div className="row"><Link className="btn fill" href="/demo?next=/summary">See a sample summary</Link><Link className="btn" href="/upload">Read my file</Link></div>
            </div>
            <div className="paper" aria-label="Part of the sample visit summary">
              <h3>Visit summary</h3>
              <p className="muted">Sample. Blood drawn {longDate(SAMPLE_PANEL.date)}.</p>
              <h4>Questions to ask</h4>
              <ul>{sample.filter((x) => x.ask).slice(0, 3).map((x) => <li key={x.traitId}><i /> <span>{x.ask}</span></li>)}</ul>
              <h4>Values outside their range</h4>
              {judged.filter((x) => x.status !== "in").slice(0, 4).map((x) => <div className="r" key={x.id}><span>{x.marker.name}</span><span className="num">{x.value} {x.marker.unit} <span className="flag">{x.status === "high" ? "High" : "Low"}</span></span></div>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
