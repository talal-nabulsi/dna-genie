import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Stage from "@/components/landing/Stage";
import Example from "@/components/landing/Example";
import Bonds from "@/components/Bonds";
import { ALL_RSIDS } from "@/lib/traits/panel";
import { BIOMARKERS } from "@/lib/labs/biomarkers";
import { PAIRED_TRAITS } from "@/lib/insights/pairs";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Stage />

        <section className="section" id="blood">
          <div className="wrap">
            <div className="head">
              <h2>Blood tests</h2>
              <p className="measure">Optional. {PAIRED_TRAITS.size} markers can be compared with a blood test. Change the letters or the value in this example. The text comes from the same rules as the report.</p>
            </div>
            <Example />
          </div>
        </section>

        <section className="section" id="evidence">
          <div className="wrap">
            <div className="head">
              <h2>Evidence ratings</h2>
              <p className="measure">Each marker has a rating and a list of sources on PubMed.</p>
            </div>
            <div className="tblwrap">
              <table className="tbl">
                <tbody>
                  <tr><td className="fit"><Bonds n={3} label={false} /></td><th scope="row">Well established</th><td>Known mechanism, or a large effect found in many studies.</td></tr>
                  <tr><td className="fit"><Bonds n={2} label={false} /></td><th scope="row">Replicated</th><td>Found in more than one study. The effect is small or varies.</td></tr>
                  <tr><td className="fit"><Bonds n={1} label={false} /></td><th scope="row">Early or mixed</th><td>Few studies, or studies that disagree. Not a basis for decisions.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section" id="privacy">
          <div className="wrap">
            <div className="head">
              <h2>Privacy</h2>
              <p className="measure">Files are read in your browser. The raw files are never uploaded. There are no ads or analytics.</p>
            </div>
            <div className="tblwrap">
              <table className="tbl" style={{ minWidth: 640 }}>
                <thead><tr><th scope="col"><span className="sr">Topic</span></th><th scope="col">DNA file</th><th scope="col">Blood test</th></tr></thead>
                <tbody>
                  <tr><th scope="row">File types</th><td>23andMe or AncestryDNA raw data: .txt, .csv, .zip</td><td>PDF or CSV lab report, or typed values</td></tr>
                  <tr><th scope="row">Read</th><td>{ALL_RSIDS.size} positions</td><td>Up to {BIOMARKERS.length} tests, which you check before they are used</td></tr>
                  <tr><th scope="row">Without an account</th><td>Kept in this tab until you close it</td><td>Kept in this tab until you close it</td></tr>
                  <tr><th scope="row">With an account</th><td>The {ALL_RSIDS.size} genotypes are saved. You can delete them.</td><td>Saved only if you tick the box. You can delete it.</td></tr>
                  <tr><th scope="row">Never sent</th><td>The raw file and all other positions</td><td>The lab report, your name and other details on it</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="section" id="summary">
          <div className="wrap">
            <div className="head">
              <h2>Visit summary</h2>
              <div>
                <p className="measure" style={{ marginBottom: 20 }}>A printable page for a medical appointment. It lists out-of-range values, related genotypes and questions to ask.</p>
                <div className="row"><Link className="btn" href="/demo?next=/summary">Sample summary</Link></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
