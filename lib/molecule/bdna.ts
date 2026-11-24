import coords from "./arnott.json";

/**
 * Builds B-DNA atom by atom from the fiber diffraction model of Arnott and colleagues
 * (heavy atoms, cylindrical coordinates, 36 degrees and 3.38 angstroms per base pair).
 * Values taken from the table in AmberClassic's fd_helix.
 */
export const RISE = 3.38;
export const TWIST = Math.PI / 5;

export type Base = "A" | "C" | "G" | "T";
export const COMP: Record<Base, Base> = { A: "T", T: "A", C: "G", G: "C" };

type Row = [string, number, number, number];
const TABLE = coords as unknown as Record<"backbone" | Base, Row[]>;
const RADIUS: Record<string, number> = { P: 1.95, O: 1.5, N: 1.58, C: 1.74 };

/** Palette slots used by the renderer. */
export const SLOT = { strand1: 0, strand2: 1, A: 2, C: 3, G: 4, T: 5 } as const;

export interface Atom {
  name: string;
  x: number; y: number; z: number;
  radius: number;
  slot: number;
  /** Base pair index from the 5' end of strand 1. */
  pair: number;
  strand: 0 | 1;
  backbone: boolean;
  /** Shown only when the alternate letter is on (1), only when it is off (-1), or always (0). */
  when: -1 | 0 | 1;
}

/** The helix axis is x, and strand 1 runs 5' to 3' toward positive x. */
function place(row: Row, pair: number, strand: 0 | 1): [number, number, number] {
  const sign = strand ? -1 : 1;
  const phi = sign * (row[2] * Math.PI) / 180 - pair * TWIST;
  const zf = sign * row[3] - pair * RISE;
  return [-zf, row[1] * Math.cos(phi), -row[1] * Math.sin(phi)];
}

function nucleotide(base: Base, pair: number, strand: 0 | 1, part: "backbone" | "base", when: Atom["when"]): Atom[] {
  return TABLE[part === "backbone" ? "backbone" : base].map((row) => {
    const [x, y, z] = place(row, pair, strand);
    return { name: row[0], x, y, z, radius: RADIUS[row[0][0]], slot: part === "backbone" ? strand : SLOT[base], pair, strand, backbone: part === "backbone", when };
  });
}

/** `alt` replaces the pair at `focus` when the renderer asks for it. */
export function buildAtoms(seq: string, focus = -1, alt?: string): Atom[] {
  const out: Atom[] = [];
  [...seq].forEach((ch, i) => {
    const b = ch as Base, swap = i === focus && alt && alt !== b ? (alt as Base) : undefined;
    for (const strand of [0, 1] as const) {
      const mine = strand ? COMP[b] : b;
      out.push(...nucleotide(mine, i, strand, "backbone", 0), ...nucleotide(mine, i, strand, "base", swap ? -1 : 0));
      if (swap) out.push(...nucleotide(strand ? COMP[swap] : swap, i, strand, "base", 1));
    }
  });
  return out;
}
