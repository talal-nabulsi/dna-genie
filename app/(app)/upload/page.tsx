"use client";

import { useState } from "react";
import Link from "next/link";
import { useReport, useSession } from "@/lib/session/useReport";
import { update } from "@/lib/session/store";
import { deleteSNPResults, saveSNPResults } from "@/lib/firebase/firestore";
import { FORMAT_NAME, parseDNAFile, type ParsedDNA, type Progress } from "@/lib/dna/parse";
import { ALL_RSIDS } from "@/lib/traits/panel";
import Drop from "@/components/Drop";

export default function UploadPage() {
  const r = useReport();
  const session = useSession();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [done, setDone] = useState<ParsedDNA | null>(null);
  const [err, setErr] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File) => {
    setErr(""); setSaveErr(""); setDone(null); setBusy(true); setProgress({ rows: 0, found: 0, fraction: 0 });
    try {
      const parsed = await parseDNAFile(file, setProgress);
      update({ genome: { entries: [...parsed.snps], format: parsed.format }, demo: false, opened: [] });
      setDone(parsed);
      if (r.user) {
        try { await saveSNPResults(r.user.uid, parsed.snps, parsed.format); r.refresh(); }
        catch { setSaveErr("Your file was read, but the genotypes could not be saved to your account. They are still in this tab."); }
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "That file could not be read."); }
    finally { setBusy(false); setProgress(null); }
  };

  const remove = async () => {
    try { if (r.user && r.dnaSaved) await deleteSNPResults(r.user.uid); update({ genome: null, opened: [] }); setDone(null); r.refresh(); }
    catch { setErr("Your saved genotypes could not be deleted. Check your connection and try again."); }
  };

  return (
    <div className="wrap">
      <div className="ptitle"><h1>DNA file</h1></div>
      <div className="two">
        <div style={{ display: "grid", gap: 20 }}>
          {done ? (
            <div className="box" style={{ borderLeft: "6px solid var(--dna)" }} role="status">
              <h2 style={{ fontSize: "1.6rem", marginBottom: 8 }}>{done.snps.size} of {ALL_RSIDS.size} positions found</h2>
              <p className="measure" style={{ marginBottom: 20 }}>Read {done.rows.toLocaleString("en-US")} rows of a {FORMAT_NAME[done.format]} file. {r.user && !saveErr ? "The genotypes are saved to your account." : "They stay in this tab."}</p>
              <div className="row"><Link className="btn fill" href="/dashboard">Open the report</Link><Link className="btn red" href="/blood">Add a blood test</Link></div>
            </div>
          ) : (
            <Drop accept=".txt,.csv,.zip,text/plain,text/csv,application/zip" onFile={onFile} disabled={busy} title="Choose your raw data file" hint="23andMe or AncestryDNA, as .txt, .csv or .zip" />
          )}
          {progress && <div role="status"><div className="meter"><div style={{ width: `${progress.fraction * 100}%` }} /></div><p className="small muted num" style={{ marginTop: 8 }}>{progress.rows.toLocaleString("en-US")} rows read, {progress.found} positions found</p></div>}
          {err && <p className="err" role="alert">{err}</p>}
          {saveErr && <p className="err" role="alert">{saveErr}</p>}
          {!r.loading && (session.genome || r.dnaSaved) && (
            <p className="small"><button className="link" onClick={remove}>{r.dnaSaved ? "Delete my saved genotypes" : "Remove this file from the tab"}</button></p>
          )}
        </div>
        <aside style={{ display: "grid", gap: 26 }}>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>What happens to it</h2><p className="muted">The file is read here, in your browser. {ALL_RSIDS.size} positions are kept and the rest are skipped. {r.user ? "Because you are signed in, those genotypes are saved to your account." : "Without an account, nothing is saved or sent."}</p></section>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Where to get it</h2>
            <ul className="muted" style={{ display: "grid", gap: 8 }}>
              <li><a className="link" href="https://you.23andme.com/tools/data/download/" target="_blank" rel="noopener noreferrer">23andMe: download raw data</a></li>
              <li><a className="link" href="https://www.ancestry.com/dna/settings" target="_blank" rel="noopener noreferrer">AncestryDNA: settings, then download</a></li>
            </ul>
          </section>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Before you open it</h2><p className="muted">DNA is shared with relatives, so a result can say something about them too. These arrays can misread single positions. Confirm anything that matters with a clinical test.</p></section>
        </aside>
      </div>
    </div>
  );
}
