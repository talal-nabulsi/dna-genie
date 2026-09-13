"use client";

import { FileText, Cpu, Database, Lock, Github, Eye } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { GITHUB_URL } from "./LandingNav";

const FLOW = [
  { icon: FileText, title: "Your raw file", meta: "≈600,000 rows · 20 MB", body: "Stays on disk. Read once by the browser with the File API.", tone: "muted" },
  { icon: Cpu, title: "In-browser parser", meta: "44 rsIDs kept", body: "Streams line by line, keeps only the markers in the trait panel, discards the rest in memory.", tone: "neon" },
  { icon: Database, title: "Your account", meta: "44 genotypes · < 1 KB", body: "Only if you sign in. Firestore rules scope every document to your own user ID.", tone: "muted" },
];

const GUARANTEES = [
  { icon: Lock, title: "Nothing to leak", body: "There is no upload endpoint. The raw file never becomes a network request, so there's no server log, bucket, or backup holding it." },
  { icon: Eye, title: "Demo without an account", body: "Try the sample genome, or parse your own file in demo mode — results live in session storage and vanish when you close the tab." },
  { icon: Github, title: "Open source", body: "The parser, the trait database, and the Firestore rules are all public. Read exactly what runs." },
];

export default function PrivacySection() {
  return (
    <section id="privacy" className="py-24 sm:py-32 px-5 sm:px-8 scroll-mt-16 relative">
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-2xl mb-14">
          <p className="eyebrow mb-3">Privacy by architecture</p>
          <h2 className="text-3xl sm:text-5xl font-semibold">0.007% of your file. That&apos;s the whole footprint.</h2>
          <p className="mt-4 text-[var(--color-muted)] text-lg">
            Most consumer genetics tools ask you to upload the entire file. DNA Genie was designed so it can&apos;t.
          </p>
        </Reveal>

        <Reveal>
          <div className="glass-card p-2 sm:p-3 mb-6">
            <div className="grid md:grid-cols-3 gap-2 sm:gap-3">
              {FLOW.map((f, i) => (
                <div key={f.title} className={`relative rounded-2xl p-5 sm:p-6 ${f.tone === "neon" ? "bg-[rgba(143,124,255,0.06)] border border-[rgba(143,124,255,0.25)]" : "bg-white/[0.025] border border-[var(--color-glass-border)]"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <f.icon className={`w-5 h-5 ${f.tone === "neon" ? "text-[var(--color-neon)]" : "text-[var(--color-muted-strong)]"}`} />
                    <span className="font-mono text-[11px] text-[var(--color-muted)]">{f.meta}</span>
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">{f.body}</p>
                  {i < FLOW.length - 1 && (
                    <span className="hidden md:flex absolute top-1/2 -right-[14px] -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-background-elevated)] border border-[var(--color-glass-border)] items-center justify-center text-[var(--color-muted)] text-xs z-10">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4">
          {GUARANTEES.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08}>
              <div className="p-6 h-full rounded-2xl border border-[var(--color-glass-border)]">
                <g.icon className="w-5 h-5 text-[var(--color-neon)] mb-4" />
                <h3 className="font-semibold mb-1.5">{g.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{g.body}</p>
                {g.title === "Open source" && (
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-[var(--color-neon)] hover:underline mt-3">
                    talal-nabulsi/dna-genie ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
