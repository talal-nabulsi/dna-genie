"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { getUserSNPs } from "@/lib/firebase/firestore";

/**
 * Resolves the SNP map to interpret. Signed-in users read from Firestore;
 * demo visitors use the sample genome (or a file they parsed locally this session).
 */
export function useUserSNPs() {
  const { user } = useAuth();
  const { isDemo, ready, demoSNPs } = useDemo();
  const [remote, setRemote] = useState<Map<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRemote = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserSNPs(user.uid);
      setRemote(data);
      setError(null);
    } catch (err) {
      setError("Failed to load your genetic data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (user) {
      let cancelled = false;
      (async () => {
        setLoading(true);
        try {
          const data = await getUserSNPs(user.uid);
          if (!cancelled) {
            setRemote(data);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) {
            setError("Failed to load your genetic data");
            console.error(err);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    setRemote(null);
    setLoading(false);
  }, [user, ready]);

  const snps = user ? remote : isDemo ? demoSNPs : null;

  return { snps, loading: loading || !ready, error, refetch: fetchRemote };
}
