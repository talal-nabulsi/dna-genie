"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSNPs } from "@/lib/firebase/firestore";

export function useUserSNPs() {
  const { user } = useAuth();
  const [snps, setSNPs] = useState<Map<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSNPs(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchSNPs() {
      try {
        setLoading(true);
        const data = await getUserSNPs(user!.uid);
        if (!cancelled) {
          setSNPs(data);
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
    }

    fetchSNPs();
    return () => { cancelled = true; };
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserSNPs(user.uid);
      setSNPs(data);
      setError(null);
    } catch (err) {
      setError("Failed to reload your genetic data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { snps, loading, error, refetch };
}
