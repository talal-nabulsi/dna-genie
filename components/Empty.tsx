import Link from "next/link";

export function Loading() {
  return <div className="wrap" style={{ padding: "18vh var(--gutter)" }} role="status">Loading your report</div>;
}

export function Start({ title = "No report yet" }: { title?: string }) {
  return (
    <div className="wrap">
      <div className="ptitle"><h1>{title}</h1></div>
      <p className="measure" style={{ marginBottom: 24 }}>Open a 23andMe or AncestryDNA raw data file, add a blood test, or view the sample report.</p>
      <div className="row"><Link className="btn fill" href="/upload">Open a DNA file</Link><Link className="btn red" href="/blood">Add a blood test</Link><Link className="btn" href="/demo">Sample report</Link></div>
    </div>
  );
}
