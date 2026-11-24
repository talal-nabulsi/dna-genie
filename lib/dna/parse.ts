import { Unzip, UnzipInflate } from "fflate";
import { ALL_RSIDS } from "@/lib/traits/panel";

export type DNAFormat = "23andme" | "ancestrydna";
export const FORMAT_NAME: Record<DNAFormat, string> = { "23andme": "23andMe", ancestrydna: "AncestryDNA" };

export interface ParsedDNA { snps: Map<string, string>; format: DNAFormat; rows: number }
export interface Progress { rows: number; found: number; fraction: number }

/** Line-by-line reader. Holds one partial line in memory, and keeps only the markers in the panel. */
export class DNAReader {
  readonly snps = new Map<string, string>();
  rows = 0;
  format: DNAFormat | null = null;
  private tail = "";
  private seen = 0;

  push(chunk: string) {
    const text = this.tail + chunk;
    const end = text.lastIndexOf("\n");
    if (end < 0) { this.tail = text; return; }
    this.tail = text.slice(end + 1);
    for (const line of text.slice(0, end).split("\n")) this.line(line);
  }

  end() {
    if (this.tail) this.line(this.tail);
    this.tail = "";
  }

  private line(raw: string) {
    const line = raw.trim();
    if (!line) return;
    if (this.seen++ < 60 && !this.format) {
      if (/ancestrydna/i.test(line)) this.format = "ancestrydna";
      else if (/23andme/i.test(line)) this.format = "23andme";
    }
    if (line[0] === "#") return;
    const p = line.split(/[\t,]/).map((x) => x.replace(/"/g, "").trim());
    if (!/^(rs|i)\d+$/i.test(p[0])) return;
    if (!this.format) {
      if (p.length === 5 && p[3].length === 1 && p[4].length === 1) this.format = "ancestrydna";
      else if (p.length === 4 && p[3].length <= 2) this.format = "23andme";
    }
    this.rows++;
    const rsid = p[0].toLowerCase();
    if (!ALL_RSIDS.has(rsid)) return;
    const g = (this.format === "ancestrydna" ? (p[3] ?? "") + (p[4] ?? "") : p[3] ?? "").toUpperCase();
    if (/^[ACGT]{2}$/.test(g)) this.snps.set(rsid, g);
  }
}

const MAX = 120 * 1024 * 1024;

export async function parseDNAFile(file: File, onProgress?: (p: Progress) => void): Promise<ParsedDNA> {
  if (file.size > MAX) throw new Error("That file is larger than any 23andMe or AncestryDNA export. Check that you chose the raw data file.");
  const reader = new DNAReader();
  const decoder = new TextDecoder();
  const input = file.stream().getReader();
  const zipped = file.name.toLowerCase().endsWith(".zip");
  let used = 0, opened = false;

  let unzip: Unzip | null = null;
  if (zipped) {
    unzip = new Unzip((f) => {
      if (opened || !/\.(txt|csv)$/i.test(f.name)) return;
      opened = true;
      let out = 0;
      f.ondata = (err, data, final) => {
        if (err) throw err;
        out += data.length;
        if (out > MAX) { f.terminate(); throw new Error("The zip opens into something too large to be a DNA export."); }
        reader.push(decoder.decode(data, { stream: !final }));
      };
      f.start();
    });
    unzip.register(UnzipInflate);
  }

  try {
    for (;;) {
      const { value, done } = await input.read();
      if (done) break;
      used += value.length;
      if (unzip) unzip.push(value); else reader.push(decoder.decode(value, { stream: true }));
      onProgress?.({ rows: reader.rows, found: reader.snps.size, fraction: used / file.size });
      await new Promise((r) => setTimeout(r));
    }
    unzip?.push(new Uint8Array(0), true);
  } catch (e) {
    throw e instanceof Error && e.message.startsWith("The zip") ? e : new Error("That file could not be opened. Download it again and retry.");
  }
  reader.end();
  if (zipped && !opened) throw new Error("There is no raw data file inside that zip.");
  if (!reader.format || reader.rows < 1) throw new Error("This does not look like a 23andMe or AncestryDNA raw data file. Choose the .txt or .zip you downloaded from them.");
  if (reader.snps.size === 0) throw new Error("The file opened, but none of the markers we read are in it.");
  onProgress?.({ rows: reader.rows, found: reader.snps.size, fraction: 1 });
  return { snps: reader.snps, format: reader.format, rows: reader.rows };
}
