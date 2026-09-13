"use client";

import Link from "next/link";

export function HelixMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="helix-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#b9ff9c" />
          <stop offset="0.5" stopColor="#39ff14" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path d="M9 3c0 8 14 10 14 18s-14 10-14 8" stroke="url(#helix-grad)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M23 3c0 8-14 10-14 18s14 10 14 8" stroke="url(#helix-grad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
      <path d="M11.5 8.5h9M10 16h12M11.5 23.5h9" stroke="url(#helix-grad)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="DNA Genie home">
      <span className="relative">
        <HelixMark />
        <span className="absolute inset-0 blur-md bg-[var(--color-neon)] opacity-0 group-hover:opacity-40 transition-opacity rounded-full" />
      </span>
      {!compact && <span className="text-lg font-bold tracking-tight">DNA Genie</span>}
    </Link>
  );
}
