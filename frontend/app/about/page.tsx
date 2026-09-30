"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Target, Shield, Compass, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Floating Capsule Navbar */}
      <Navbar />

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-[12px] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Visora</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-[#141414] leading-[1.12] mb-5">
            Transforming interview anxiety into calm, articulate performance.
          </h1>

          <p className="text-base sm:text-lg text-[#66625B] leading-[1.6] font-normal">
            Visora was created to eliminate the unpredictability of high-stakes consular conversations. We combine real-time voice intelligence, behavioral analysis, and consular pedagogy to give candidates true conversational mastery.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {[
            { value: "10,000+", label: "Simulations completed" },
            { value: "<300ms", label: "Voice response latency" },
            { value: "94.8%", label: "Candidate confidence score" },
            { value: "24/7", label: "Instant adaptive practice" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-[#736E65] font-medium leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3 Core Pillars */}
        <div className="space-y-4 sm:space-y-6 mb-16">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414]">
            Built on three core principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                title: "Calibrated Pressure",
                desc: "We replicate the rapid pacing, follow-up scrutiny, and legal frameworks (like INA 214(b)) used by real embassy officers.",
              },
              {
                icon: Compass,
                title: "Multi-Modal Intelligence",
                desc: "Real-time diagnostics across speech cadence, vocal pitch stability, and eye contact poise give you 360° feedback.",
              },
              {
                icon: Shield,
                title: "Strict Confidentiality",
                desc: "Your DS-160 details, financials, and transcripts are 100% private. We never train public AI models on your sessions.",
              },
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-7 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[#141414] mb-2">{pillar.title}</h3>
                    <p className="text-sm text-[#66625B] leading-[1.55]">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sleek CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#191919] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              Ready to start your first simulation?
            </h3>
            <p className="text-sm text-[#B5B0A6] max-w-md leading-relaxed">
              Step into the adaptive interview room in under 30 seconds.
            </p>
          </div>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 bg-white text-[#191919] hover:bg-[#F2EDE5] text-xs font-semibold px-5 py-3 rounded-full transition-all duration-150 shadow-sm shrink-0"
          >
            <span>Launch Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
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
