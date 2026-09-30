import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Mic, Video, Brain, BarChart3, Clock, CheckCircle2, ArrowUpRight, Zap, Eye, FileText } from "lucide-react";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Features & Capabilities | Visora",
  description: "Explore Visora's multi-modal consular interview simulation features, real-time feedback engine, and scoring matrix.",
};

const FEATURE_MODULES = [
  {
    icon: Mic,
    tag: "Voice AI",
    title: "Dynamic Consular Dialogue",
    description:
      "Ultra-low latency conversational engine that listens, evaluates sentence structure, pauses appropriately, and challenges vague assertions just like an embassy officer.",
    highlights: ["Sub-300ms conversational turn-around", "Accented speech recognition", "Adaptive follow-up probing"],
  },
  {
    icon: Video,
    tag: "Vision Analysis",
    title: "Visual Poise & Eye Gaze Tracking",
    description:
      "Optional on-device computer vision to monitor eye contact consistency, head stability, and posture, helping you radiate calm self-assurance.",
    highlights: ["100% on-device vision privacy", "Fidgeting & posture alerts", "Gaze distribution heatmaps"],
  },
  {
    icon: Brain,
    tag: "Consular Logic",
    title: "INA 214(b) Immigrant Intent Matrix",
    description:
      "Our AI specifically audits your answers against consular evaluation criteria: home ties, financial sufficiency, academic credibility, and career progression.",
    highlights: ["Ties-to-home country scoring", "Sponsor funds validation checks", "Course-of-study relevance validation"],
  },
  {
    icon: BarChart3,
    tag: "Scoring & Rubrics",
    title: "Post-Session Diagnostic Dossier",
    description:
      "Receive an in-depth score across Clarity, Confidence, Brevity, and Compliance with concrete rewrite suggestions for weak answers.",
    highlights: ["Exact question-by-question playback", "AI-suggested optimal answers", "Confidence trendlines over time"],
  },
  {
    icon: FileText,
    tag: "Document Grounding",
    title: "DS-160 & I-20 Alignment",
    description:
      "Simulate questions crafted directly around your intended university, course of study, SEVIS ID details, or employer petition.",
    highlights: ["Form consistency stress tests", "Salary vs tuition ratio checks", "Field-of-study deep dives"],
  },
  {
    icon: Clock,
    tag: "Atmospheric Simulation",
    title: "Rapid Consular Pacing",
    description:
      "Most visa interviews last only 90 to 180 seconds. Visora trains you to deliver punchy, 15-second answers that convey maximum punch without rambling.",
    highlights: ["Cadence and brevity timers", "Filler word counter (um, like, uh)", "Interruption management practice"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col selection:bg-[#485244] selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE4DA]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/visora-logo-dark.png"
              alt="Visora"
              className="h-6 sm:h-7 w-auto object-contain mix-blend-multiply transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#736E65] hover:text-[#141414] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#141414] text-[#FAF8F5] rounded-full hover:bg-[#485244] transition-all shadow-xs"
            >
              Start Simulator
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-xs font-medium tracking-wide uppercase mb-6">
            <Zap className="w-3.5 h-3.5" />
            Platform Capabilities
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#141414] tracking-tight leading-[1.15] mb-6">
            Engineered for high-stakes conversational precision.
          </h1>
          <p className="text-lg sm:text-xl text-[#736E65] leading-relaxed font-light">
            Visora is built from the ground up to mirror the fast, perceptive, and legally calibrated environment of a consular interview window.
          </p>
        </div>

        {/* Feature Grid (2 columns wide) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {FEATURE_MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs flex flex-col justify-between hover:border-[#485244]/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] group-hover:bg-[#485244] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#736E65] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE4DA]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-[#141414] mb-3">{item.title}</h3>
                  <p className="text-sm text-[#736E65] leading-relaxed mb-6">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-[#F2ECE1] space-y-2">
                  {item.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-2 text-xs text-[#485244]">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Breakdown Banner */}
        <div className="p-10 sm:p-14 rounded-3xl bg-[#141414] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-light mb-3">Experience the full feature suite in action</h3>
            <p className="text-sm text-[#A39D93] leading-relaxed">
              Configure your visa category, choose your consular officer personality, and begin an adaptive voice simulation session in under 30 seconds.
            </p>
          </div>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF8F5] text-[#141414] font-semibold text-xs uppercase tracking-wider hover:bg-[#EAE4DA] transition-all whitespace-nowrap shadow-md"
          >
            Launch Free Simulation
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
