import Link from "next/link";
import { Github } from "lucide-react";
import { HelixMark } from "./Logo";

const GITHUB_URL = "https://github.com/talal-nabulsi/dna-genie";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Explore the helix", href: "/explore" },
      { label: "Demo genome", href: "/demo" },
      { label: "Upload your DNA", href: "/auth" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Source on GitHub", href: GITHUB_URL, external: true },
      { label: "23andMe raw data", href: "https://you.23andme.com/tools/data/download/", external: true },
      { label: "AncestryDNA raw data", href: "https://www.ancestry.com/dna/settings", external: true },
      { label: "PubMed", href: "https://pubmed.ncbi.nlm.nih.gov/", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-glass-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <HelixMark className="w-6 h-6" />
            <span className="font-semibold tracking-tight">DNA Genie</span>
          </div>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            Privacy-first genetic trait discovery. Your raw file is parsed in the browser and never uploaded; only 44 trait-relevant genotypes are ever stored.
          </p>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-5 text-sm text-[var(--color-muted-strong)] hover:text-[var(--color-foreground)] transition-colors">
            <Github className="w-4 h-4" /> talal-nabulsi/dna-genie
          </a>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow !text-[11px] mb-4">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                      {l.label} ↗
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-glass-border)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} DNA Genie · Built by Talal Nabulsi</p>
          <p>For education, not diagnosis. Talk to a clinician before acting on any result.</p>
        </div>
      </div>
    </footer>
  );
}
