/**
 * Parse a single line from 23andMe raw data format.
 * Format: rsid \t chromosome \t position \t genotype
 * Example: rs4680	22	19951271	AG
 */
export function parse23andMeLine(
  line: string,
  targetRSIDs: Set<string>
): { rsid: string; genotype: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const parts = trimmed.split("\t");
  if (parts.length < 4) return null;

  const rsid = parts[0].toLowerCase();
  const genotype = parts[3].toUpperCase();

  if (!rsid.startsWith("rs")) return null;
  if (!targetRSIDs.has(rsid)) return null;
  if (genotype === "--" || genotype === "00" || !genotype) return null;

  return { rsid, genotype };
}

/**
 * Detect if the file is 23andMe format based on header lines.
 */
export function is23andMeFormat(headerLines: string[]): boolean {
  for (const line of headerLines) {
    if (line.includes("23andMe")) return true;
    // Check for 4-column tab format with rsid
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) continue;
    const parts = trimmed.split("\t");
    if (
      parts.length === 4 &&
      parts[0].startsWith("rs") &&
      parts[3].length >= 1 &&
      parts[3].length <= 2
    ) {
      return true;
    }
  }
  return false;
}
