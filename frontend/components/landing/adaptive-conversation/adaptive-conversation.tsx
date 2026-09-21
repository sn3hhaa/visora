"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, CornerDownRight, UserCheck, MessageSquare, CheckCircle2, ArrowDown, HelpCircle, GitBranch } from "lucide-react";
import { MOCK_ADAPTIVE_EXCHANGE } from "@/lib/mock/conversation";

interface AdaptiveConversationProps {
  imageSrc?: string;
}

export function AdaptiveConversation({
  imageSrc = "/images/visora-adaptive.jpg",
}: AdaptiveConversationProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLDivElement>(null);
  const dividerRef = React.useRef<HTMLDivElement>(null);
  const subparaRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);

  // Timeline section refs
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const timelineLineRef = React.useRef<HTMLDivElement>(null);
  const timelineProgressRef = React.useRef<HTMLDivElement>(null);

  const node1Ref = React.useRef<HTMLDivElement>(null);
  const node2Ref = React.useRef<HTMLDivElement>(null);
  const node3Ref = React.useRef<HTMLDivElement>(null);
  const node4Ref = React.useRef<HTMLDivElement>(null);
  const node5Ref = React.useRef<HTMLDivElement>(null);

  const exchange = MOCK_ADAPTIVE_EXCHANGE;

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Top Header Entrance: Image & Divider appear, Heading & Subpara swipe in
      const tlHeader = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
      });

      if (imageRef.current) {
        tlHeader.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" }
        );
      }

      if (dividerRef.current) {
        tlHeader.fromTo(
          dividerRef.current,
          { opacity: 0, scaleY: 0 },
          { opacity: 1, scaleY: 1, duration: 0.45, ease: "power2.out" },
          "-=0.3"
        );
      }

      if (headingRef.current) {
        tlHeader.fromTo(
          headingRef.current,
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" },
          "-=0.2"
        );
      }

      if (subparaRef.current) {
        tlHeader.fromTo(
          subparaRef.current,
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" },
          "<"
        );
      }

      // 2. Timeline Progress Fill on Scroll
      if (timelineProgressRef.current && timelineRef.current) {
        gsap.fromTo(
          timelineProgressRef.current,
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 65%",
              end: "bottom 75%",
              scrub: 0.5,
            },
          }
        );
      }

      // 3. Sequential Node Reveals along the Center Timeline
      const nodes = [node1Ref.current, node2Ref.current, node3Ref.current, node4Ref.current, node5Ref.current];
      nodes.forEach((node) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: node,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="platform"
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] pt-14 sm:pt-16 md:pt-20 lg:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 scroll-mt-12 overflow-hidden"
    >
      {/* 1. Top Header Block (50/50 Split) */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-14 items-center mb-14 sm:mb-16 lg:mb-20">
        {/* Left Content Column */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 lg:gap-7 justify-center lg:justify-end overflow-hidden py-2">
          {/* Main 3-line Stacked Heading (Swipes in from RIGHT) - 1 size down */}
          <div
            ref={headingRef}
            className="flex flex-col items-start sm:items-end text-left sm:text-right font-extrabold tracking-[-0.025em] leading-[1.04] text-[#141414] text-xl sm:text-xl md:text-2xl lg:text-[25px] xl:text-[28px] uppercase shrink-0 will-change-transform"
          >
            <span>THE.</span>
            <span>.NEXT QUESTION</span>
            <span>ISN&apos;T PREDETERMINED.</span>
          </div>

          {/* Center Vertical Divider Line */}
          <div
            ref={dividerRef}
            className="hidden sm:block w-[1px] h-16 md:h-20 bg-[#EDE7DE] shrink-0 origin-center will-change-transform"
          />

          {/* Sub-paragraph Text (Swipes in from LEFT) - 1 size down */}
          <div
            ref={subparaRef}
            className="flex flex-col justify-center max-w-[340px] will-change-transform"
          >
            <p className="text-[11px] sm:text-xs md:text-sm text-[#666159] font-normal leading-relaxed text-justify [text-align-last:left]">
              Scripted question lists fail when a real interview shifts. Visora listens to the exact substance
              of your answer, detects ambiguity or depth, and adapts the following inquiry in real time.
            </p>
          </div>
        </div>

        {/* Right Image Column - 1 size down */}
        <div ref={imageRef} className="w-full flex items-center justify-start will-change-transform max-w-[560px]">
          <div className="relative w-full aspect-[4/3] rounded-md sm:rounded-lg overflow-hidden shadow-[0_12px_36px_rgba(28,24,18,0.06)] border border-[#EBE5DC] bg-[#FAF8F5]">
            <Image
              src={imageSrc}
              alt="Consular Interview Session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* 2. Below Area: Center Vertical Timeline Track with 5 Milestones */}
      <div ref={timelineRef} className="relative max-w-4xl mx-auto py-6">
        {/* Central Vertical Timeline Rail */}
        <div
          ref={timelineLineRef}
          className="absolute top-4 bottom-8 left-1/2 -translate-x-1/2 w-[2px] bg-[#E8E2D8] rounded-full"
        >
          {/* Active Progress Fill Line */}
          <div
            ref={timelineProgressRef}
            className="absolute top-0 left-0 w-full bg-[#1C1B18] rounded-full origin-top"
            style={{ height: "0%" }}
          />
        </div>

        {/* 5 Milestone Nodes along the Center Timeline */}
        <div className="flex flex-col gap-12 sm:gap-16 relative z-10">
          {/* Node 1: Officer Inquiry */}
          <div ref={node1Ref} className="relative flex flex-col md:flex-row items-center w-full">
            {/* Left label / status */}
            <div className="w-full md:w-1/2 md:pr-10 text-center md:text-right mb-4 md:mb-0">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6E6961] bg-[#F2EDE5] px-3 py-1 rounded-full border border-[#E2DBD0]">
                Officer Inquiry
              </span>
            </div>

            {/* Center Circular Node */}
            <div className="relative z-20 w-9 h-9 rounded-full bg-[#1C1B18] text-white flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-md shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>

            {/* Right Card Content */}
            <div className="w-full md:w-1/2 md:pl-10 mt-4 md:mt-0">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E0D6] shadow-[0_6px_24px_rgba(28,24,18,0.04)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#68645E] mb-1">
                  Officer Inquiry
                </div>
                <p className="text-base sm:text-lg font-medium text-[#1A1916]">
                  &ldquo;{exchange.officerQuestion}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Node 2: Candidate Response */}
          <div ref={node2Ref} className="relative flex flex-col md:flex-row items-center w-full">
            {/* Left Card Content */}
            <div className="w-full md:w-1/2 md:pr-10 mb-4 md:mb-0 order-2 md:order-1">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E0D6] shadow-[0_6px_24px_rgba(28,24,18,0.04)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#68645E] mb-1">
                  Candidate Response
                </div>
                <p className="text-base sm:text-lg font-medium text-[#1A1916]">
                  &ldquo;{exchange.candidateResponse}&rdquo;
                </p>
              </div>
            </div>

            {/* Center Circular Node (Warm Amber) */}
            <div className="relative z-20 w-9 h-9 rounded-full bg-[#D49547] text-white flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-md shrink-0 order-1 md:order-2">
              <MessageSquare className="w-4 h-4" />
            </div>

            {/* Right label / status */}
            <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left mt-4 md:mt-0 order-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A25A24] bg-[#FDF2E8] px-3 py-1 rounded-full border border-[#F4D9C3]">
                Candidate Response
              </span>
            </div>
          </div>

          {/* Node 3: Interpretation & Cognitive Audit Node */}
          <div ref={node3Ref} className="relative flex flex-col md:flex-row items-center w-full">
            {/* Left label */}
            <div className="w-full md:w-1/2 md:pr-10 text-center md:text-right mb-4 md:mb-0">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6E6961] bg-[#F2EDE5] px-3 py-1 rounded-full border border-[#E2DBD0]">
                Cognitive Audit
              </span>
            </div>

            {/* Center Circular Node (Obsidian Dark) */}
            <div className="relative z-20 w-9 h-9 rounded-full bg-[#1C1B18] text-white flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-md shrink-0">
              <Cpu className="w-4 h-4" />
            </div>

            {/* Right Card Content */}
            <div className="w-full md:w-1/2 md:pl-10 mt-4 md:mt-0">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E0D6] shadow-[0_6px_24px_rgba(28,24,18,0.04)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#68645E] mb-1">
                  Interpretation &amp; Audit
                </div>
                <p className="text-base sm:text-lg font-medium text-[#1A1916]">
                  &ldquo;{exchange.analysis.critique}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Node 4: Adaptive Follow-Up Question */}
          <div ref={node4Ref} className="relative flex flex-col md:flex-row items-center w-full">
            {/* Left Card Content */}
            <div className="w-full md:w-1/2 md:pr-10 mb-4 md:mb-0 order-2 md:order-1">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E0D6] shadow-[0_6px_24px_rgba(28,24,18,0.04)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#68645E] mb-1">
                  Adaptive Follow-Up
                </div>
                <p className="text-base sm:text-lg font-medium text-[#1A1916]">
                  &ldquo;{exchange.officerFollowUp}&rdquo;
                </p>
              </div>
            </div>

            {/* Center Circular Node (Warm Amber) */}
            <div className="relative z-20 w-9 h-9 rounded-full bg-[#D49547] text-white flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-md shrink-0 order-1 md:order-2">
              <GitBranch className="w-4 h-4" />
            </div>

            {/* Right label */}
            <div className="w-full md:w-1/2 md:pl-10 text-center md:text-left mt-4 md:mt-0 order-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A25A24] bg-[#FDF2E8] px-3 py-1 rounded-full border border-[#F4D9C3]">
                Officer Follow-Up
              </span>
            </div>
          </div>

          {/* Node 5: Calibrated Refinement */}
          <div ref={node5Ref} className="relative flex flex-col md:flex-row items-center w-full">
            {/* Left label */}
            <div className="w-full md:w-1/2 md:pr-10 text-center md:text-right mb-4 md:mb-0">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6E6961] bg-[#F2EDE5] px-3 py-1 rounded-full border border-[#E2DBD0]">
                Calibrated Refinement
              </span>
            </div>

            {/* Center Circular Node (Obsidian Dark) */}
            <div className="relative z-20 w-9 h-9 rounded-full bg-[#1C1B18] text-white flex items-center justify-center ring-4 ring-[#FAF8F5] shadow-md shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            {/* Right Card Content */}
            <div className="w-full md:w-1/2 md:pl-10 mt-4 md:mt-0">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6E0D6] shadow-[0_6px_24px_rgba(28,24,18,0.04)]">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#68645E] mb-1">
                  Calibrated Refinement
                </div>
                <p className="text-base sm:text-lg font-medium text-[#1A1916]">
                  &ldquo;{exchange.refinedCandidateResponse}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
