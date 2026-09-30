import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Lock, EyeOff, Server, KeyRound } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Privacy & Data Ethics — Visora",
  description: "Learn how Visora ensures zero model training on user simulations, client-side vision processing, and end-to-end media encryption.",
};

const PILLARS = [
  {
    icon: EyeOff,
    title: "Zero Public AI Training",
    description: "Your session transcripts, audio answers, and uploaded background data are strictly never fed into public foundation models.",
  },
  {
    icon: Server,
    title: "Ephemeral Processing",
    description: "Live camera vision is analyzed entirely on-device in your browser. Video streams are not stored on our servers.",
  },
  {
    icon: KeyRound,
    title: "TLS 1.3 & AES-256 Encryption",
    description: "All active WebRTC/WebSocket audio transmissions and diagnostic records are protected with industry-standard encryption protocols.",
  },
];

export default function PrivacyPage() {
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
          <span className="text-[#141414]">Legal & Privacy</span>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mb-16 lg:mb-20">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#141414] tracking-tight leading-[1.08] mb-6">
            Privacy & <span className="italic font-normal">Data Ethics</span>.
          </h1>
          <p className="text-sm text-[#736E65] font-mono tracking-wide uppercase">
            Last updated: September 30, 2026 • Version 2.4
          </p>
        </div>

        {/* 3 Privacy Bento Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-8 rounded-2xl bg-white border border-[#EAE4DA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-medium text-[#141414] mb-2">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-[#6E695F] leading-relaxed font-light">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Legal Breakdown */}
        <div className="border-t border-[#EAE4DA] pt-14 space-y-12 max-w-4xl">
          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">1. Information We Collect</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light mb-4">
              We collect information that you explicitly supply when configuring your simulation:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#6E695F] font-light">
              <li><strong>Account Identifiers:</strong> Basic authentication details (email address and chosen display name).</li>
              <li><strong>Simulation Context:</strong> Target visa track (e.g. F-1, B-1/B-2, H-1B), university names, sponsor details, and difficulty settings.</li>
              <li><strong>Audio Streams:</strong> Live spoken answers processed during an active session to generate speech transcripts and rubric scores.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">2. Processing of Audio & Visual Feeds</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light mb-3">
              We treat spoken and visual candidate data with uncompromising security:
            </p>
            <p className="text-xs sm:text-sm text-[#6E695F] leading-relaxed font-light mb-2">
              • <strong>Audio:</strong> Sent through secure, zero-data-retention APIs solely to produce live dialogue turns and diagnostic scores. Audio clips are never repurposed for marketing or model fine-tuning.
            </p>
            <p className="text-xs sm:text-sm text-[#6E695F] leading-relaxed font-light">
              • <strong>Camera / Vision:</strong> Computer vision indicators (gaze distribution, head orientation) are computed purely inside your browser using WebAssembly. Raw video frames never leave your local device.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">3. Data Retention & Deletion Rights</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              You maintain sovereign ownership of your session history. You may delete past simulations, audio records, and analytics dossiers at any time from your account settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">4. Third-Party Disclosures</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              We do not sell, rent, or trade your personal data to advertisers, visa consulting brokers, or government agencies. All backend compute providers adhere strictly to SOC 2 Type II and GDPR standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#141414] mb-4">5. Privacy Team Inquiries</h2>
            <p className="text-sm text-[#6E695F] leading-relaxed font-light">
              For privacy audits or compliance questions, please contact our data ethics team at <span className="font-medium text-[#141414]">privacy@visora.app</span>.
            </p>
          </section>
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
