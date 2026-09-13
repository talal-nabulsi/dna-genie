"use client";

import { Upload, Orbit } from "lucide-react";
import Link from "next/link";

export default function UploadCTABanner() {
  return (
    <div className="glass-card p-8 sm:p-10 mb-10 relative overflow-hidden noise">
      <div className="absolute inset-0 surface-grid opacity-60" />
      <div className="absolute -top-20 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(143,124,255,0.16),transparent_60%)]" />
      <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <p className="eyebrow mb-2">Nothing here yet</p>
          <h2 className="text-2xl sm:text-3xl font-semibold">Upload your raw DNA file to unlock 40 traits</h2>
          <p className="text-[var(--color-muted)] mt-2 max-w-lg">
            23andMe or AncestryDNA exports work. Parsing happens in this tab; only 44 trait-relevant genotypes are saved to your account.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-2">
          <Link href="/upload" className="btn-neon">
            <Upload className="w-4 h-4" /> Upload DNA file
          </Link>
          <Link href="/explore" className="btn-neon-outline">
            <Orbit className="w-4 h-4" /> Explore the helix
          </Link>
        </div>
      </div>
    </div>
  );
}
