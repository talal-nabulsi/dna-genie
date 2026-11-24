import { parseReportCsv, parseReportText, type ParsedReport } from "./parse";

type Item = { str: string; transform: number[]; width: number };

/** Rebuilds printed rows from positioned PDF text. Everything runs in this tab. */
export async function pdfToText(data: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const task = pdfjs.getDocument({ data, isEvalSupported: false });
  const doc = await task.promise;
  const lines: string[] = [];
  for (let p = 1; p <= Math.min(doc.numPages, 40); p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const rows: { y: number; items: Item[] }[] = [];
    for (const it of content.items as Item[]) {
      if (!it.str?.trim()) continue;
      const y = it.transform[5];
      const row = rows.find((r) => Math.abs(r.y - y) < 3);
      if (row) row.items.push(it); else rows.push({ y, items: [it] });
    }
    rows.sort((a, b) => b.y - a.y);
    for (const r of rows) lines.push(r.items.sort((a, b) => a.transform[4] - b.transform[4]).map((i) => i.str).join(" "));
  }
  await task.destroy();
  return lines.join("\n");
}

export async function readLabFile(file: File): Promise<ParsedReport> {
  if (file.size > 25 * 1024 * 1024) throw new Error("That file is over 25 MB. Export only the results pages and try again.");
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf") || file.type === "application/pdf") {
    let text: string;
    try { text = await pdfToText(new Uint8Array(await file.arrayBuffer())); }
    catch (e) {
      if ((e as { name?: string }).name === "PasswordException") throw new Error("That PDF is locked with a password. Save an unlocked copy and try again.");
      throw new Error("That PDF could not be opened. Download it again from your lab, or type the values in.");
    }
    if (text.replace(/\s/g, "").length < 40) throw new Error("That PDF is a scan, so there is no text to read. Type the values in below.");
    return parseReportText(text);
  }
  if (/\.(csv|tsv|txt)$/.test(lower)) return parseReportCsv(await file.text());
  throw new Error("Choose a PDF or CSV. Photos cannot be read, but you can type the values in below.");
}
