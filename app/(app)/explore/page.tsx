import { Suspense } from "react";
import type { Metadata } from "next";
import GenomeMap from "./GenomeMap";

export const metadata: Metadata = { title: "Genome map", description: "Every position DNA Genie reads, on chromosomes drawn to scale, with the real sequence around each one in 3D." };

export default function Page() {
  return <Suspense fallback={null}><GenomeMap /></Suspense>;
}
