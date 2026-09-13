"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/** Lets signed-in users and demo visitors through; everyone else goes to /auth. */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isDemo, ready } = useDemo();
  const router = useRouter();

  const settled = !loading && ready;
  const allowed = !!user || isDemo;

  useEffect(() => {
    if (settled && !allowed) router.push("/auth");
  }, [settled, allowed, router]);

  if (!settled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
