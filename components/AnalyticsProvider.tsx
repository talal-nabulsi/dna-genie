"use client";

import { useEffect } from "react";
import { getFirebaseAnalytics } from "@/lib/firebase/config";

export default function AnalyticsProvider() {
  useEffect(() => {
    getFirebaseAnalytics();
  }, []);

  return null;
}
