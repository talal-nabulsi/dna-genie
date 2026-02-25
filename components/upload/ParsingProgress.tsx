"use client";

import { ParseProgress as ParseProgressType } from "@/lib/dna/types";
import { Dna, CheckCircle, AlertCircle, Search } from "lucide-react";

interface ParsingProgressProps {
  progress: ParseProgressType;
}

export default function ParsingProgress({ progress }: ParsingProgressProps) {
  const percentage =
    progress.totalLines > 0
      ? Math.round((progress.linesProcessed / progress.totalLines) * 100)
      : 0;

  const formatLabel =
    progress.format === "23andme"
      ? "23andMe"
      : progress.format === "ancestrydna"
        ? "AncestryDNA"
        : "Unknown";

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-6">
        {progress.stage === "error" ? (
          <AlertCircle className="w-6 h-6 text-red-400" />
        ) : progress.stage === "complete" ? (
          <CheckCircle className="w-6 h-6 text-[var(--color-neon)]" />
        ) : progress.stage === "detecting" ? (
          <Search className="w-6 h-6 text-[var(--color-neon)] animate-pulse" />
        ) : (
          <Dna className="w-6 h-6 text-[var(--color-neon)] animate-spin-slow" />
        )}

        <div>
          <h3 className="font-semibold">
            {progress.stage === "detecting" && "Detecting file format..."}
            {progress.stage === "parsing" && `Parsing ${formatLabel} file...`}
            {progress.stage === "complete" && "Parsing complete!"}
            {progress.stage === "error" && "Error parsing file"}
          </h3>
          {progress.stage !== "error" && progress.format !== "unknown" && (
            <p className="text-sm text-[var(--color-muted)]">
              Format: {formatLabel}
            </p>
          )}
        </div>
      </div>

      {progress.stage === "error" ? (
        <p className="text-sm text-red-400 bg-red-400/10 p-4 rounded-xl">
          {progress.errorMessage}
        </p>
      ) : (
        <>
          {/* Progress bar */}
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
            <div
              className="h-full progress-bar-fill rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-[var(--color-muted)]">
            <span>
              {progress.linesProcessed.toLocaleString()} / {progress.totalLines.toLocaleString()} lines
            </span>
            <span className="text-[var(--color-neon)] font-medium">
              {progress.snpsFound} trait SNPs found
            </span>
          </div>
        </>
      )}
    </div>
  );
}
