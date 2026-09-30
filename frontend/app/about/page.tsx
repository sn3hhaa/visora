import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Target, Shield, Compass, Sparkles, Award, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "About Visora | Precision Consular Simulation",
  description: "Learn how Visora is reimagining visa interview readiness through multi-modal AI intelligence and real consular pedagogy.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] flex flex-col selection:bg-[#485244] selection:text-white">
      {/* Top Navigation */}
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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        
        {/* Hero Section */}
        <div className="max-w-4xl mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-xs font-medium tracking-wide uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Our Mission & Philosophy
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light text-[#141414] tracking-tight leading-[1.15] mb-6">
            Democratizing world-class visa interview mastery.
          </h1>
          <p className="text-lg sm:text-xl text-[#736E65] leading-relaxed font-light">
            Every year, millions of brilliant students, professionals, and travelers face life-defining visa interviews with anxiety and uncertainty. Visora transforms unpredictable interviews into structured, high-confidence outcomes through cutting-edge consular simulation.
          </p>
        </div>

        {/* 3 Core Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-[#141414] mb-3">Authentic Consular Tone</h3>
              <p className="text-sm text-[#736E65] leading-relaxed">
                Consular officers operate under strict time limits, rapid cadence, and specific legal frameworks (such as INA 214(b) non-immigrant intent). Visora replicates this exact atmospheric pressure.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] text-xs font-medium text-[#485244] uppercase tracking-wider">
              Sub-second Latency
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-[#141414] mb-3">Multi-Modal Diagnostics</h3>
              <p className="text-sm text-[#736E65] leading-relaxed">
                Interviews are decided not just by what you say, but how you present. Our system evaluates voice pitch stability, filler words, eye contact engagement, and answer conciseness in real-time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] text-xs font-medium text-[#485244] uppercase tracking-wider">
              Real-time Feedback
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-[#141414] mb-3">Privacy & Ethics First</h3>
              <p className="text-sm text-[#736E65] leading-relaxed">
                Your credentials, financial narratives, and personal background documents are confidential. Visora never trains public models on candidate simulation transcripts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F2ECE1] text-xs font-medium text-[#485244] uppercase tracking-wider">
              Zero-Data Leakage
            </div>
          </div>
        </div>

        {/* Detailed Story & Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-12 border-t border-[#EAE4DA]">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#485244]">The Visora Story</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] mt-2 mb-4">
              Built by immigrants, educators, and AI researchers.
            </h2>
            <p className="text-sm text-[#736E65] leading-relaxed">
              We experienced the anxiety of the visa window firsthand. Visora was crafted to replace blind panic with calibrated, repeatable confidence.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-[#F6F2EC] border border-[#E8E2D8]">
              <div className="text-3xl font-serif text-[#141414] mb-2">10,000+</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Simulated Scenarios</div>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Covering F-1 OPT transitions, STEM extensions, B-1 business travel itineraries, and H-1B specialty occupation interviews.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F6F2EC] border border-[#E8E2D8]">
              <div className="text-3xl font-serif text-[#141414] mb-2">94.8%</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Candidate Confidence Score</div>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Candidates report feeling significantly more composed, concise, and structured during their actual embassy appointments.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F6F2EC] border border-[#E8E2D8]">
              <div className="text-3xl font-serif text-[#141414] mb-2">&lt; 300ms</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Live Response Latency</div>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Powered by next-generation voice intelligence to simulate natural conversational interruptions and follow-ups.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F6F2EC] border border-[#E8E2D8]">
              <div className="text-3xl font-serif text-[#141414] mb-2">24/7</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Unlimited Repetitions</div>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Practice at your own pace anytime, anywhere, before stepping up to the consular counter.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-16 p-10 sm:p-14 rounded-3xl bg-[#141414] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-serif font-light mb-3">Ready to experience the consular simulator?</h3>
            <p className="text-sm text-[#A39D93] leading-relaxed">
              Step into an adaptive interview arena configured specifically for your visa track, university, or sponsor company.
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
