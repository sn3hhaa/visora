"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mic, Eye, Brain, BarChart3, Clock, FileCheck2, Sparkles, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

const FEATURES = [
  {
    icon: Mic,
    badge: "Speech AI",
    title: "Sub-300ms Conversational Turn-Taking",
    desc: "Natural interruptions, instant follow-ups, and realistic pauses that replicate the high-speed rhythm of real visa officers.",
  },
  {
    icon: Brain,
    badge: "Compliance",
    title: "INA 214(b) Immigrant Intent Matrix",
    desc: "Answers are analyzed against home country ties, financial sufficiency, and DS-160 declarations with custom scoring.",
  },
  {
    icon: Eye,
    badge: "Vision",
    title: "On-Device Visual Poise Tracking",
    desc: "100% private in-browser computer vision monitors eye gaze stability, head orientation, and fidgeting in real-time.",
  },
  {
    icon: BarChart3,
    badge: "Analytics",
    title: "Instant Diagnostic Dossier",
    desc: "Detailed rubric breakdown across Brevity, Clarity, and Confidence with question-by-question rewrite suggestions.",
  },
  {
    icon: Clock,
    badge: "Pacing",
    title: "Consular Time Pressure (90-180s)",
    desc: "Trains you to answer in concise 15-second soundbites that convey authority without over-explaining or rambling.",
  },
  {
    icon: FileCheck2,
    badge: "Context",
    title: "Personalized Document Grounding",
    desc: "Simulations adapt dynamically to your specific university, degree program, funding source, or sponsor profile.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Floating Capsule Navbar */}
      <Navbar />

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        
        {/* Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-[12px] font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Features</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-[#141414] leading-[1.12] mb-5">
            Engineered for high-stakes conversational precision.
          </h1>

          <p className="text-base sm:text-lg text-[#66625B] leading-[1.6] font-normal">
            Every feature in Visora is purpose-built to replicate the pressure, nuance, and evaluation criteria of real embassy interviews.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-7 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-[#485244]/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-[#736E65] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#EAE4DA]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#141414] mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-[#66625B] leading-[1.55]">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleek CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#191919] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_12px_36px_rgba(0,0,0,0.12)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              Ready to test your answers?
            </h3>
            <p className="text-sm text-[#B5B0A6] max-w-md leading-relaxed">
              Launch a live simulation tailored to your visa track.
            </p>
          </div>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 bg-white text-[#191919] hover:bg-[#F2EDE5] text-xs font-semibold px-5 py-3 rounded-full transition-all duration-150 shadow-sm shrink-0"
          >
            <span>Start Practice</span>
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
