import Link from "next/link";
import { Mark } from "./Brand";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="in">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}><Mark /> DNA Genie</div>
            <p className="measure" style={{ maxWidth: "40ch" }}>DNA Genie is for learning. It does not diagnose and does not replace medical care.</p>
          </div>
          <ul>
            <li><Link href="/demo">Sample report</Link></li>
            <li><Link href="/upload">Open a DNA file</Link></li>
            <li><Link href="/blood">Add a blood test</Link></li>
            <li><Link href="/explore">Genome map</Link></li>
          </ul>
          <ul>
            <li><a href="https://github.com/talal-nabulsi/dna-genie" target="_blank" rel="noopener noreferrer">Source code</a></li>
            <li><a href="https://www.genome.gov/" target="_blank" rel="noopener noreferrer">National Human Genome Research Institute</a></li>
            <li><a href="https://findageneticcounselor.nsgc.org/" target="_blank" rel="noopener noreferrer">Find a genetic counselor</a></li>
            <li><a href="https://medlineplus.gov/lab-tests/" target="_blank" rel="noopener noreferrer">MedlinePlus: lab tests</a></li>
          </ul>
        </div>
        <p className="fine">Positions: GRCh37. Sequence: Ensembl. Chromosome bands: UCSC. Citations: PubMed. Atom positions: the fiber diffraction model of B-DNA by Arnott and colleagues. Built by Talal Nabulsi.</p>
      </div>
    </footer>
  );
}
