import { Navbar } from "@/components/navigation/navbar";
import { Hero } from "@/components/landing/hero/hero";
import { ContextStory } from "@/components/landing/contexts/context-story";
import { ScrollRevealText } from "@/components/landing/scroll-reveal/scroll-reveal-text";
import { AdaptiveConversation } from "@/components/landing/adaptive-conversation/adaptive-conversation";
import { FeatureSection } from "@/components/landing/feature-section/feature-section";
import { PerformanceIntelligence } from "@/components/landing/performance/performance-intelligence";
import { ResultsPreview } from "@/components/landing/results/results-preview";
import { FinalCta } from "@/components/landing/final-cta/final-cta";
import { Footer } from "@/components/landing/footer/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#1A1916] overflow-x-hidden selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* 1. Floating Pill Navbar */}
      <Navbar />

      {/* Main Landing Flow */}
      <main className="flex flex-col w-full">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Context Story Section */}
        <ContextStory />

        {/* 4. Scroll-Driven Kinetic Highlight Manifesto */}
        <ScrollRevealText />

        {/* 5. Adaptive Conversation Architecture */}
        <AdaptiveConversation />

        {/* 6. Feature Section (Reference 3) */}
        <FeatureSection />

        {/* 7. Performance Intelligence & Telemetry */}
        <PerformanceIntelligence />

        {/* 10. Post-Session Results Diagnostics */}
        <ResultsPreview />

        {/* 11. Final Quiet CTA */}
        <FinalCta />
      </main>

      {/* 12. Interactive Light Footer with Botanical Motifs */}
      <Footer />
    </div>
  );
}
