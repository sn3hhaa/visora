import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Target, Shield, Compass, Sparkles, Award, CheckCircle2, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "About Visora — Practice the conversation before it becomes real",
  description: "Visora bridges the gap between raw preparation and calm, persuasive interview presence through adaptive consular simulations.",
};

const VALUES = [
  {
    number: "01",
    title: "Calibrated Pressure",
    tagline: "Authentic embassy atmospheric tension",
    description:
      "Consular officers operate under strict time limits, rapid cadence, and specific statutory scrutiny (INA 214(b)). We recreate this real-world pace so the actual interview feels familiar.",
  },
  {
    number: "02",
    title: "Multi-Modal Poise",
    tagline: "Speech cadence, tone stability, and focus",
    description:
      "High-stakes conversations are decided not just by factual accuracy, but by vocal composure, answer brevity, and direct confidence under scrutiny.",
  },
  {
    number: "03",
    title: "Zero-Data Compromise",
    tagline: "Strict candidate confidentiality",
    description:
      "Your academic petitions, employer sponsors, and personal financial context are completely confidential. We never train public foundation models on candidate session logs.",
  },
];

const METRICS = [
  { value: "10k+", label: "Simulations Run", sub: "Across F-1, B-1/B-2, and H-1B tracks" },
  { value: "<300ms", label: "Voice Latency", sub: "Sub-second adaptive speech turn-around" },
  { value: "94.8%", label: "Composure Score", sub: "Candidates reporting reduced consular anxiety" },
  { value: "24/7", label: "On-Demand Access", sub: "Unlimited practice before stepping to the window" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1916] flex flex-col selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Signature Floating Pill Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-28">
        
        {/* Breadcrumb / Category Tag */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#736E65] font-medium mb-8">
          <Link href="/" className="hover:text-[#141414] transition-colors">
            Visora
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A39D93]" />
          <span className="text-[#141414]">About Our Pedagogy</span>
        </div>

        {/* Editorial Hero Header */}
        <div className="max-w-4xl mb-20 lg:mb-24">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#141414] tracking-tight leading-[1.08] mb-8">
            Transforming high-stakes <br className="hidden sm:block" />
            uncertainty into <span className="italic font-normal">calm mastery</span>.
          </h1>
          <p className="text-lg sm:text-xl text-[#6E695F] leading-relaxed font-light max-w-3xl">
            Every year, millions of students, researchers, and professionals face pivotal visa interviews where 120 seconds determine their future. Visora was engineered to replace anxious hesitation with repeatable, articulate composure.
          </p>
        </div>

        {/* Key Numerical Metrics Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-24">
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="p-6 sm:p-8 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#141414] mb-3 tracking-tight">
                {metric.value}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#141414] mb-1">
                  {metric.label}
                </div>
                <div className="text-xs text-[#736E65] leading-normal font-light">
                  {metric.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Section: 2 Column Editorial Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start py-16 border-t border-[#EAE4DA]">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#485244] block mb-3">
              The Architecture of Confidence
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#141414] leading-[1.2] mb-6">
              Why static question banks and mock scripts always fail.
            </h2>
            <p className="text-sm sm:text-base text-[#6E695F] leading-relaxed font-light mb-6">
              Consular officers don't read from linear scripts—they listen for hesitations, cross-check answers against DS-160 declarations, and probe vague statements with sudden follow-ups.
            </p>
            <p className="text-sm sm:text-base text-[#6E695F] leading-relaxed font-light">
              Visora gives you the muscle memory of live dialogue so that when you step up to the actual embassy window, your answers are succinct, focused, and legally grounded.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {VALUES.map((val) => (
              <div
                key={val.number}
                className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-[#485244]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#8A847A] tracking-wider uppercase font-semibold">
                    {val.number}
                  </span>
                  <span className="text-xs text-[#485244] font-medium bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EAE4DA]">
                    {val.tagline}
                  </span>
                </div>
                <h3 className="text-xl font-medium text-[#141414] mb-2">{val.title}</h3>
                <p className="text-sm text-[#6E695F] leading-relaxed font-light">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Elegant CTA Card */}
        <div className="mt-16 sm:mt-24 p-10 sm:p-14 lg:p-16 rounded-3xl bg-[#191919] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Live Simulation Arena
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-light text-white mb-4 leading-tight">
              Begin your calibrated consular session.
            </h3>
            <p className="text-sm text-[#B5B0A6] leading-relaxed font-light">
              Select your visa track, choose your consular officer persona, and experience real-time adaptive questioning.
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
