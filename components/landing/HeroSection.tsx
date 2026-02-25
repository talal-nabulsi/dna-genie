"use client";

import { Dna, ArrowRight } from "lucide-react";
import Link from "next/link";
import NeonButton from "@/components/ui/NeonButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-neon)] opacity-5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500 opacity-5 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Dna className="w-20 h-20 text-[var(--color-neon)] animate-float" />
            <div className="absolute inset-0 w-20 h-20 bg-[var(--color-neon)] opacity-20 blur-xl rounded-full" />
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
          Decode Your{" "}
          <span className="neon-gradient-text">DNA</span>
        </h1>

        <p className="text-lg sm:text-xl text-[var(--color-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
          Upload your 23andMe or AncestryDNA file and discover 40+ genetic traits.
          100% client-side — your DNA never touches a server.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth">
            <NeonButton className="text-lg px-8 py-4">
              Get Started
              <ArrowRight className="inline w-5 h-5 ml-2" />
            </NeonButton>
          </Link>
          <Link href="#features">
            <NeonButton variant="outline" className="text-lg px-8 py-4">
              Learn More
            </NeonButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
