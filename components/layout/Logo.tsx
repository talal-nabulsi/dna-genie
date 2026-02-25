"use client";

import { Dna } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Dna className="w-7 h-7 text-[var(--color-neon)] group-hover:animate-spin-slow transition-transform" />
      <span className="text-xl font-bold neon-gradient-text">DNA Genie</span>
    </Link>
  );
}
