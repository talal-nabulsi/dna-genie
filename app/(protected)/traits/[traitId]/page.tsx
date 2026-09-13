"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useUserSNPs } from "@/lib/hooks/useUserSNPs";
import { useTraitResults } from "@/lib/hooks/useTraitResults";
import { TRAIT_BY_ID } from "@/lib/traits/traitDatabase";
import TraitDetailView from "@/components/traits/TraitDetailView";

function Empty({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="max-w-xl mx-auto text-center py-24">
      <h1 className="text-2xl font-bold mb-3">{title}</h1>
      <p className="text-[var(--color-muted)] mb-6">{body}</p>
      <Link href={href} className="btn-neon-outline">
        <ArrowLeft className="w-4 h-4" /> {cta}
      </Link>
    </div>
  );
}

export default function TraitDetailPage() {
  const params = useParams();
  const traitId = params.traitId as string;
  const { snps, loading } = useUserSNPs();
  const { results } = useTraitResults(snps);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="h-4 w-24 skeleton rounded mb-8" />
        <div className="h-10 w-2/3 skeleton rounded-lg mb-3" />
        <div className="h-5 w-1/2 skeleton rounded mb-10" />
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div className="space-y-6"><div className="h-52 skeleton rounded-2xl" /><div className="h-40 skeleton rounded-2xl" /></div>
          <div className="h-56 skeleton rounded-2xl" />
        </div>
      </div>
    );
  }

  const trait = TRAIT_BY_ID.get(traitId);
  if (!trait) {
    return <Empty title="Trait not found" body={`“${traitId}” isn't in the trait panel.`} href="/dashboard" cta="Back to dashboard" />;
  }

  const result = results.find((r) => r.trait.id === traitId);
  if (!result) {
    return <Empty title={trait.name} body="No genotype for this marker in the current file. Upload a DNA export to see your result." href="/upload" cta="Upload DNA file" />;
  }

  return <TraitDetailView result={result} />;
}
