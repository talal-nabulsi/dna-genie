"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/layout/Logo";

const GenomeExplorer = dynamic(() => import("@/components/three/GenomeExplorer"), {
  ssr: false,
  loading: () => <div className="glass-card flex-1 skeleton opacity-40" />,
});

export default function ExploreClient() {
  const params = useSearchParams();
  const trait = params.get("trait");

  return (
    <div className="h-[100dvh] flex flex-col bg-[var(--color-background)]">
      <header className="h-14 shrink-0 px-4 sm:px-6 flex items-center justify-between border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="hidden sm:inline text-sm text-[var(--color-muted)]">Genome explorer</span>
        </div>
        <Link href="/" className="btn-ghost !text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>
      <div className="flex-1 min-h-0 p-3 sm:p-4 flex">
        <GenomeExplorer initialTraitId={trait} className="flex-1 min-h-0" />
      </div>
    </div>
  );
}
