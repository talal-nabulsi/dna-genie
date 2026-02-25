"use client";

import { useState } from "react";
import { StudyReference } from "@/lib/traits/types";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface StudyCitationsProps {
  studies: StudyReference[];
}

export default function StudyCitations({ studies }: StudyCitationsProps) {
  const [expanded, setExpanded] = useState(false);

  if (studies.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--color-neon)]" />
          <h3 className="text-lg font-semibold">
            Scientific References ({studies.length})
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[var(--color-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--color-muted)]" />
        )}
      </button>

      {expanded && (
        <ul className="mt-4 space-y-3">
          {studies.map((study) => (
            <li key={study.pmid} className="text-sm">
              <p className="text-[var(--color-foreground)]/80 mb-1">
                {study.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                <span>{study.journal}, {study.year}</span>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[var(--color-neon)] hover:underline"
                >
                  PMID: {study.pmid}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
