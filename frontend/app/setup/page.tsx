"use client";

import * as React from "react";
import Link from "next/link";
import { useInterviewStore } from "@/store/interview-store";
import { InterviewSelector } from "@/components/setup/interview-selector";
import { ContextForm } from "@/components/setup/context-form";
import { DifficultySelector } from "@/components/setup/difficulty-selector";
import { SetupSummary } from "@/components/setup/setup-summary";

export default function SetupPage() {
  const { currentStep, setStep } = useInterviewStore();

  React.useEffect(() => {
    setStep(1);
  }, [setStep]);

  const stepLabels = [
    { num: 1, label: "Category" },
    { num: 2, label: "Context" },
    { num: 3, label: "Mode" },
    { num: 4, label: "Summary" },
  ];

  return (
    <main className="min-h-screen w-full bg-[#FAF8F5] text-[#1A1916] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8 select-none relative">
      {/* Floating Dark Pill Navbar - Exact Position & Style of Homepage */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Setup Navigation"
          className="pointer-events-auto flex items-center justify-between bg-[#191919] text-white px-5 sm:px-6 py-2 rounded-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] max-w-[640px] w-full min-h-[44px]"
        >
          {/* Left: Brand Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 hover:opacity-90 transition-opacity focus-visible:outline-none"
          >
            <img
              src="/images/visora-logo-white.png"
              alt="Visora"
              className="h-3.5 sm:h-4 w-auto object-contain mix-blend-screen"
            />
          </Link>

          {/* Center: Clean Text Steps (Identical font & style as homepage navbar) */}
          <div className="flex items-center gap-6 text-[13px] font-normal text-[#B5B0A6] whitespace-nowrap">
            {stepLabels.map((s) => {
              const isActive = currentStep === s.num;
              const isCompleted = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (isCompleted) setStep(s.num);
                  }}
                  className={`text-[13px] font-normal transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-[#B5B0A6] hover:text-white cursor-pointer"
                      : "text-[#B5B0A6]/50 cursor-default"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Right: Exit White Pill Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white text-[#191919] hover:bg-[#F2EDE5] text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-150 shadow-sm active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Exit</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Step Content: Centered with ample breathing room from the top navbar */}
      <div className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto overflow-hidden">
        {currentStep === 1 && <InterviewSelector />}
        {currentStep === 2 && <ContextForm />}
        {currentStep === 3 && <DifficultySelector />}
        {currentStep === 4 && <SetupSummary />}
      </div>
    </main>
  );
}
