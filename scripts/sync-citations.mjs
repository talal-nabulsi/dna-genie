// Pulls title, journal and year from PubMed for every PMID in the panel, so the text shown next to a
// citation can never drift from the paper it links to. Run: npm run sync:citations
import { readFileSync, writeFileSync } from "node:fs";
const src = readFileSync("lib/traits/panel.ts", "utf8");
const ids = [...new Set([...src.matchAll(/pmids: \[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"(\d+)"/g)].map((x) => x[1])))];
const res = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`);
const { result } = await res.json();
const out = {};
for (const id of ids) {
  const x = result[id];
  if (!x || x.error) throw new Error(`PubMed has no record for ${id}`);
  const text = x.title.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\.$/, "");
  out[id] = { title: text, journal: x.source, year: Number(x.pubdate.slice(0, 4)) };
}
writeFileSync("lib/traits/citations.json", JSON.stringify(out, null, 1) + "\n");
console.log(`${ids.length} citations`);
