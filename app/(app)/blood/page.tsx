"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useReport, useSession } from "@/lib/session/useReport";
import { update } from "@/lib/session/store";
import { deleteBloodPanel, saveBloodPanel } from "@/lib/firebase/firestore";
import { readLabFile } from "@/lib/labs/readFile";
import { BIOMARKERS, BIOMARKER_BY_ID, LAB_GROUPS, type BiomarkerId, type Range, type Sex } from "@/lib/labs/biomarkers";
import { formatRange, type LabPanel } from "@/lib/labs/panel";
import { longDate } from "@/lib/date";
import Drop from "@/components/Drop";
import RangeStrip, { StatusWord } from "@/components/RangeStrip";
import Urgent from "@/components/Urgent";
import { Loading } from "@/components/Empty";

interface Row { id: BiomarkerId; value: string; bound?: "<" | ">"; printed?: Range; source?: string; check?: string }
interface Draft { rows: Row[]; date: string; sex: Sex | ""; from: string }

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

export default function BloodPage() {
  const r = useReport();
  const session = useSession();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [keep, setKeep] = useState(false);
  const [add, setAdd] = useState("");

  const used = useMemo(() => new Set(draft?.rows.map((x) => x.id)), [draft]);

  if (r.loading) return <Loading />;

  const onFile = async (file: File) => {
    setErr(""); setBusy(true);
    try {
      const p = await readLabFile(file);
      if (!p.drafts.length) throw new Error("No tests we know were found in that file. You can type the values in below.");
      setDraft({ rows: p.drafts.map((d) => ({ ...d, value: String(d.value) })), date: p.date ?? "", sex: p.sex ?? "", from: file.name });
    } catch (e) { setErr(e instanceof Error ? e.message : "That file could not be read."); }
    finally { setBusy(false); }
  };

  const startTyping = () => { setErr(""); setDraft({ rows: ["ldl", "hdl", "triglycerides", "hba1c", "ferritin", "vitd", "b12", "homocysteine", "bilirubin", "uric", "hscrp"].map((id) => ({ id: id as BiomarkerId, value: "" })), date: "", sex: "", from: "" }); };
  const edit = () => { const p = r.labs!; setDraft({ rows: p.values.map((v) => ({ ...v, value: String(v.value) })), date: p.date, sex: p.sex ?? "", from: "" }); };
  const setRow = (id: BiomarkerId, patch: Partial<Row>) => setDraft((d) => d && { ...d, rows: d.rows.map((x) => (x.id === id ? { ...x, ...patch } : x)) });

  const confirm = async () => {
    if (!draft) return;
    const filled = draft.rows.filter((x) => x.value.trim() !== "");
    const bad = filled.find((x) => !Number.isFinite(Number(x.value)) || Number(x.value) < 0);
    if (bad) return setErr(`${BIOMARKER_BY_ID.get(bad.id)!.name} needs a number.`);
    const odd = filled.find((x) => { const [lo, hi] = BIOMARKER_BY_ID.get(x.id)!.plausible; const n = Number(x.value); return n < lo || n > hi; });
    if (odd) { const b = BIOMARKER_BY_ID.get(odd.id)!; return setErr(`${b.name} of ${odd.value} ${b.unit} is not a possible result. Check the number and the unit, or remove the row.`); }
    if (!filled.length) return setErr("Enter at least one value.");
    if (!draft.date) return setErr("Enter the date the blood was taken.");
    if (draft.date > today()) return setErr("The date is in the future.");
    const panel: LabPanel = { date: draft.date, sex: draft.sex || undefined, values: filled.map((x) => ({ id: x.id, value: Number(x.value), bound: x.bound, printed: x.printed })) };
    update({ labs: panel });
    setErr("");
    if (r.user && keep) {
      try { await saveBloodPanel(r.user.uid, panel); r.refresh(); }
      catch { setErr("The values are in this tab, but could not be saved to your account."); }
    }
    setDraft(null);
    window.scrollTo({ top: 0 });
  };

  const remove = async () => {
    try { if (r.user && r.labsSaved) await deleteBloodPanel(r.user.uid); update({ labs: null }); r.refresh(); }
    catch { setErr("Your saved blood test could not be deleted. Check your connection and try again."); }
  };

  if (draft) {
    const flagged = draft.rows.filter((x) => x.check).length;
    return (
      <div className="wrap">
        <div className="ptitle"><div><h1>{draft.from ? "Check the values" : "Enter your values"}</h1><p className="muted" style={{ marginTop: 12 }}>{draft.from ? `${draft.rows.length} values from ${draft.from}. ${flagged ? `${flagged} marked in red need a closer look.` : ""} Compare each one with your report.` : "Fill in what you have and leave the rest empty."}</p></div></div>
        <div className="box" style={{ marginBottom: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 22 }}>
          <label className="field"><span>Date the blood was taken</span><input className="input" type="date" max={today()} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /></label>
          <label className="field"><span>Sex used for lab ranges, optional</span><select className="input" value={draft.sex} onChange={(e) => setDraft({ ...draft, sex: e.target.value as Sex | "" })}><option value="">Not given</option><option value="female">Female</option><option value="male">Male</option></select></label>
        </div>
        <table className="rev">
          <thead><tr><th scope="col">Test</th><th scope="col" style={{ width: 190 }}>Value</th><th scope="col">Range on your report</th><th scope="col">Read from</th><th scope="col"><span className="sr">Remove</span></th></tr></thead>
          <tbody>
            {draft.rows.map((x) => {
              const b = BIOMARKER_BY_ID.get(x.id)!;
              return (
                <tr key={x.id} data-check={!!x.check}>
                  <td><strong>{b.name}</strong>{x.check && <span className="small blood" style={{ display: "block" }}>{x.check}</span>}</td>
                  <td><label style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="sr">{b.name} value</span>{x.bound && <span>{x.bound}</span>}<input className="input num" inputMode="decimal" style={{ maxWidth: 100 }} value={x.value} onChange={(e) => setRow(x.id, { value: e.target.value, bound: undefined })} /><span className="small muted">{b.unit}</span></label></td>
                  <td className="num">{x.printed ? formatRange(x.printed) : <span className="muted">None found. General range used.</span>}</td>
                  <td className="src">{x.source ?? ""}</td>
                  <td><button className="link small" onClick={() => setDraft({ ...draft, rows: draft.rows.filter((y) => y.id !== x.id) })}>Remove<span className="sr"> {b.name}</span></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="row" style={{ margin: "20px 0 30px" }}>
          <label className="field" style={{ minWidth: 280 }}><span>Add a test</span>
            <select className="input" value={add} onChange={(e) => { const id = e.target.value as BiomarkerId; if (id) setDraft({ ...draft, rows: [...draft.rows, { id, value: "" }] }); setAdd(""); }}>
              <option value="">Choose a test</option>
              {LAB_GROUPS.map((g) => <optgroup key={g} label={g}>{BIOMARKERS.filter((b) => b.group === g && !used.has(b.id)).map((b) => <option key={b.id} value={b.id}>{b.name} ({b.unit})</option>)}</optgroup>)}
            </select>
          </label>
        </div>
        {r.user && <p style={{ marginBottom: 20 }}><label className="check"><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} /> <span>Save these values to my account. Leave this off to keep them in this tab only.</span></label></p>}
        {err && <p className="err" role="alert" style={{ marginBottom: 20 }}>{err}</p>}
        <div className="row"><button className="btn red" onClick={confirm}>Use these values</button><button className="btn" onClick={() => { setDraft(null); setErr(""); }}>Cancel</button></div>
      </div>
    );
  }

  const own = r.labs && !r.labs.sample;
  return (
    <div className="wrap">
      <div className="ptitle">
        <div><h1>Blood test</h1>{r.labs && <p className="muted" style={{ marginTop: 12 }}>{r.labs.values.length} values from {longDate(r.labs.date)}{r.labs.sample ? ", made up for the sample" : r.labsSaved && !session.labs ? ", saved to your account" : ", in this tab"}.</p>}</div>
        {own && <div className="row"><Link className="btn fill" href="/dashboard">Open the report</Link><button className="btn" onClick={edit}>Edit</button></div>}
      </div>

      <Urgent judged={r.judged} date={r.labs ? longDate(r.labs.date) : undefined} />

      <div className="two" style={{ marginBottom: 56 }}>
        <div style={{ display: "grid", gap: 18 }}>
          <Drop accept=".pdf,.csv,.tsv,.txt,application/pdf,text/csv" onFile={onFile} disabled={busy} title={busy ? "Reading" : own ? "Replace with another report" : "Choose your lab report"} hint="PDF from your lab portal, or CSV" />
          {err && <p className="err" role="alert">{err}</p>}
          <p><button className="link" onClick={startTyping}>Type the values in instead</button></p>
          {own && <p className="small"><button className="link" onClick={remove}>{r.labsSaved ? "Delete my saved blood test" : "Remove it from this tab"}</button></p>}
        </div>
        <aside style={{ display: "grid", gap: 24 }}>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Optional</h2><p className="muted">The report works without a blood test.</p></section>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>How the file is handled</h2><p className="muted">The report is read in your browser and is not sent anywhere. Your name and other details on it are ignored. You check every value before it is used.</p></section>
          <section><h2 style={{ fontSize: "1.25rem", marginBottom: 8 }}>Supported files</h2><p className="muted">PDFs downloaded from a lab or patient portal, and CSV files. Scans and photos cannot be read. Type those values in.</p></section>
        </aside>
      </div>

      {r.judged.length > 0 && LAB_GROUPS.map((g) => {
        const list = r.judged.filter((j) => j.marker.group === g);
        if (!list.length) return null;
        return (
          <section className="sect" key={g}>
            <h2 style={{ marginBottom: 14 }}>{g}</h2>
            <div style={{ borderTop: "2px solid var(--ink)" }}>
              {list.map((j) => (
                <div key={j.id} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "4px 40px", padding: "14px 0", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span><strong>{j.marker.name}</strong>{j.derived && <span className="small muted" style={{ display: "block" }}>Calculated from your other values</span>}</span><span style={{ textAlign: "right" }}><strong className="num">{j.bound}{j.value}</strong> <span className="muted">{j.marker.unit}</span> <StatusWord j={j} /></span></div>
                  <div><RangeStrip j={j} />{j.rangeSource === "general" && j.marker.note && <p className="small muted">{j.marker.note}</p>}</div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
