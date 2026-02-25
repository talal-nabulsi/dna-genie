import { ALL_REQUIRED_RSIDS } from "@/lib/traits/traitDatabase";

/**
 * Parse a single line from AncestryDNA raw data format.
 * Format: rsid \t chromosome \t position \t allele1 \t allele2
 * Example: rs4680	22	19951271	A	G
 */
export function parseAncestryDnaLine(
  line: string,
  targetRSIDs: Set<string>
): { rsid: string; genotype: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const parts = trimmed.split("\t");
  if (parts.length < 5) return null;

  const rsid = parts[0].toLowerCase();
  const allele1 = parts[3].toUpperCase();
  const allele2 = parts[4].toUpperCase();

  if (!rsid.startsWith("rs")) return null;
  if (!targetRSIDs.has(rsid)) return null;
  if (allele1 === "0" || allele2 === "0") return null;

  const genotype = allele1 + allele2;
  return { rsid, genotype };
}

/**
 * Detect if the file is AncestryDNA format based on header lines.
 */
export function isAncestryDnaFormat(headerLines: string[]): boolean {
  for (const line of headerLines) {
    if (line.toLowerCase().includes("ancestrydna")) return true;
    // Check for 5-column tab format with rsid
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) continue;
    const parts = trimmed.split("\t");
    if (
      parts.length === 5 &&
      parts[0].startsWith("rs") &&
      parts[3].length === 1 &&
      parts[4].length === 1
    ) {
      return true;
    }
  }
  return false;
}
