"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, KeyRound } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";

const PILLARS = [
  {
    icon: EyeOff,
    title: "Zero Model Training",
    desc: "Your session transcripts, audio, and personal background are never used to train public foundation models.",
  },
  {
    icon: Server,
    title: "Client-Side Vision",
    desc: "Poise and eye gaze analytics are computed locally in your browser. Video feeds are never stored on our servers.",
  },
  {
    icon: KeyRound,
    title: "Encrypted Streams",
    desc: "All active WebRTC voice data and diagnostic metrics are encrypted in transit via TLS 1.3 and at rest with AES-256.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141414] selection:bg-[#2C332A] selection:text-[#FAF8F5]">
      {/* Floating Capsule Navbar */}
      <Navbar />

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEBE4] text-[#485244] text-[12px] font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.025em] text-[#141414] leading-[1.12] mb-4">
            Privacy Policy
          </h1>

          <p className="text-sm text-[#736E65] font-normal">
            Last updated: September 30, 2026 • Visora Security Protocol
          </p>
        </div>

        {/* 3 Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[#141414] mb-2">{p.title}</h3>
                <p className="text-sm text-[#66625B] leading-[1.55]">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Policy Content Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-8 text-sm text-[#575249] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-[#141414] mb-2">1. Data Collection & Purpose</h2>
            <p className="mb-2">
              We collect only the information necessary to power real-time conversational practice:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-[#66625B]">
              <li>Account identifiers (email address and chosen display name).</li>
              <li>Simulation context (visa track, university name, sponsor details).</li>
              <li>Spoken audio clips during an active session to generate speech-to-text transcripts for scoring.</li>
            </ul>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">2. Audio & Vision Processing</h2>
            <p className="mb-2">
              <strong>Audio:</strong> Sent through secure, zero-data-retention pipelines solely to produce live dialogue turns and rubric feedback.
            </p>
            <p>
              <strong>Camera:</strong> Computer vision tracking (eye gaze, head alignment) runs entirely in your local browser using client-side WebAssembly. Raw video is never saved to our servers.
            </p>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">3. User Data Ownership</h2>
            <p>
              You maintain complete ownership of your session history and transcripts. You can permanently delete any practice session from your settings dashboard at any time.
            </p>
          </section>

          <section className="pt-6 border-t border-[#F2ECE1]">
            <h2 className="text-lg font-bold text-[#141414] mb-2">4. Contact Privacy Team</h2>
            <p>
              For data access requests or privacy questions, reach out directly to <span className="font-semibold text-[#141414]">privacy@visora.app</span>.
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
