"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Floating Capsule Navbar */}
      <Navbar />

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-[12px] font-medium mb-6">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-[#141414] leading-[1.12] mb-4">
            Terms of Service
          </h1>

          <p className="text-sm text-[#736E65] font-normal">
            Effective: September 30, 2026
          </p>
        </div>

        {/* Disclaimer Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F2EC] border border-[#E8E2D8] mb-10 flex items-start gap-4">
          <AlertTriangle className="w-5 h-5 text-[#8C6D23] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#575249] leading-relaxed">
            <strong className="text-[#141414] font-semibold block mb-1">Educational & Practice Simulation Notice</strong>
            Visora is an independent preparatory platform designed to improve candidate confidence, public speaking composure, and answer brevity. Visora is not affiliated with the U.S. Department of State, USCIS, or any embassy, and does not provide legal immigration counsel or visa approval guarantees.
          </div>
        </div>

        {/* Terms Content Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-8 text-sm text-[#575249] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#141414] mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using the Visora web platform and simulation features, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">2. Acceptable Use</h2>
            <p className="mb-2">
              You agree to use Visora solely for genuine individual preparation. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#66625B]">
              <li>Scrape, reverse-engineer, or extract proprietary consular personas or prompt configurations.</li>
              <li>Generate deceptive DS-160 declarations or attempt to abuse real-time voice streaming services.</li>
              <li>Attempt unauthorized access to our WebSocket infrastructure.</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">3. Intellectual Property</h2>
            <p>
              All software, algorithms, speech evaluation rubrics, user interfaces, and brand visual assets are the exclusive property of VISORA Inc.
            </p>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">4. Limitation of Liability</h2>
            <p>
              VISORA Inc. and its contributors are not liable for consular decisions, interview outcomes, or indirect damages arising from use of the platform.
            </p>
          </section>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#EAE4DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A847A]">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-[#141414] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Visora
          </Link>
          <p>© {new Date().getFullYear()} VISORA Inc. All rights reserved.</p>
        </div>

      </main>
    </div>
  );
}
