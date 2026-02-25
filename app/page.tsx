import HeroSection from "@/components/landing/HeroSection";
import TraitPreviewDemo from "@/components/landing/TraitPreviewDemo";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <HeroSection />
      <TraitPreviewDemo />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
