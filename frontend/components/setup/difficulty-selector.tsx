"use client";

import * as React from "react";
import { useInterviewStore } from "@/store/interview-store";
import { InterviewDifficulty } from "@/types/interview";
import { ArrowLeft, Check, ChevronRight, Flame, Shield, Smile } from "lucide-react";

interface ModeOption {
  id: InterviewDifficulty;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

const MODES: ModeOption[] = [
  {
    id: "comfortable",
    number: "01",
    title: "Practice",
    subtitle: "Guided & Exploratory",
    description: "Gentle follow-ups with more room to think. Ideal for getting comfortable with the interview flow.",
    icon: <Smile className="w-4 h-4 text-[#485244]" />,
  },
  {
    id: "realistic",
    number: "02",
    title: "Realistic",
    subtitle: "Standard Interview",
    description: "Natural pacing, adaptive follow-ups, and realistic questioning based on your answers.",
    icon: <Shield className="w-4 h-4 text-[#485244]" />,
  },
  {
    id: "pressure",
    number: "03",
    title: "Pressure",
    subtitle: "Strict & Challenging",
    description: "Faster follow-ups, deeper probing, and less tolerance for vague or inconsistent answers.",
    icon: <Flame className="w-4 h-4 text-[#A25A24]" />,
  },
];

export function DifficultySelector() {
  const { difficulty, setDifficulty, setStep } = useInterviewStore();

  return (
    <div className="flex flex-col gap-4 sm:gap-5 text-left w-full">
      {/* Step Heading & Top-Right Action Buttons (Back + Continue) */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
            Step 03 of 03
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#141414] leading-tight">
            Choose your interview mode.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665F]">
            Set the pace and intensity of your conversation.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 mb-0.5">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#6B665F] hover:text-[#1A1916] font-medium px-3.5 py-2.5 rounded-full hover:bg-black/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(4)}
            className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-[#2C332A] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Balanced Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.map((mode) => {
          const isSelected = difficulty === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setDifficulty(mode.id)}
              className={`p-5 rounded-2xl border-[1.5px] text-left flex flex-col justify-between gap-4 cursor-pointer transition-all duration-200 group ${
                isSelected
                  ? "bg-white border-[#191919] shadow-[0_4px_22px_rgba(20,20,20,0.07)]"
                  : "bg-white/75 border-[#E8E2D8] hover:border-[#C5BCAD] hover:bg-white hover:shadow-xs"
              }`}
            >
              {/* Top Row: Icon + Number Badge + Selection Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#EAE4DA]">
                    {mode.icon}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#78736A]">
                    {mode.number}
                  </span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#191919] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-[#141414] tracking-tight">
                  {mode.title}
                </h3>
                <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A] leading-none">
                  {mode.subtitle}
                </span>
                <p className="text-xs text-[#6B665F] leading-relaxed pt-1">
                  {mode.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
