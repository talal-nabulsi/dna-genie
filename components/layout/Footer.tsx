"use client";

import { Dna } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-glass-border)] py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-[var(--color-neon)]" />
          <span>DNA Genie</span>
        </div>
        <p>Your DNA never leaves your browser. Only trait-relevant SNPs are stored.</p>
      </div>
    </footer>
  );
}
