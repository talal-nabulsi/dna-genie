import { Suspense } from "react";
import type { Metadata } from "next";
import GenomeMap from "./GenomeMap";

export const metadata: Metadata = { title: "Genome map", description: "The positions DNA Genie reads, on chromosomes drawn to scale, with an atom model of the DNA around each one." };

export default function Page() {
  return <Suspense fallback={null}><GenomeMap /></Suspense>;
}
