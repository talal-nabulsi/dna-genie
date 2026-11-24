import Link from "next/link";
import { Mark } from "./Brand";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="in">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}><Mark mono /> DNA Genie</div>
            <p className="measure" style={{ maxWidth: "40ch" }}>For learning and for better questions at your next visit. It does not diagnose, and it is not a substitute for care.</p>
          </div>
          <ul>
            <li><Link href="/demo">Open the sample report</Link></li>
            <li><Link href="/upload">Read a DNA file</Link></li>
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
        <p className="fine">Positions are GRCh37. Sequence from Ensembl, bands from UCSC, citations from PubMed. Built by Talal Nabulsi.</p>
      </div>
    </footer>
  );
}
