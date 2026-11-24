import { describe, expect, it } from "vitest";
import { buildAtoms, RISE, TWIST, type Atom } from "@/lib/molecule/bdna";

const atoms = buildAtoms("ACGTACGT");
const get = (pair: number, strand: 0 | 1, name: string) => atoms.find((a) => a.pair === pair && a.strand === strand && a.name === name)!;
const d = (a: Atom, b: Atom) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

describe("B-DNA geometry", () => {
  it("links each sugar to the next phosphate on both strands", () => {
    for (let i = 0; i < 7; i++) {
      expect(d(get(i, 0, "O3'"), get(i + 1, 0, "P"))).toBeCloseTo(1.6, 1);
      expect(d(get(i + 1, 1, "O3'"), get(i, 1, "P"))).toBeCloseTo(1.6, 1);
    }
  });
  it("joins every base to its sugar", () => {
    for (let i = 0; i < 8; i++) for (const s of [0, 1] as const) {
      const purine = "AG".includes((s ? "TGCA" : "ACGT")[i % 4]);
      const len = d(get(i, s, "C1'"), get(i, s, purine ? "N9" : "N1"));
      expect(len).toBeGreaterThan(1.4); expect(len).toBeLessThan(1.6);
    }
  });
  it("puts Watson-Crick hydrogen bonds at about 2.9 angstroms", () => {
    for (const len of [d(get(0, 0, "N1"), get(0, 1, "N3")), d(get(0, 0, "N6"), get(0, 1, "O4")), d(get(2, 0, "N1"), get(2, 1, "N3")), d(get(2, 0, "O6"), get(2, 1, "N4")), d(get(2, 0, "N2"), get(2, 1, "O2"))]) {
      expect(len).toBeGreaterThan(2.6); expect(len).toBeLessThan(3.2);
    }
  });
  it("is right-handed with ten pairs a turn", () => {
    const a = get(0, 0, "P"), b = get(1, 0, "P");
    expect(b.x - a.x).toBeCloseTo(RISE, 5);
    const turn = Math.atan2(a.y * b.z - a.z * b.y, a.y * b.y + a.z * b.z);
    expect(turn).toBeCloseTo(TWIST, 5);
    expect((2 * Math.PI) / TWIST).toBeCloseTo(10, 8);
  });
  it("adds the other letter at the marker without changing the backbone", () => {
    const x = buildAtoms("ACGTA", 2, "A");
    expect(x.filter((a) => a.when === 1).every((a) => a.pair === 2 && !a.backbone)).toBe(true);
    expect(x.filter((a) => a.when === -1)).toHaveLength(11 + 8);
    expect(x.filter((a) => a.when === 1)).toHaveLength(10 + 9);
  });
});
