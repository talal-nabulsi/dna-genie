"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { update } from "@/lib/session/store";

const ALLOWED = /^\/(dashboard|summary|explore|blood|traits\/[a-z0-9-]+)$/;

function Go() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  useEffect(() => {
    update({ demo: true, genome: null, labs: null, opened: [] });
    router.replace(next && ALLOWED.test(next) ? next : "/dashboard");
  }, [router, next]);
  return <main id="main" className="wrap" style={{ padding: "20vh 0" }}><p>Opening the sample report</p></main>;
}

export default function DemoPage() {
  return <Suspense fallback={null}><Go /></Suspense>;
}
