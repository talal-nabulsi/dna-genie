import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import GeneMarquee from "@/components/landing/GeneMarquee";
import ExploreSection from "@/components/landing/ExploreSection";
import HowItWorks from "@/components/landing/HowItWorks";
import TraitGallery from "@/components/landing/TraitGallery";
import PrivacySection from "@/components/landing/PrivacySection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <LandingNav />
      <main className="min-h-screen bg-[var(--color-background)]">
        <HeroSection />
        <GeneMarquee />
        <ExploreSection />
        <HowItWorks />
        <TraitGallery />
        <PrivacySection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
