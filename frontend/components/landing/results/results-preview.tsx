"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_PERFORMANCE_REPORT } from "@/lib/mock/results";
import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function ResultsPreview() {
  const report = MOCK_PERFORMANCE_REPORT;
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(1);
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const gridContainerRef = React.useRef<HTMLDivElement>(null);

  const bigScoreRef = React.useRef<HTMLSpanElement>(null);
  const dimScoreRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const dimensions = report.dimensions;

  React.useEffect(() => {
    if (!sectionRef.current || !gridContainerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (bigScoreRef.current) {
        bigScoreRef.current.innerText = `${report.overallReadiness}`;
      }
      dimensions.forEach((dim, idx) => {
        const el = dimScoreRefs.current[idx];
        if (el) el.innerText = `${dim.score}%`;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Swipe transition from the right for the centered single-line heading
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          x: 90,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
        });
      }

      // Smooth upward reveal for the bento diagnostics stage
      gsap.from(gridContainerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
        y: 36,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
      });

      // Master Timeline for dynamic count-up transition of the 6 score boxes
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Big 82/100 box counter transition from 0 -> 82
      const bigCounter = { val: 0 };
      tl.to(
        bigCounter,
        {
          val: report.overallReadiness,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            if (bigScoreRef.current) {
              bigScoreRef.current.innerText = `${Math.round(bigCounter.val)}`;
            }
          },
        },
        0.1
      );

      // 2. 5 Dimension boxes counter transition from 0% -> final %
      dimensions.forEach((dim, idx) => {
        const dimCounter = { val: 0 };
        tl.to(
          dimCounter,
          {
            val: dim.score,
            duration: 1.35,
            ease: "power2.out",
            onUpdate: () => {
              const el = dimScoreRefs.current[idx];
              if (el) {
                el.innerText = `${Math.round(dimCounter.val)}%`;
              }
            },
          },
          0.18 + idx * 0.08
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [report.overallReadiness, dimensions]);

  return (
    <section
      id="results"
      ref={sectionRef}
      className="relative w-full pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-12 overflow-hidden"
    >
      {/* Centered Single-Line Heading with Right-to-Left Swipe Transition */}
      <div className="w-full flex justify-center text-center mb-10 sm:mb-14 py-1">
        <h2
          ref={headingRef}
          className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold tracking-[-0.03em] text-[#141414] leading-tight text-center will-change-transform"
        >
          Leave the room knowing what to work on.
        </h2>
      </div>

      {/* Main Results Grid: Tighter Gap Between Left & Right, Scaled One Size Up */}
      <div
        ref={gridContainerRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-center justify-items-center lg:justify-items-stretch"
      >
        {/* Left Side: Scaled-up Bento Grid (lg:col-span-6) */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-start">
          <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[530px]">
            {/* Big White Square 82/100 Block: Spans 2 cols & rows */}
            <div className="col-span-2 row-span-2 rounded-2xl bg-white border border-[#E6E0D6] p-5 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(28,24,18,0.04)] min-h-[224px] sm:min-h-[252px]">
              {/* Top Badge */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2C332A]" />
                <span className="text-[11px] sm:text-[11.5px] font-mono uppercase tracking-wider font-semibold text-[#2C332A]">
                  {report.readinessLabel}
                </span>
              </div>

              {/* Big Score with Count-Up Transition */}
              <div className="my-auto py-1">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-mono font-bold text-[#141414] tracking-tight leading-none">
                  <span ref={bigScoreRef}>0</span>
                  <span className="text-2xl sm:text-3xl text-[#8E887E] font-normal ml-0.5">
                    /100
                  </span>
                </span>
              </div>

              {/* Bottom Label */}
              <p className="text-xs sm:text-[13px] text-[#6B665F] leading-snug">
                Comprehensive communication &amp; readiness benchmark
              </p>
            </div>

            {/* Card 1: Top-Right of Big Card (Row 1, Col 3) */}
            {dimensions[0] && (
              <div className="rounded-2xl bg-white border border-[#E6E0D6] p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_3px_12px_rgba(28,24,18,0.03)] hover:border-[#D8D0C4] transition-all min-h-[105px] sm:min-h-[118px]">
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#736E66] truncate block">
                  {dimensions[0].dimension}
                </span>
                <span
                  ref={(el) => {
                    dimScoreRefs.current[0] = el;
                  }}
                  className="text-2xl sm:text-3xl font-mono font-bold text-[#141414] tracking-tight block leading-none"
                >
                  0%
                </span>
              </div>
            )}

            {/* Card 2: Mid-Right of Big Card (Row 2, Col 3) */}
            {dimensions[1] && (
              <div className="rounded-2xl bg-white border border-[#E6E0D6] p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_3px_12px_rgba(28,24,18,0.03)] hover:border-[#D8D0C4] transition-all min-h-[105px] sm:min-h-[118px]">
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#736E66] truncate block">
                  {dimensions[1].dimension}
                </span>
                <span
                  ref={(el) => {
                    dimScoreRefs.current[1] = el;
                  }}
                  className="text-2xl sm:text-3xl font-mono font-bold text-[#141414] tracking-tight block leading-none"
                >
                  0%
                </span>
              </div>
            )}

            {/* Card 3: Bottom-Left of Big Card (Row 3, Col 1) */}
            {dimensions[2] && (
              <div className="rounded-2xl bg-white border border-[#E6E0D6] p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_3px_12px_rgba(28,24,18,0.03)] hover:border-[#D8D0C4] transition-all min-h-[105px] sm:min-h-[118px]">
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#736E66] truncate block">
                  {dimensions[2].dimension}
                </span>
                <span
                  ref={(el) => {
                    dimScoreRefs.current[2] = el;
                  }}
                  className="text-2xl sm:text-3xl font-mono font-bold text-[#141414] tracking-tight block leading-none"
                >
                  0%
                </span>
              </div>
            )}

            {/* Card 4: Bottom-Center of Big Card (Row 3, Col 2) */}
            {dimensions[3] && (
              <div className="rounded-2xl bg-white border border-[#E6E0D6] p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_3px_12px_rgba(28,24,18,0.03)] hover:border-[#D8D0C4] transition-all min-h-[105px] sm:min-h-[118px]">
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#736E66] truncate block">
                  {dimensions[3].dimension}
                </span>
                <span
                  ref={(el) => {
                    dimScoreRefs.current[3] = el;
                  }}
                  className="text-2xl sm:text-3xl font-mono font-bold text-[#141414] tracking-tight block leading-none"
                >
                  0%
                </span>
              </div>
            )}

            {/* Card 5: Bottom-Right Corner (Row 3, Col 3) */}
            {dimensions[4] && (
              <div className="rounded-2xl bg-white border border-[#E6E0D6] p-4 sm:p-4.5 flex flex-col justify-between shadow-[0_3px_12px_rgba(28,24,18,0.03)] hover:border-[#D8D0C4] transition-all min-h-[105px] sm:min-h-[118px]">
                <span className="text-[11.5px] sm:text-[12.5px] font-medium text-[#736E66] truncate block">
                  {dimensions[4].dimension}
                </span>
                <span
                  ref={(el) => {
                    dimScoreRefs.current[4] = el;
                  }}
                  className="text-2xl sm:text-3xl font-mono font-bold text-[#141414] tracking-tight block leading-none"
                >
                  0%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: (lg:col-span-6) 4-Question Verbal Inquiry Audit Accordion */}
        <div className="lg:col-span-6 w-full flex flex-col my-auto">
          <div className="flex flex-col gap-2.5">
            {report.questions.map((q) => {
              const isExpanded = expandedQuestion === q.questionNumber;
              return (
                <div
                  key={q.questionNumber}
                  className="rounded-xl sm:rounded-2xl border border-[#E6E0D6] bg-white shadow-[0_3px_12px_rgba(28,24,18,0.03)] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedQuestion(isExpanded ? null : q.questionNumber)
                    }
                    className="w-full p-3.5 sm:p-4 text-left flex items-start sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                      <span className="font-mono text-[11px] font-semibold bg-[#2C332A] text-[#FAF8F5] px-2.5 py-0.5 rounded-md shrink-0 mt-0.5 sm:mt-0">
                        Q{q.questionNumber}
                      </span>
                      <span className="text-xs sm:text-[13.5px] font-medium text-[#141414] leading-snug">
                        {q.questionText}
                      </span>
                    </div>
                    <div className="shrink-0 text-[#78736A] ml-2 mt-0.5 sm:mt-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#2C332A]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8C867E]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 sm:p-4 pt-2 bg-white border-t border-[#F0EBE3] text-xs sm:text-[13px] text-[#4A453E] leading-relaxed">
                      <p>{q.candidateResponse}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
