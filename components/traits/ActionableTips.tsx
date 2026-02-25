"use client";

import { CheckCircle } from "lucide-react";

interface ActionableTipsProps {
  tips: string[];
}

export default function ActionableTips({ tips }: ActionableTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Actionable Tips</h3>
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-[var(--color-neon)] shrink-0 mt-0.5" />
            <span className="text-sm text-[var(--color-foreground)]/80 leading-relaxed">
              {tip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
