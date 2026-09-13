"use client";

import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";

interface ParseResultsProps {
  snpCount: number;
  format: string;
  saved: boolean;
  onReset?: () => void;
}

export default function ParseResults({ snpCount, format, saved, onReset }: ParseResultsProps) {
  const formatLabel = format === "23andme" ? "23andMe" : "AncestryDNA";

  return (
    <div className="glass-card p-8 text-center relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle,rgba(143,124,255,0.14),transparent_60%)]" />
      <div className="relative">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[rgba(143,124,255,0.1)] border border-[rgba(143,124,255,0.3)] flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[var(--color-neon)]" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">File processed</h3>
        <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
          Found <span className="text-[var(--color-neon)] font-semibold tabular-nums">{snpCount}</span> trait-relevant markers in your {formatLabel} file.{" "}
          {saved ? "Saved to your account." : "Kept in this tab only."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/dashboard" className="btn-neon">
            View your traits <ArrowRight className="w-4 h-4" />
          </Link>
          {onReset && (
            <button onClick={onReset} className="btn-neon-outline">
              <RotateCcw className="w-4 h-4" /> Parse another file
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
