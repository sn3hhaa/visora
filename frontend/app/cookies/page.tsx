import * as React from "react";
import Link from "next/link";
import { ChevronRight, Cookie, Shield, Cpu } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Cookie Policy — Visora",
  description: "Learn how Visora uses essential session storage and browser tokens to power real-time simulation experiences.",
};

const STORAGE_CATEGORIES = [
  {
    icon: Shield,
    badge: "Strictly Essential",
    title: "Session & Simulation Cache",
    description: "Required to maintain your active simulation room state, microphone device preferences, chosen visa track, and audio levels.",
  },
  {
    icon: Cpu,
    badge: "Telemetry & Performance",
    title: "WebRTC Audio Diagnostics",
    description: "Monitors WebSocket latency, packet drop rates, and speech recognition speed to ensure uninterrupted voice simulations.",
  },
];

export default function CookiesPage() {
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
          <span className="text-[#141414]">Cookie Policy</span>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mb-16">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#141414] tracking-tight leading-[1.08] mb-6">
            Cookie & <span className="italic font-normal">Storage Policy</span>.
          </h1>
          <p className="text-sm text-[#736E65] font-mono tracking-wide uppercase">
            Last updated: September 30, 2026
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {STORAGE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#485244] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#EAE4DA]">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-[#141414] mb-2">{cat.title}</h3>
                  <p className="text-sm text-[#6E695F] leading-relaxed font-light">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Explanation */}
        <div className="border-t border-[#EAE4DA] pt-14 space-y-10 max-w-4xl">
          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">1. What Are Cookies and Local Storage?</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              Cookies and browser local storage are compact data records saved to your browser session. Visora uses them to remember your active microphone device selection, volume preferences, and simulation progress.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">2. Controlling Your Preferences</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              You can adjust or clear cookies through your browser settings at any time. Note that clearing session storage will reset your in-progress mock interview configurations.
            </p>
          </section>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
