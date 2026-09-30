import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, KeyRound, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/landing/footer/footer";

export const metadata = {
  title: "Privacy Policy | Visora",
  description: "Learn how Visora protects your audio, video, resume, and DS-160 visa simulation data.",
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            Data Protection & Ethics
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-[#141414] tracking-tight leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#736E65]">
            Last updated: September 30, 2026 • Effective immediately
          </p>
        </div>

        {/* 3 Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-4">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#141414] mb-2">No Public AI Model Training</h3>
            <p className="text-xs text-[#736E65] leading-relaxed">
              Your audio transcripts, resume details, and practice answers are never fed into open foundational models.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#141414] mb-2">Ephemeral Media Processing</h3>
            <p className="text-xs text-[#736E65] leading-relaxed">
              Video feeds analyzed for eye contact and posture are processed entirely client-side or streamed ephemerally without persistent video storage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#EAE4DA] shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA] flex items-center justify-center text-[#485244] mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#141414] mb-2">End-to-End Encryption</h3>
            <p className="text-xs text-[#736E65] leading-relaxed">
              All active simulation streams, session metrics, and analytics dossiers are encrypted in transit via TLS 1.3 and at rest with AES-256.
            </p>
          </div>
        </div>

        {/* Legal Text Sections */}
        <div className="space-y-10 text-sm text-[#575249] leading-relaxed border-t border-[#EAE4DA] pt-12">
          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">1. Information We Collect</h2>
            <p className="mb-3">
              We collect information that you explicitly provide when creating an account, choosing visa tracks, uploading background notes (such as university or sponsor names), and participating in live voice simulations.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#736E65]">
              <li>Account identifiers (email address, chosen display name).</li>
              <li>Simulation context (visa category, university name, consular officer tone setting).</li>
              <li>Voice audio clips during an active session to generate speech-to-text transcripts for immediate scoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">2. How Your Audio & Video are Processed</h2>
            <p className="mb-3">
              When you activate the microphone or camera in the Simulation Arena:
            </p>
            <p className="text-xs text-[#736E65] mb-2">
              • <strong>Audio:</strong> Sent through secure, zero-data-retention APIs solely to produce live dialogue turns and diagnostic scores.
            </p>
            <p className="text-xs text-[#736E65]">
              • <strong>Camera / Vision:</strong> Computer vision indicators (eye gaze alignment, head orientation) are computed in your browser. Raw video frames are not saved or archived to our permanent database.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">3. Data Retention & Deletion</h2>
            <p>
              You maintain full control over your session records. At any point, you can delete past simulation scores, transcripts, and account profile records permanently through your settings dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">4. Third-Party Disclosures</h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party advertisers, visa agencies, or governmental bodies. All infrastructure partners adhere to SOC 2 Type II and GDPR compliance standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-serif font-medium text-[#141414] mb-3">5. Contact Our Privacy Team</h2>
            <p>
              For inquiries, data export requests, or security disclosures, please reach out to <span className="text-[#141414] font-medium">privacy@visora.app</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
