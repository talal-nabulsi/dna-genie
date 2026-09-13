"use client";

import { StudyReference } from "@/lib/traits/types";
import { BookOpen, ExternalLink } from "lucide-react";

export default function StudyCitations({ studies }: { studies: StudyReference[] }) {
  if (studies.length === 0) return null;
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-[var(--color-neon)]" />
        <h3 className="font-semibold">Scientific references</h3>
        <span className="text-xs text-[var(--color-muted)] tabular-nums">({studies.length})</span>
      </div>
      <ol className="space-y-3">
        {studies.map((study, i) => (
          <li key={study.pmid} className="flex gap-3 text-sm">
            <span className="font-mono text-xs text-[var(--color-muted)] pt-0.5 w-4 shrink-0">{i + 1}</span>
            <div>
              <p className="text-[var(--color-foreground)]/85 leading-snug">{study.title}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)] mt-1">
                <span>
                  <em>{study.journal}</em>, {study.year}
                </span>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-neon)] hover:underline font-mono"
                >
                  PMID {study.pmid} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
