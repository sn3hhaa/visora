import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, Info } from "lucide-react";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Cookie Policy | Visora",
  description: "Learn how Visora uses essential cookies and local browser storage for simulation state.",
};

export default function CookiesPage() {
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
            <Cookie className="w-3.5 h-3.5" />
            Storage & Preference Settings
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#141414] tracking-tight leading-tight mb-4">
            Cookie Policy
          </h1>
          <p className="text-sm text-[#736E65]">
            Last updated: September 30, 2026 • Effective immediately
          </p>
        </div>

        {/* Cookie Categories Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Essential Session Storage</div>
            <h3 className="text-lg font-medium text-[#141414] mb-2">Simulation State & Audio Config</h3>
            <p className="text-xs text-[#736E65] leading-relaxed">
              Required for the simulation room to remember your chosen visa type, microphone permissions, active questions, and audio volume levels during your mock session.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#485244] mb-2">Performance & Diagnostics</div>
            <h3 className="text-lg font-medium text-[#141414] mb-2">Latency Monitoring & Error Logging</h3>
            <p className="text-xs text-[#736E65] leading-relaxed">
              Helps us measure WebSocket voice turn latency, audio packet drop rates, and WebRTC stability to ensure seamless real-time conversation.
            </p>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-8 text-sm text-[#575249] leading-relaxed border-t border-[#EAE4DA] pt-10">
          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">1. What Are Cookies and Local Storage?</h2>
            <p>
              Cookies and local browser storage are small text files placed on your computer or device by websites that you visit. They are widely used to make websites work efficiently and retain your active preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">2. How to Manage or Disable Storage</h2>
            <p>
              Most web browsers allow you to control cookies through their browser settings. Please note that disabling essential cookies may cause the live voice simulation room and audio stream buffers to malfunction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">3. Changes to this Cookie Policy</h2>
            <p>
              We may update this policy periodically to reflect updates in regulatory guidelines or simulation room technology.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
