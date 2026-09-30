import * as React from "react";
import Link from "next/link";
import { ChevronRight, Scale, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Terms of Service — Visora",
  description: "User agreement and terms of use for Visora's consular interview simulation software.",
};

export default function TermsPage() {
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
          <span className="text-[#141414]">Terms of Service</span>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mb-14">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#141414] tracking-tight leading-[1.08] mb-6">
            Terms of <span className="italic font-normal">Service</span>.
          </h1>
          <p className="text-sm text-[#736E65] font-mono tracking-wide uppercase">
            Effective Date: September 30, 2026
          </p>
        </div>

        {/* Advisory Callout */}
        <div className="p-8 rounded-2xl bg-white border border-[#E8E2D8] shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-14 flex items-start gap-4 max-w-4xl">
          <AlertTriangle className="w-5 h-5 text-[#8C6D23] flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#6E695F] leading-relaxed font-light">
            <strong className="text-[#141414] font-medium block mb-1">Educational & Practice Simulation Disclaimer</strong>
            Visora is an independent preparatory simulator designed to improve candidate confidence, public speaking composure, and brevity under pressure. Visora is not affiliated with the U.S. Department of State, USCIS, or any embassy. Use of this platform does not constitute legal counsel or guarantee visa approval.
          </div>
        </div>

        {/* Terms Sections */}
        <div className="border-t border-[#EAE4DA] pt-14 space-y-12 max-w-4xl">
          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">1. Agreement to Terms</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              By accessing or using the Visora web platform, mobile experiences, or associated simulation services, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">2. Permitted & Prohibited Conduct</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light mb-3">
              You agree to use Visora solely for lawful educational preparation. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#6E695F] font-light">
              <li>Reverse engineer, scrape, or extract synthetic consular prompts or voice synthesis pipelines.</li>
              <li>Use the system to forge fraudulent immigration declarations or deceptive DS-160 records.</li>
              <li>Circumvent security protections or attempt to disrupt audio streaming server infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">3. Intellectual Property Rights</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              All software, simulated conversational personas, scoring algorithms, designs, brand marks, and user interfaces are the proprietary property of VISORA Inc.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">4. Limitation of Liability</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              In no event shall VISORA Inc. or its developers be held liable for any decisions, denials, or outcomes made by government visa officers or consular posts.
            </p>
          </section>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
