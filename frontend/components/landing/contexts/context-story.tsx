"use client";

import * as React from "react";
import Image from "next/image";
import { setupContextStoryTimeline } from "@/lib/animations/context-story-animation";
import { INTERVIEW_CONTEXTS } from "@/lib/constants/contexts";

export function ContextStory() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const pinWrapperRef = React.useRef<HTMLDivElement>(null);
  const introHeaderRef = React.useRef<HTMLDivElement>(null);
  const card1Ref = React.useRef<HTMLDivElement>(null);
  const card2Ref = React.useRef<HTMLDivElement>(null);
  const card3Ref = React.useRef<HTMLDivElement>(null);
  const textF1Ref = React.useRef<HTMLDivElement>(null);
  const textH1BRef = React.useRef<HTMLDivElement>(null);
  const textB1B2Ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      prefersReducedMotion ||
      !sectionRef.current ||
      !pinWrapperRef.current ||
      !introHeaderRef.current ||
      !card1Ref.current ||
      !card2Ref.current ||
      !card3Ref.current ||
      !textF1Ref.current ||
      !textH1BRef.current ||
      !textB1B2Ref.current
    ) {
      return;
    }

    const cleanup = setupContextStoryTimeline({
      section: sectionRef.current,
      pinWrapper: pinWrapperRef.current,
      introHeader: introHeaderRef.current,
      card1: card1Ref.current,
      card2: card2Ref.current,
      card3: card3Ref.current,
      textF1: textF1Ref.current,
      textH1B: textH1BRef.current,
      textB1B2: textB1B2Ref.current,
    });

    return () => cleanup();
  }, []);

  const f1 = INTERVIEW_CONTEXTS[0];
  const h1b = INTERVIEW_CONTEXTS[1];
  const b1b2 = INTERVIEW_CONTEXTS[2];

  return (
    <section
      id="contexts"
      ref={sectionRef}
      className="relative w-full bg-[#FAF8F5] border-t border-[#EDE7DE] scroll-mt-12 overflow-hidden"
    >
      <div
        ref={pinWrapperRef}
        className="relative h-screen w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-between pt-20 sm:pt-22 pb-[19px] overflow-hidden"
      >
        {/* Intro Grand Editorial Header */}
        <div className="w-full flex items-center justify-center pt-1 pb-2 shrink-0 z-30">
          <div
            ref={introHeaderRef}
            className="flex items-center justify-center will-change-transform origin-top text-center px-4 max-w-full"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] 2xl:text-[60px] font-bold tracking-[-0.03em] text-[#141414] leading-tight whitespace-nowrap text-center">
              Different Contexts. Different Conversations.
            </h2>
          </div>
        </div>

        {/* Visual Stage Area - Strict 0.5cm (19px) bottom space */}
        <div className="relative flex-1 w-full flex items-end justify-center min-h-0">
          {/* F-1 Visa Tag with Maroon Accent Bar (Act 1: Flush right-aligned to Image 2's right border) */}
          <div
            ref={textF1Ref}
            className="absolute top-3 sm:top-5 md:top-8 lg:top-10 left-1/2 flex items-center justify-end pointer-events-none z-30 box-border gap-2 sm:gap-2.5 overflow-hidden py-1 px-0.5"
          >
            <span
              data-f1-label
              className="text-xs sm:text-[13px] md:text-sm font-mono font-bold tracking-[0.20em] text-[#141414] uppercase text-right whitespace-nowrap will-change-transform"
            >
              {f1.number} · {f1.code} VISA
            </span>
            <span
              data-f1-line
              className="w-[2px] sm:w-[2.5px] h-4.5 sm:h-5 md:h-6 rounded-full bg-[#802626] shrink-0 will-change-transform origin-center"
            />
          </div>

          {/* H-1B Visa Tag with Maroon Accent Bar (Act 2: Flush right-aligned to Image 3's right border) */}
          <div
            ref={textH1BRef}
            className="absolute top-3 sm:top-5 md:top-8 lg:top-10 left-1/2 flex items-center justify-end pointer-events-none z-30 box-border gap-2 sm:gap-2.5 overflow-hidden py-1 px-0.5"
          >
            <span
              data-h1b-label
              className="text-xs sm:text-[13px] md:text-sm font-mono font-bold tracking-[0.20em] text-[#141414] uppercase text-right whitespace-nowrap will-change-transform"
            >
              {h1b.number} · {h1b.code} VISA
            </span>
            <span
              data-h1b-line
              className="w-[2px] sm:w-[2.5px] h-4.5 sm:h-5 md:h-6 rounded-full bg-[#802626] shrink-0 will-change-transform origin-center"
            />
          </div>

          {/* B1/B2 Visa Tag with Maroon Accent Bar (Act 3: Flush right-aligned in top right area) */}
          <div
            ref={textB1B2Ref}
            className="absolute top-3 sm:top-5 md:top-8 lg:top-10 left-1/2 flex items-center justify-end pointer-events-none z-30 box-border gap-2 sm:gap-2.5 overflow-hidden py-1 px-0.5"
          >
            <span
              data-b1b2-label
              className="text-xs sm:text-[13px] md:text-sm font-mono font-bold tracking-[0.20em] text-[#141414] uppercase text-right whitespace-nowrap will-change-transform"
            >
              {b1b2.number} · {b1b2.code} VISA
            </span>
            <span
              data-b1b2-line
              className="w-[2px] sm:w-[2.5px] h-4.5 sm:h-5 md:h-6 rounded-full bg-[#802626] shrink-0 will-change-transform origin-center"
            />
          </div>

          {/* Card 1 Frame (Academic - Native 823x1024) */}
          <div
            ref={card1Ref}
            className="relative h-[420px] sm:h-[540px] md:h-[620px] lg:h-[700px] xl:h-[740px] max-h-[82vh] aspect-[823/1024] rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#EDE7DE] shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-[#E8E2D8] will-change-transform origin-bottom z-10"
          >
            <Image
              src={f1.image}
              alt="Visora Academic Context"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 750px"
            />
          </div>

          {/* Card 2 Frame (Professional - Native 764x1024) */}
          <div
            ref={card2Ref}
            className="absolute bottom-0 left-1/2 h-[420px] sm:h-[540px] md:h-[620px] lg:h-[700px] xl:h-[740px] max-h-[82vh] aspect-[764/1024] rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#EDE7DE] shadow-[0_16px_40px_rgba(0,0,0,0.10)] bg-[#E8E2D8] will-change-transform origin-bottom-left z-20 cursor-pointer"
          >
            <Image
              src={h1b.image}
              alt="Visora Professional Context"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 750px"
            />
          </div>

          {/* Card 3 Frame (Visitor - Native 818x1024) */}
          <div
            ref={card3Ref}
            className="absolute bottom-0 left-1/2 h-[420px] sm:h-[540px] md:h-[620px] lg:h-[700px] xl:h-[740px] max-h-[82vh] aspect-[818/1024] rounded-[24px] sm:rounded-[36px] overflow-hidden border border-[#EDE7DE] shadow-[0_16px_40px_rgba(0,0,0,0.10)] bg-[#E8E2D8] will-change-transform origin-bottom-left z-20 cursor-pointer"
          >
            <Image
              src={b1b2.image}
              alt="Visora Visitor Context Preview"
              fill
              priority
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 750px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
