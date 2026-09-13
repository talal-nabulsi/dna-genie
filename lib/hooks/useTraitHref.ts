"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";

/** Deep-links to a trait page; visitors without an account are routed through demo mode first. */
export function useTraitHref() {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  return useCallback(
    (traitId: string) => (user || isDemo ? `/traits/${traitId}` : `/demo?next=/traits/${traitId}`),
    [user, isDemo]
  );
}
