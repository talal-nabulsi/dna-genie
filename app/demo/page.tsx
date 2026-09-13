"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemo } from "@/contexts/DemoContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function DemoRedirect() {
  const router = useRouter();
  const params = useSearchParams();
  const { enterDemo } = useDemo();

  useEffect(() => {
    enterDemo();
    const next = params.get("next");
    router.replace(next && next.startsWith("/") ? next : "/dashboard");
  }, [enterDemo, router, params]);

  return null;
}

/** Entry point for the sample-genome walkthrough. Flags demo mode, then lands on the dashboard. */
export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-background)]">
      <Suspense fallback={null}>
        <DemoRedirect />
      </Suspense>
      <LoadingSpinner size="lg" />
      <p className="text-sm text-[var(--color-muted)]">Loading the sample genome…</p>
    </div>
  );
}
