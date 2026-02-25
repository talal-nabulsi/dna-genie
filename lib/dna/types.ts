export type DNAFormat = "23andme" | "ancestrydna" | "unknown";

export interface ParseProgress {
  stage: "detecting" | "parsing" | "complete" | "error";
  linesProcessed: number;
  totalLines: number;
  snpsFound: number;
  format: DNAFormat;
  errorMessage?: string;
}

export type ProgressCallback = (progress: ParseProgress) => void;

export interface ParseResult {
  snps: Map<string, string>;
  format: DNAFormat;
  totalLinesProcessed: number;
  snpsFound: number;
}
