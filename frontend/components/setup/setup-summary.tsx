"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/store/interview-store";
import { INTERVIEW_CONTEXTS } from "@/lib/constants/contexts";
import {
  ChevronRight,
  Edit3,
  Flame,
  GraduationCap,
  Briefcase,
  Globe,
  Shield,
  Smile,
  Sparkles,
  UserCheck,
} from "lucide-react";

export function SetupSummary() {
  const router = useRouter();
  const { selectedContext, difficulty, candidateProfile, setStep } = useInterviewStore();

  const contextDef =
    INTERVIEW_CONTEXTS.find((c) => c.id === selectedContext) || INTERVIEW_CONTEXTS[0];

  const difficultyLabels: Record<
    string,
    { number: string; title: string; subtitle: string; description: string; icon: React.ReactNode }
  > = {
    comfortable: {
      number: "01",
      title: "Practice",
      subtitle: "Guided & Exploratory",
      description: "Gentle follow-ups with more room to think. Ideal for getting comfortable with the interview flow.",
      icon: <Smile className="w-4 h-4 text-[#485244]" />,
    },
    realistic: {
      number: "02",
      title: "Realistic",
      subtitle: "Standard Interview",
      description: "Natural pacing, adaptive follow-ups, and realistic questioning based on your answers.",
      icon: <Shield className="w-4 h-4 text-[#485244]" />,
    },
    pressure: {
      number: "03",
      title: "Pressure",
      subtitle: "Strict & Challenging",
      description: "Faster follow-ups, deeper probing, and less tolerance for vague or inconsistent answers.",
      icon: <Flame className="w-4 h-4 text-[#A25A24]" />,
    },
  };

  const currentMode = difficultyLabels[difficulty] || difficultyLabels.realistic;

  const handleEnterInterview = () => {
    router.push("/interview");
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 text-left w-full">
      {/* Step Heading & Top-Right Action Buttons */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
            Review &amp; Launch
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#141414] leading-tight">
            Review your session setup.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665F]">
            Confirm your interview parameters before entering the simulation room.
          </p>
        </div>

        {/* Header Action Button */}
        <button
          type="button"
          onClick={handleEnterInterview}
          className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-[#2C332A] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 mb-0.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Begin</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Unified Summary Cards (Matching Steps 1 & 3 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 01: Selected Category */}
        <div className="relative rounded-2xl p-5 text-left border-[1.5px] border-[#E8E2D8] bg-white shadow-[0_4px_22px_rgba(20,20,20,0.04)] flex flex-col justify-between gap-4 group">
          {/* Top: Icon + Badge + Edit Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA]">
                {selectedContext === "f1" && <GraduationCap className="w-4 h-4 text-[#A25A24]" />}
                {selectedContext === "h1b" && <Briefcase className="w-4 h-4 text-[#485244]" />}
                {selectedContext === "b1b2" && <Globe className="w-4 h-4 text-[#2C5282]" />}
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#78736A]">
                01 — Category
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#78736A] hover:text-[#141414] inline-flex items-center gap-1 hover:underline cursor-pointer font-medium"
              title="Edit Category"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* Thumbnail preview */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#EAE4DA] border border-[#E8E2D8]">
            <Image
              src={contextDef.image}
              alt={contextDef.category}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 280px"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10.5px] font-mono font-medium">
              {contextDef.code}
            </div>
          </div>

          {/* Text Info */}
          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
              {contextDef.category} Track
            </span>
            <h3 className="text-base font-bold text-[#141414] tracking-tight">
              {contextDef.code} Interview
            </h3>
            <p className="text-xs text-[#6B665F] leading-relaxed line-clamp-2">
              {contextDef.headline}
            </p>
          </div>
        </div>

        {/* Card 02: Configured Context Details (3 Full Fields) */}
        <div className="relative rounded-2xl p-5 text-left border-[1.5px] border-[#E8E2D8] bg-white shadow-[0_4px_22px_rgba(20,20,20,0.04)] flex flex-col justify-between gap-4 group">
          {/* Top: Icon + Badge + Edit Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA]">
                <UserCheck className="w-4 h-4 text-[#A25A24]" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#78736A]">
                02 — Context
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs text-[#78736A] hover:text-[#141414] inline-flex items-center gap-1 hover:underline cursor-pointer font-medium"
              title="Edit Context Details"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* Key Parameters List (3 Balanced Rows) */}
          <div className="flex flex-col gap-2 my-auto py-1">
            {selectedContext === "f1" && (
              <>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    University / Institution
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.f1?.university || "Carnegie Mellon University"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Program &amp; Major
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.f1?.program || "M.S. in Computer Science"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Academic Background
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.f1?.academicBackground || "B.Tech in Computer Engineering"}
                  </span>
                </div>
              </>
            )}

            {selectedContext === "h1b" && (
              <>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Petitioning Employer
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.h1b?.employer || "Google LLC"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Specialty Role
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.h1b?.role || "Senior Software Engineer"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Domain Experience
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.h1b?.experience || "5+ years in distributed systems"}
                  </span>
                </div>
              </>
            )}

            {selectedContext === "b1b2" && (
              <>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Trip Purpose
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.b1b2?.purpose || "Tech Summit & Partner Meetings"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    Trip Duration
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.b1b2?.duration || "10 Days"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4DA]">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#807A70] block">
                    U.S. Destination
                  </span>
                  <span className="text-xs font-semibold text-[#141414] truncate block">
                    {candidateProfile.b1b2?.destination || "San Francisco, CA"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card 03: Selected Mode */}
        <div className="relative rounded-2xl p-5 text-left border-[1.5px] border-[#E8E2D8] bg-white shadow-[0_4px_22px_rgba(20,20,20,0.04)] flex flex-col justify-between gap-4 group">
          {/* Top: Icon + Badge + Edit Step */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA]">
                {currentMode.icon}
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#78736A]">
                03 — Mode
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs text-[#78736A] hover:text-[#141414] inline-flex items-center gap-1 hover:underline cursor-pointer font-medium"
              title="Edit Interview Mode"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          {/* Mode Visual Banner with Scenic Sky Background (Matches Card 01 Aspect Ratio) */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#EAE4DA] border border-[#E8E2D8]">
            <Image
              src="/images/visora-mode-bg.jpg"
              alt="Interview Atmosphere"
              fill
              className="object-cover object-[75%_25%]"
              sizes="(max-width: 768px) 100vw, 280px"
            />
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10.5px] font-mono font-medium">
              {currentMode.number}
            </div>
          </div>

          {/* Text Info (Matches Card 01 Typography and Hierarchy) */}
          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
              {currentMode.subtitle}
            </span>
            <h3 className="text-base font-bold text-[#141414] tracking-tight">
              {currentMode.title}&nbsp;Mode
            </h3>
            <p className="text-xs text-[#6B665F] leading-relaxed line-clamp-2">
              {currentMode.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
