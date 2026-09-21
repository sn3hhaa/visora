"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function FinalCta() {
  const items = [
    "Walk in prepared.",
    "Practice the conversation before it becomes real.",
    "Walk in prepared.",
    "Practice the conversation before it becomes real.",
    "Walk in prepared.",
    "Practice the conversation before it becomes real.",
    "Walk in prepared.",
    "Practice the conversation before it becomes real.",
  ];

  return (
    <div className="w-full bg-[#FAF8F5] overflow-hidden flex flex-col items-center">
      {/* 1. Infinite Horizontal Moving Marquee Strip */}
      <section className="relative w-full py-2.5 sm:py-3 md:py-3.5 mt-10 sm:mt-14 md:mt-16 mb-8 sm:mb-10 bg-[#FAF8F5] border-y border-[#EAE4DA] overflow-hidden select-none">
        {/* Edge gradient fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

        <div className="flex w-max will-change-transform animate-marquee hover:[animation-play-state:paused]">
          {/* First copy */}
          <div className="flex items-center shrink-0">
            {items.map((phrase, idx) => (
              <span
                key={`phrase-1-${idx}`}
                className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold tracking-[-0.02em] text-[#141414] whitespace-nowrap px-6 sm:px-10 md:px-12"
              >
                {phrase}
              </span>
            ))}
          </div>

          {/* Second copy for seamless infinite loop */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {items.map((phrase, idx) => (
              <span
                key={`phrase-2-${idx}`}
                className="text-lg sm:text-xl md:text-2xl lg:text-[28px] font-semibold tracking-[-0.02em] text-[#141414] whitespace-nowrap px-6 sm:px-10 md:px-12"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* 2. Main Centered Editorial CTA Section */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28 flex flex-col items-center text-center">
        {/* Fresh High-Impact Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#141414] tracking-tight leading-[1.15] text-center mb-7 sm:mb-9">
          Know exactly how you sound. <br />
          Before the conversation begins.
        </h2>

        {/* Centered Black Pill Button with Chevron */}
        <Link
          href="/setup"
          className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0A0A0A] hover:bg-[#2C332A] text-white text-sm sm:text-[15px] font-medium transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          <span>Try Visora</span>
          <ChevronRight className="w-4 h-4 text-white/90" />
        </Link>
      </section>
    </div>
  );
}
