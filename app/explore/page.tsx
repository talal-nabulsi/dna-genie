import { Suspense } from "react";
import type { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore the genome",
  description: "An interactive 3D DNA helix with every trait marker DNA Genie reads. Orbit, filter, and fly into any SNP.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreClient />
    </Suspense>
  );
}
