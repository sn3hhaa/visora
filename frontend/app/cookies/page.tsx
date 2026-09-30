"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, Shield, Cpu } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

const CATEGORIES = [
  {
    icon: Shield,
    badge: "Essential",
    title: "Session & Simulation Memory",
    desc: "Stores active mock interview progress, microphone device preferences, and volume configurations.",
  },
  {
    icon: Cpu,
    badge: "Performance",
    title: "Audio Stream Diagnostics",
    desc: "Measures WebRTC/WebSocket latency and speech recognition performance to ensure sub-300ms response speed.",
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Floating Capsule Navbar */}
      <Navbar />

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-[12px] font-medium mb-6">
            <Cookie className="w-3.5 h-3.5" />
            <span>Preferences & Storage</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-[#141414] leading-[1.12] mb-4">
            Cookie Policy
          </h1>

          <p className="text-sm text-[#736E65] font-normal">
            Last updated: September 30, 2026
          </p>
        </div>

        {/* 2 Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#485244] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EAE4DA]">
                    {cat.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#141414] mb-2">{cat.title}</h3>
                <p className="text-sm text-[#66625B] leading-[1.55]">{cat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Cookie Details Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-8 text-sm text-[#575249] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#141414] mb-2">1. How We Use Browser Storage</h2>
            <p>
              Visora uses local session storage exclusively to maintain your active simulation state, remember audio volume preferences, and prevent interruptions during live practice.
            </p>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">2. Managing Cookie Preferences</h2>
            <p>
              You can clear cookies and stored data through your browser settings at any time. Note that clearing storage during an active session will reset your mock interview setup.
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
