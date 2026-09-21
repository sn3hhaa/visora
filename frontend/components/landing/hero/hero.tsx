"use client";

import * as React from "react";
import gsap from "gsap";
import { HeroImage } from "./hero-image";
import { HeroActions } from "./hero-actions";

export function Hero() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageWrapperRef = React.useRef<HTMLDivElement>(null);
  const textContentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(
        imageWrapperRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.05 }
      ).fromTo(
        textContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8 md:pb-10 lg:pb-12 flex flex-col"
    >
      {/* 1. Hero Artwork Container */}
      <div className="w-full">
        <HeroImage imageRef={imageWrapperRef} />
      </div>

      {/* 2. Headline, Subtitle & Action Buttons positioned between heading and subheading */}
      <div
        ref={textContentRef}
        className="mt-6 sm:mt-8 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8"
      >
        {/* Left Side: Headline & Subheading */}
        <div className="flex flex-col text-left max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] xl:text-[44px] font-bold leading-[1.14] tracking-[-0.025em] text-[#141414]">
            Practice the Conversation <br />
            Before it Becomes Real
          </h1>
          <p className="text-sm sm:text-[15.5px] lg:text-[16.5px] text-[#66625B] font-normal mt-3.5 leading-[1.55] max-w-xl">
            Realistic interview sessions that adapt to your answers, challenge vague responses,
            and show you how you communicate under pressure.
          </p>
        </div>

        {/* Right Side: Positioned slightly higher between heading and subheading */}
        <div className="w-full lg:w-auto flex justify-start lg:justify-end shrink-0 lg:translate-y-[-4px]">
          <HeroActions />
        </div>
      </div>
    </section>
  );
}
