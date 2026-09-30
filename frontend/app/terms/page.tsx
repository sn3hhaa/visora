import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Terms of Service | Visora",
  description: "Terms and conditions governing the use of Visora's consular interview simulation software.",
};

export default function TermsPage() {
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#736E65] hover:text-[#141414] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        
        {/* Header */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-xs font-medium tracking-wide uppercase mb-6">
            <Scale className="w-3.5 h-3.5" />
            User Agreement & Terms
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#141414] tracking-tight leading-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-[#736E65]">
            Last updated: September 30, 2026 • Please read carefully before using Visora
          </p>
        </div>

        {/* Important Notice Callout */}
        <div className="p-6 rounded-2xl bg-[#F6F2EC] border border-[#E8E2D8] mb-12 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-[#8C6D23] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#575249] leading-relaxed">
            <strong className="text-[#141414] block mb-1">Educational & Practice Simulation Disclaimer</strong>
            Visora is an independent preparatory tool designed to simulate interview pacing and public speaking composure. Visora is not affiliated with the U.S. Department of State, USCIS, or any government embassy. We do not provide formal legal advice or guarantee visa approval.
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10 text-sm text-[#575249] leading-relaxed">
          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Visora (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">2. Permitted Use</h2>
            <p className="mb-2">
              You agree to use Visora solely for personal interview preparation and educational enhancement. You agree NOT to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#736E65]">
              <li>Reverse engineer, scrape, or extract synthetic voice models or scoring rubrics.</li>
              <li>Use the platform to generate fraudulent DS-160 statements or fabricate visa documentation.</li>
              <li>Interfere with or disrupt the security and server infrastructure of the simulation room.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">3. Intellectual Property</h2>
            <p>
              The simulation design, conversational prompts, proprietary scoring algorithms, logos, and UI components are the exclusive property of VISORA Inc. and protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">4. Subscriptions and Access</h2>
            <p>
              Certain simulation tracks or elevated diagnostic limits may be offered under tiered subscription plans. All charges are transparently displayed prior to authorization.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">5. Limitation of Liability</h2>
            <p>
              In no event shall VISORA Inc. or its creators be liable for consular adjudication outcomes, embassy decisions, or indirect damages arising out of the use or inability to use the simulator.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
