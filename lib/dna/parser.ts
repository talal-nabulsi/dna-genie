"use client";

import { DNAFormat, ParseResult, ProgressCallback } from "./types";
import { ALL_REQUIRED_RSIDS } from "@/lib/traits/traitDatabase";
import { is23andMeFormat, parse23andMeLine } from "./parsers/twentyThreeAndMe";
import { isAncestryDnaFormat, parseAncestryDnaLine } from "./parsers/ancestryDna";

const CHUNK_SIZE = 10_000;

function detectFormat(headerLines: string[]): DNAFormat {
  if (is23andMeFormat(headerLines)) return "23andme";
  if (isAncestryDnaFormat(headerLines)) return "ancestrydna";
  return "unknown";
}

function parseLine(
  line: string,
  format: DNAFormat,
  targetRSIDs: Set<string>
): { rsid: string; genotype: string } | null {
  switch (format) {
    case "23andme":
      return parse23andMeLine(line, targetRSIDs);
    case "ancestrydna":
      return parseAncestryDnaLine(line, targetRSIDs);
    default:
      return null;
  }
}

function yieldToUI(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function parseDNAFile(
  file: File,
  onProgress?: ProgressCallback
): Promise<ParseResult> {
  const text = await file.text();
  const lines = text.split("\n");
  const totalLines = lines.length;

  // Detect format from first 30 lines
  const headerLines = lines.slice(0, 30);
  const format = detectFormat(headerLines);

  onProgress?.({
    stage: "detecting",
    linesProcessed: 0,
    totalLines,
    snpsFound: 0,
    format,
  });

  if (format === "unknown") {
    onProgress?.({
      stage: "error",
      linesProcessed: 0,
      totalLines,
      snpsFound: 0,
      format,
      errorMessage:
        "Unrecognized file format. Please upload a 23andMe or AncestryDNA raw data file (.txt or .csv).",
    });
    throw new Error("Unrecognized DNA file format");
  }

  const snps = new Map<string, string>();
  let linesProcessed = 0;

  // Process in chunks with UI yielding
  for (let i = 0; i < totalLines; i += CHUNK_SIZE) {
    const chunkEnd = Math.min(i + CHUNK_SIZE, totalLines);

    for (let j = i; j < chunkEnd; j++) {
      const result = parseLine(lines[j], format, ALL_REQUIRED_RSIDS);
      if (result) {
        snps.set(result.rsid, result.genotype);
      }
      linesProcessed++;
    }

    onProgress?.({
      stage: "parsing",
      linesProcessed,
      totalLines,
      snpsFound: snps.size,
      format,
    });

    // Yield to keep UI responsive
    await yieldToUI();
  }

  onProgress?.({
    stage: "complete",
    linesProcessed: totalLines,
    totalLines,
    snpsFound: snps.size,
    format,
  });

  return {
    snps,
    format,
    totalLinesProcessed: totalLines,
    snpsFound: snps.size,
  };
}
