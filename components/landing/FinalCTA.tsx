import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function FinalCTA() {
  return (
    <section className="px-5 sm:px-8 pb-24 sm:pb-32">
      <Reveal>
        <div className="relative max-w-7xl mx-auto glass-card overflow-hidden px-6 py-16 sm:px-16 sm:py-24 text-center noise">
          <div className="absolute inset-0 surface-grid opacity-70" />
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(143,124,255,0.2),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-semibold max-w-2xl mx-auto">Ready to meet your genome?</h2>
            <p className="mt-4 text-[var(--color-muted)] text-lg max-w-xl mx-auto">
              Start with the sample genome — no account, no upload. Bring your own file whenever you&apos;re ready.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/demo" className="btn-neon !text-base !py-3.5 !px-6">
                Explore the demo <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
              <Link href="/auth" className="btn-neon-outline !text-base !py-3.5 !px-6">
                <Upload className="w-[18px] h-[18px]" /> Upload your DNA
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
