"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UserCheck, Layers } from "lucide-react";
import { TreeWorkflowPreview } from "./tree-workflow-preview";
import { PipelinePreview } from "./pipeline-preview";

export function FeatureSection() {
  const containerRef = React.useRef<HTMLElement>(null);
  const leftColRef = React.useRef<HTMLDivElement>(null);
  const rightColRef = React.useRef<HTMLDivElement>(null);
  const visualPanelRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header Entrance Timeline
      const tlHeader = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      if (leftColRef.current) {
        tlHeader.fromTo(
          leftColRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );
      }

      if (rightColRef.current?.children) {
        tlHeader.fromTo(
          Array.from(rightColRef.current.children),
          { opacity: 0, y: 25, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 0.75,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }

      // 2. Large Visual Panel Reveal
      if (visualPanelRef.current) {
        gsap.fromTo(
          visualPanelRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: visualPanelRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. Floating Cards Entrance with subtle tilt/slide
      if (card1Ref.current && card2Ref.current) {
        gsap.fromTo(
          card1Ref.current,
          { opacity: 0, y: 35, x: -20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: visualPanelRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          card2Ref.current,
          { opacity: 0, y: 35, x: 20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: visualPanelRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative w-full pt-6 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:pb-12 bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-12"
    >
      {/* Top Header Block (Expanded Width: Left to the Left, Right to the Right) */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-14 mb-12 sm:mb-16">
        {/* Left Column: Title & Sub-paragraph (Anchored Left) */}
        <div ref={leftColRef} className="w-full lg:max-w-[480px] flex flex-col items-start pt-0 will-change-transform">
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[45px] font-bold tracking-[-0.03em] text-[#141414] leading-[1.08] mb-3.5">
            The conversation <br />
            adapts as you speak.
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#68645E] max-w-[430px] leading-relaxed">
            Visora tracks context, conversation state, and response signals to shape what comes next.
          </p>
        </div>

        {/* Right Column: 2 Stacked Feature Items (Pushed to the Right) */}
        <div ref={rightColRef} className="w-full lg:max-w-[440px] flex flex-col gap-5 sm:gap-6 pt-0.5 will-change-transform">
          {/* Feature 1 */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#2C2A26] shadow-2xs mt-0.5">
              <UserCheck className="w-5 h-5 text-[#2C2A26]" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base sm:text-[17px] font-semibold text-[#141414] leading-snug">
                Adaptive Conversation
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6961] leading-relaxed mt-1">
                Dynamic questioning that probes your specific context, clarifies answers, and adapts inquiries in real time.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F4EFEA] border border-[#E8E2D8] flex items-center justify-center shrink-0 text-[#2C2A26] shadow-2xs mt-0.5">
              <Layers className="w-5 h-5 text-[#2C2A26]" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base sm:text-[17px] font-semibold text-[#141414] leading-snug">
                Performance Intelligence
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6E6961] leading-relaxed mt-1">
                Instant speech telemetry measuring clarity, specificity, pace, and delivery consistency with actionable review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Large Visual Panel with Scenic Backdrop & Floating White Cards */}
      <div
        ref={visualPanelRef}
        className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden border border-[#DDD6C9] shadow-[0_24px_70px_rgba(28,24,18,0.1)] p-5 sm:p-7 lg:p-8 will-change-transform bg-[#EBE5DC]"
      >
        {/* Scenic Background Image */}
        <Image
          src="/images/visora-features.jpg"
          alt="Visora Features Scenic Architecture Backdrop"
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          quality={75}
        />

        {/* Subtle Atmospheric Filter */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {/* 2 White Floating Diagram Cards with exact proportions scaled altogether */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1000px] mx-auto items-stretch [zoom:0.9] sm:[zoom:0.92]">
          <div ref={card1Ref} className="h-full transition-transform duration-300 hover:-translate-y-1">
            <TreeWorkflowPreview />
          </div>
          <div ref={card2Ref} className="h-full transition-transform duration-300 hover:-translate-y-1">
            <PipelinePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
