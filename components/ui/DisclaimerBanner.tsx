"use client";

import { AlertTriangle } from "lucide-react";

interface DisclaimerBannerProps {
  text: string;
}

export default function DisclaimerBanner({ text }: DisclaimerBannerProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
      <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
      <p className="text-sm text-yellow-200/80 leading-relaxed">{text}</p>
    </div>
  );
}
