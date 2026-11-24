"use client";

import bands from "@/lib/genome/bands.json";
import { LOCI } from "@/lib/traits/interpret";
import { TRAITS } from "@/lib/traits/panel";
import type { Trait } from "@/lib/traits/types";

const B = bands as unknown as Record<string, [number, number, string, string][]>;
const CHR = [...Array.from({ length: 22 }, (_, i) => String(i + 1)), "X"];
const STAIN: Record<string, string> = { gneg: "#fff6f9", gpos25: "#e6d3ee", gpos50: "#c2a0d8", gpos75: "#8f5fb5", gpos100: "#56288a", gvar: "#f3dbe6", stalk: "#f3dbe6" };
const W = 1240, TOP = 14, H = 330, BAR = 22, STEP = W / CHR.length;
const MAX = B["1"][B["1"].length - 1][1];
const y = (bp: number) => TOP + (bp / MAX) * H;

export interface Site { rsid: string; trait: Trait; chr: string; pos: number }
export const SITES: Site[] = TRAITS.flatMap((t) => t.rsids.map((rsid) => ({ rsid, trait: t, chr: LOCI[rsid].chr, pos: LOCI[rsid].pos })));

/** Keeps markers that sit close together on one chromosome readable. */
function spread(sites: Site[]) {
  const s = [...sites].sort((a, b) => a.pos - b.pos).map((x) => ({ ...x, ly: y(x.pos) }));
  for (let i = 1; i < s.length; i++) if (s[i].ly - s[i - 1].ly < 11) s[i].ly = s[i - 1].ly + 11;
  return s;
}

export default function Karyogram({ selected, onSelect, dim }: { selected?: string | null; onSelect?: (s: Site) => void; dim?: (s: Site) => boolean }) {
  return (
    <div className="kary" tabIndex={0} role="region" aria-label="Chromosomes with the positions read from your file">
      <svg viewBox={`0 0 ${W} ${TOP + H + 34}`} role="group">
        {CHR.map((c, i) => {
          const cx = STEP * i + STEP / 2 - 10, rows = B[c], end = y(rows[rows.length - 1][1]);
          const cen = rows.filter((r) => r[3] === "acen");
          const c0 = y(cen[0][0]), c1 = y(cen[cen.length - 1][1]), cm = y(cen[0][1]);
          const l = cx - BAR / 2, r = cx + BAR / 2, k = 4;
          const shape = `M${l} ${TOP + 7} Q${l} ${TOP} ${cx} ${TOP} Q${r} ${TOP} ${r} ${TOP + 7} L${r} ${c0} L${cx + k} ${cm} L${r} ${c1} L${r} ${end - 7} Q${r} ${end} ${cx} ${end} Q${l} ${end} ${l} ${end - 7} L${l} ${c1} L${cx - k} ${cm} L${l} ${c0} Z`;
          return (
            <g key={c}>
              <clipPath id={`k${c}`}><path d={shape} /></clipPath>
              <g clipPath={`url(#k${c})`}>
                {rows.map((b) => <rect key={b[2]} x={l} width={BAR} y={y(b[0])} height={y(b[1]) - y(b[0]) + 0.4} fill={b[3] === "acen" ? "#e58aa9" : STAIN[b[3]] ?? "#fff"} />)}
              </g>
              <path d={shape} fill="none" stroke="#56288a" strokeWidth="1" />
              <text x={cx} y={TOP + H + 26} textAnchor="middle" fontSize="15" fill="var(--ink-2)" style={{ fontFamily: "var(--mono)" }}>{c}</text>
              {spread(SITES.filter((s) => s.chr === c)).map((s) => {
                const on = selected === s.rsid, faded = dim?.(s);
                const body = (
                  <>
                    <path d={`M${l - 1} ${y(s.pos)} H${r + 3} L${r + 9} ${s.ly}`} fill="none" stroke="var(--ink)" strokeWidth={on ? 2.6 : 1.6} />
                    <circle className="ring" cx={r + 13} cy={s.ly} r={on ? 7 : 4.8} fill={on ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeWidth="2" />
                  </>
                );
                if (!onSelect) return <g key={s.rsid} opacity={faded ? 0.2 : 1}><title>{`${s.trait.gene}, chr${c}:${s.pos.toLocaleString("en-US")}`}</title>{body}</g>;
                return (
                  <g key={s.rsid} className="hit" role="button" tabIndex={0} opacity={faded ? 0.2 : 1} aria-pressed={on}
                    aria-label={`${s.trait.name}, ${s.trait.gene}, chromosome ${c}`} onClick={() => onSelect(s)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(s); } }}>
                    <title>{`${s.trait.gene}: ${s.trait.name}`}</title>
                    <rect x={l - 4} y={s.ly - 11} width={BAR + 26} height="22" fill="transparent" />
                    {body}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
