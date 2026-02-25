"use client";

import { Upload, Dna } from "lucide-react";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";

export default function UploadCTABanner() {
  return (
    <div className="glass-card p-8 mb-10 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-neon)] opacity-5 rounded-full blur-[80px]" />

      <div className="relative z-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-neon)]/10 flex items-center justify-center animate-pulse-glow">
            <Dna className="w-8 h-8 text-[var(--color-neon)]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Upload Your DNA File</h2>
        <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
          Upload your 23andMe or AncestryDNA raw data to unlock all your genetic traits.
          Processing happens entirely in your browser.
        </p>

        <Link href="/upload">
          <NeonButton>
            <Upload className="inline w-4 h-4 mr-2" />
            Upload DNA File
          </NeonButton>
        </Link>
      </div>
    </div>
  );
}
