import { describe, expect, it } from "vitest";
import { TRAITS, TRAIT_BY_ID } from "@/lib/traits/panel";
import { LOCI, normalizeGenotype, readAll, readTrait } from "@/lib/traits/interpret";
import { GROUP_BY_ID } from "@/lib/traits/groups";
import citations from "@/lib/traits/citations.json";
import { BIOMARKER_BY_ID } from "@/lib/labs/biomarkers";
import { SAMPLE_GENOME } from "@/lib/demo/sample";

const read = (id: string, g: Record<string, string>) => readTrait(TRAIT_BY_ID.get(id)!, new Map(Object.entries(g)))?.reading;

describe("panel", () => {
  it.each(TRAITS.map((t) => [t.id, t] as const))("%s is complete", (_, t) => {
    expect(GROUP_BY_ID.has(t.group)).toBe(true);
    for (const rs of t.rsids) expect(LOCI[rs], rs).toBeDefined();
    for (const p of t.pmids) expect((citations as Record<string, unknown>)[p], p).toBeDefined();
    expect(t.pmids.length + (t.dois?.length ?? 0)).toBeGreaterThan(0);
    for (const l of t.labs ?? []) expect(BIOMARKER_BY_ID.has(l), l).toBe(true);
    if (t.table) {
      const [a, b] = LOCI[t.rsids[0]].alleles;
      const want = [a + a, a + b, b + b].map((g) => [...g].sort().join("")).sort();
      expect(Object.keys(t.table).sort()).toEqual(want);
    } else expect(t.outcomes?.length).toBeGreaterThan(1);
  });

  it("reads every sample marker", () => {
    expect(readAll(new Map(SAMPLE_GENOME))).toHaveLength(TRAITS.length);
  });
});

describe("strand handling", () => {
  it("sorts", () => expect(normalizeGenotype("rs4988235", "GA")).toBe("AG"));
  it("flips the other strand", () => expect(normalizeGenotype("rs4988235", "CT")).toBe("AG"));
  it("leaves palindromic sites alone", () => expect(normalizeGenotype("rs1799945", "GG")).toBe("GG"));
  it("rejects no-calls and indels", () => {
    for (const g of ["--", "00", "II", "DI", "A", ""]) expect(normalizeGenotype("rs4988235", g)).toBeUndefined();
  });
});

describe("multi-marker results", () => {
  it.each([
    ["TT", "CC", "ε3/ε3"], ["CT", "CC", "ε3/ε4"], ["CC", "CC", "ε4/ε4"], ["TT", "CT", "ε2/ε3"], ["TT", "TT", "ε2/ε2"], ["CT", "CT", "ε2/ε4"],
  ])("APOE %s %s", (a, b, want) => expect(read("apoe", { rs429358: a, rs7412: b })?.genotype).toBe(want));
  it("APOE needs both markers", () => expect(read("apoe", { rs429358: "CC" })).toBeUndefined());
  it("TAS2R38 het is medium", () => expect(read("bitter-taste", { rs713598: "CG", rs1726866: "AG", rs10246939: "CT" })?.genotype).toBe("PAV/AVI"));
  it("TAS2R38 taster", () => expect(read("bitter-taste", { rs713598: "GG", rs1726866: "GG", rs10246939: "CC" })?.genotype).toBe("PAV/PAV"));
  it("HFE compound", () => expect(read("hfe", { rs1800562: "AG", rs1799945: "CG" })?.genotype).toBe("C282Y/H63D"));
  it("MTHFR TT", () => expect(read("mthfr", { rs1801133: "AA", rs1801131: "TT" })?.genotype).toBe("677 TT"));
});

describe("directions that were wrong before", () => {
  it("FOXO3 G is the long-lived version", () => expect(read("foxo3-longevity", { rs2802292: "TT" })?.label).toBe("Common result"));
  it("GC G lowers vitamin D", () => expect(read("vitamin-d", { rs2282679: "GG" })?.tone).toBe("notable"));
  it("KL-VS is G", () => expect(read("klotho-aging", { rs9536314: "TT" })?.label).toBe("No KL-VS copies"));
  it("lactase is read on the plus strand", () => expect(read("lactose-tolerance", { rs4988235: "AA" })?.label).toBe("Lactase persists"));
});
