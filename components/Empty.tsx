import Link from "next/link";

export function Loading() {
  return <div className="wrap" style={{ padding: "18vh var(--gutter)" }} role="status">Loading your report</div>;
}

export function Start({ title = "Nothing to show yet" }: { title?: string }) {
  return (
    <div className="wrap">
      <div className="ptitle"><h1>{title}</h1></div>
      <p className="measure" style={{ marginBottom: 24 }}>Open a raw data file from 23andMe or AncestryDNA, add a blood test, or look around with the sample first.</p>
      <div className="row"><Link className="btn fill" href="/upload">Read a DNA file</Link><Link className="btn red" href="/blood">Add a blood test</Link><Link className="btn" href="/demo">Open the sample</Link></div>
    </div>
  );
}
