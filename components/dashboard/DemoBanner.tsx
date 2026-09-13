"use client";

import Link from "next/link";
import { FlaskConical, Upload, LogIn } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";

/** Shown to demo visitors: explains what they're looking at and how to bring their own data. */
export default function DemoBanner() {
  const { usingLocalFile, localFormat, clearLocalGenome, exitDemo } = useDemo();
  const fmt = localFormat === "23andme" ? "23andMe" : localFormat === "ancestrydna" ? "AncestryDNA" : "your";

  return (
    <div className="glass-card p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 border-[rgba(57,255,20,0.25)]">
      <span className="w-10 h-10 rounded-xl bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.25)] flex items-center justify-center shrink-0">
        <FlaskConical className="w-5 h-5 text-[var(--color-neon)]" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">
          {usingLocalFile ? `Reading ${fmt} file from this tab only` : "You're exploring a sample genome"}
        </p>
        <p className="text-sm text-[var(--color-muted)] mt-0.5">
          {usingLocalFile
            ? "Results live in session storage and disappear when you close the tab. Sign in to keep them."
            : "These genotypes are synthetic. Parse your own export locally, or sign in to save results to an account."}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        {usingLocalFile ? (
          <button onClick={clearLocalGenome} className="btn-neon-outline !text-sm !py-2.5">
            Back to sample
          </button>
        ) : (
          <Link href="/upload" className="btn-neon-outline !text-sm !py-2.5">
            <Upload className="w-4 h-4" /> Parse my file
          </Link>
        )}
        <Link href="/auth" onClick={exitDemo} className="btn-neon !text-sm !py-2.5">
          <LogIn className="w-4 h-4" /> Sign in
        </Link>
      </div>
    </div>
  );
}
