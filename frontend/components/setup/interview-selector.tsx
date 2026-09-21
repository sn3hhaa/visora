"use client";

import * as React from "react";
import Image from "next/image";
import { INTERVIEW_CONTEXTS } from "@/lib/constants/contexts";
import { useInterviewStore } from "@/store/interview-store";
import { InterviewContextId } from "@/types/context";
import { Check, ChevronRight } from "lucide-react";

export function InterviewSelector() {
  const { selectedContext, setSelectedContext, setStep } = useInterviewStore();

  const handleSelect = (id: InterviewContextId) => {
    setSelectedContext(id);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      {/* Step Heading & Top-Right Continue Action (Aligned with Steps 2 & 3) */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
            Step 01 of 03
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-[#141414] leading-tight">
            Choose your interview category.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665F]">
            Each category configures the consular officer&apos;s evidentiary framework and inquiry depth.
          </p>
        </div>

        {/* Header Continue Button */}
        <div className="flex items-center gap-2 shrink-0 mb-0.5">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-[#2C332A] text-[#FAF8F5] px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Balanced Category Cards with Distinct Bold Selection Border */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INTERVIEW_CONTEXTS.map((ctx) => {
          const isSelected = selectedContext === ctx.id;
          return (
            <button
              key={ctx.id}
              type="button"
              onClick={() => handleSelect(ctx.id)}
              className={`relative rounded-2xl p-4 text-left border-2 transition-all duration-200 flex flex-col justify-between gap-3.5 cursor-pointer group ${
                isSelected
                  ? "bg-white border-[#141414] shadow-[0_8px_28px_rgba(20,20,20,0.09)] ring-1 ring-[#141414]"
                  : "bg-white/70 border-[#E8E2D8] hover:border-[#D6CEC0] hover:bg-white"
              }`}
            >
              {/* Image thumbnail with natural 16:10 aspect ratio */}
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#EAE4DA]">
                <Image
                  src={ctx.image}
                  alt={ctx.category}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 260px"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide">
                  {ctx.code}
                </div>
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#141414] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#78736A]">
                  {ctx.category}
                </span>
                <h3 className="text-[15px] font-bold text-[#141414] tracking-tight">
                  {ctx.code} Dialogues
                </h3>
                <p className="text-xs text-[#6B665F] leading-relaxed line-clamp-2">
                  {ctx.headline}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
