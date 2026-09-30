import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Mic, Eye, Brain, BarChart3, Clock, FileCheck2, Sparkles, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Platform Capabilities — Visora",
  description: "Explore Visora's multi-modal simulation engine: adaptive voice AI, INA 214(b) compliance diagnostics, and real-time composure analysis.",
};

const FEATURES = [
  {
    icon: Mic,
    category: "Speech & Audio",
    title: "Sub-300ms Conversational Turn-Taking",
    tagline: "Natural conversational cadence without latency gaps",
    description:
      "Our low-latency voice pipeline mimics the natural interruptions, quick acknowledgments, and rapid follow-ups of a real consular officer under time pressure.",
    points: ["Dynamic pause detection", "Accent-agnostic recognition", "Realistic cross-examination interruptions"],
  },
  {
    icon: Brain,
    category: "Consular Logic",
    title: "INA 214(b) Immigrant Intent Engine",
    tagline: "Statutory adherence & ties-to-home scoring",
    description:
      "Interviews are audited under real embassy evaluation criteria: economic ties, career trajectory, non-immigrant intent, and DS-160 document consistency.",
    points: ["Home country tie evaluation", "Sponsor funds validation check", "Field-of-study alignment analysis"],
  },
  {
    icon: Eye,
    category: "Computer Vision",
    title: "On-Device Visual Poise & Gaze Tracking",
    tagline: "100% private in-browser posture & eye contact analysis",
    description:
      "Measures eye contact engagement, head tilt stability, and fidgeting in real-time to help candidates cultivate a calm, confident physical presence.",
    points: ["Zero server video transmission", "Gaze stability heatmaps", "Posture & fidgeting alerts"],
  },
  {
    icon: BarChart3,
    category: "Scoring Matrix",
    title: "Post-Session Diagnostic Dossier",
    tagline: "Actionable rubric: Brevity, Clarity, and Compliance",
    description:
      "Every answer is transcribed and broken down into structured metrics, highlighting filler words, unnecessary rambling, and optimal answer rewrites.",
    points: ["Question-by-question replay", "AI-suggested concise rewrites", "Historical progress tracking"],
  },
  {
    icon: Clock,
    category: "Simulation Arena",
    title: "Consular Time Pressure (90-180s)",
    tagline: "Mastering the 15-second answer standard",
    description:
      "Consular officers make initial decisions within the first 60 seconds. Visora trains you to deliver high-impact, punchy answers that get straight to the point.",
    points: ["Answer duration indicator", "Filler word tally (um, like, uh)", "Pacing & cadence scoring"],
  },
  {
    icon: FileCheck2,
    category: "Form Grounding",
    title: "Personalized DS-160 & I-20 Context",
    tagline: "Custom-tailored question generation",
    description:
      "Enter your university, intended degree, sponsor details, or job offer to practice questions specifically calibrated to your personal documentation.",
    points: ["University & course specificity", "Financial sponsor stress-testing", "Career progression narratives"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1916] flex flex-col selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Signature Floating Pill Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-28">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#736E65] font-medium mb-8">
          <Link href="/" className="hover:text-[#141414] transition-colors">
            Visora
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A39D93]" />
          <span className="text-[#141414]">Platform Capabilities</span>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mb-20 lg:mb-24">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#141414] tracking-tight leading-[1.08] mb-8">
            Engineered for <br className="hidden sm:block" />
            <span className="italic font-normal">conversational precision</span>.
          </h1>
          <p className="text-lg sm:text-xl text-[#6E695F] leading-relaxed font-light max-w-3xl">
            A comprehensive multi-modal system that combines authentic embassy pacing, sub-second speech intelligence, and rigorous consular compliance evaluation.
          </p>
        </div>

        {/* 6 Feature Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#485244]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] group-hover:bg-[#485244] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#736E65] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE4DA]">
                      {feat.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-[#141414] mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#485244] font-medium mb-4">
                    {feat.tagline}
                  </p>
                  <p className="text-sm text-[#6E695F] leading-relaxed font-light mb-6">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE1] space-y-2">
                  {feat.points.map((pt) => (
                    <div key={pt} className="flex items-center gap-2 text-xs text-[#575249]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#485244] flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Feature CTA Banner */}
        <div className="p-10 sm:p-14 lg:p-16 rounded-3xl bg-[#191919] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Ready to Practice?
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-light text-white mb-4 leading-tight">
              Test your answers against our consular simulator.
            </h3>
            <p className="text-sm text-[#B5B0A6] leading-relaxed font-light">
              Get immediate diagnostic feedback on your voice tone, answer brevity, and legal clarity.
            </p>
          </div>

          <Link
            href="/setup"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white text-[#191919] font-medium text-xs uppercase tracking-wider hover:bg-[#F2EDE5] transition-all whitespace-nowrap shadow-md active:scale-95"
          >
            Launch Free Simulator
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
