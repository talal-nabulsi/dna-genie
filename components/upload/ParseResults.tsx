"use client";

import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";

interface ParseResultsProps {
  snpCount: number;
  format: string;
  saved: boolean;
}

export default function ParseResults({ snpCount, format, saved }: ParseResultsProps) {
  const formatLabel = format === "23andme" ? "23andMe" : "AncestryDNA";

  return (
    <div className="glass-card p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-neon)]/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[var(--color-neon)]" />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">DNA File Processed!</h3>
      <p className="text-[var(--color-muted)] mb-6">
        Found <span className="text-[var(--color-neon)] font-semibold">{snpCount}</span> trait-relevant SNPs
        from your {formatLabel} file.
        {saved && " Results saved to your account."}
      </p>

      <Link href="/dashboard">
        <NeonButton>
          View Your Traits
          <ArrowRight className="inline w-4 h-4 ml-2" />
        </NeonButton>
      </Link>
    </div>
  );
}
