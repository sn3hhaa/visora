"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInterviewStore } from "@/store/interview-store";
import { ArrowLeft, ChevronRight } from "lucide-react";

const f1Schema = z.object({
  university: z.string().optional(),
  program: z.string().optional(),
  academicBackground: z.string().optional(),
});

const h1bSchema = z.object({
  employer: z.string().optional(),
  role: z.string().optional(),
  experience: z.string().optional(),
});

const b1b2Schema = z.object({
  purpose: z.string().optional(),
  duration: z.string().optional(),
  destination: z.string().optional(),
});

type F1FormValues = z.infer<typeof f1Schema>;
type H1BFormValues = z.infer<typeof h1bSchema>;
type B1B2FormValues = z.infer<typeof b1b2Schema>;

export function ContextForm() {
  const {
    selectedContext,
    candidateProfile,
    updateF1Profile,
    updateH1BProfile,
    updateB1B2Profile,
    setStep,
  } = useInterviewStore();

  const f1Form = useForm<F1FormValues>({
    resolver: zodResolver(f1Schema),
    defaultValues: {
      university: candidateProfile.f1?.university || "",
      program: candidateProfile.f1?.program || "",
      academicBackground: candidateProfile.f1?.academicBackground || "",
    },
  });

  const h1bForm = useForm<H1BFormValues>({
    resolver: zodResolver(h1bSchema),
    defaultValues: {
      employer: candidateProfile.h1b?.employer || "",
      role: candidateProfile.h1b?.role || "",
      experience: candidateProfile.h1b?.experience || "",
    },
  });

  const b1b2Form = useForm<B1B2FormValues>({
    resolver: zodResolver(b1b2Schema),
    defaultValues: {
      purpose: candidateProfile.b1b2?.purpose || "",
      duration: candidateProfile.b1b2?.duration || "",
      destination: candidateProfile.b1b2?.destination || "",
    },
  });

  const onSubmitF1 = (data: F1FormValues) => {
    updateF1Profile(data);
    setStep(3);
  };

  const onSubmitH1B = (data: H1BFormValues) => {
    updateH1BProfile(data);
    setStep(3);
  };

  const onSubmitB1B2 = (data: B1B2FormValues) => {
    updateB1B2Profile(data);
    setStep(3);
  };

  const handleContinue = () => {
    if (selectedContext === "f1") {
      f1Form.handleSubmit(onSubmitF1)();
    } else if (selectedContext === "h1b") {
      h1bForm.handleSubmit(onSubmitH1B)();
    } else if (selectedContext === "b1b2") {
      b1b2Form.handleSubmit(onSubmitB1B2)();
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 text-left w-full max-w-[640px] mx-auto">
      {/* Step Heading & Top-Right Action Buttons (Back + Continue) */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
            Step 02 of 03
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#141414] leading-tight">
            Provide essential context.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665F]">
            Add the details that shape your interview.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 mb-0.5">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#6B665F] hover:text-[#1A1916] font-medium px-3.5 py-2.5 rounded-full hover:bg-black/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-[#2C332A] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E8E2D8] shadow-[0_4px_22px_rgba(20,20,20,0.04)]">
        {selectedContext === "f1" && (
          <form onSubmit={f1Form.handleSubmit(onSubmitF1)} className="flex flex-col gap-3.5">
            {/* Row 1: University / Institution */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                University / Institution
              </label>
              <input
                {...f1Form.register("university")}
                placeholder="e.g. Carnegie Mellon University"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 2: Program & Specialization */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Program &amp; Specialization
              </label>
              <input
                {...f1Form.register("program")}
                placeholder="e.g. M.S. in Computer Science"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 3: Academic Background */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Academic Background
              </label>
              <textarea
                {...f1Form.register("academicBackground")}
                rows={2}
                placeholder="e.g. B.Tech in Computer Engineering"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all resize-none"
              />
            </div>
          </form>
        )}

        {selectedContext === "h1b" && (
          <form onSubmit={h1bForm.handleSubmit(onSubmitH1B)} className="flex flex-col gap-3.5">
            {/* Row 1: Petitioning Employer */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Petitioning Employer
              </label>
              <input
                {...h1bForm.register("employer")}
                placeholder="e.g. Anthos Systems Inc."
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 2: Specialty Role Title */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Specialty Role Title
              </label>
              <input
                {...h1bForm.register("role")}
                placeholder="e.g. Senior Infrastructure Engineer"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 3: Domain Experience Summary */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Domain Experience Summary
              </label>
              <textarea
                {...h1bForm.register("experience")}
                rows={2}
                placeholder="e.g. 5+ years building high-throughput low-latency distributed storage pipelines"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all resize-none"
              />
            </div>
          </form>
        )}

        {selectedContext === "b1b2" && (
          <form onSubmit={b1b2Form.handleSubmit(onSubmitB1B2)} className="flex flex-col gap-3.5">
            {/* Row 1: Trip Purpose & Intent */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Trip Purpose &amp; Intent
              </label>
              <input
                {...b1b2Form.register("purpose")}
                placeholder="e.g. Attending Annual Tech Summit"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 2: Trip Duration */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                Trip Duration
              </label>
              <input
                {...b1b2Form.register("duration")}
                placeholder="e.g. 10 Days"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all"
              />
            </div>

            {/* Row 3: U.S. Destination & Host / Itinerary */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#635E56] mb-1.5">
                U.S. Destination &amp; Host / Itinerary
              </label>
              <textarea
                {...b1b2Form.register("destination")}
                rows={2}
                placeholder="e.g. San Francisco & Silicon Valley for industry networking and partner meetings"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1916] placeholder-[#9E978C] focus:outline-none focus:border-[#141414] focus:bg-white transition-all resize-none"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
