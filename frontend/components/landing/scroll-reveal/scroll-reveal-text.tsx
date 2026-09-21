"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealTextProps {
  text?: string;
}

export function ScrollRevealText({
  text = "Imagine looking forward to your consular interview. And forgetting what uncertainty feels like. When preparation is precision-engineered for your exact context, confidence is inevitable.",
}: ScrollRevealTextProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const textRef = React.useRef<HTMLHeadingElement>(null);

  const words = React.useMemo(() => text.split(" "), [text]);

  React.useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current || !textRef.current) {
      return;
    }

    const wordElements = textRef.current.querySelectorAll<HTMLSpanElement>(".reveal-word");

    const ctx = gsap.context(() => {
      // Word-by-word opacity and color scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 55%",
          scrub: 0.6,
        },
      });

      tl.to(wordElements, {
        color: "#141414",
        opacity: 1,
        stagger: 0.08,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [words]);

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-8 sm:pt-10 md:pt-12 lg:pt-14 pb-6 sm:pb-8 md:pb-10 lg:pb-12 bg-[#FAF8F5] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left">
        {/* Scroll-Driven Kinetic Highlight Statement (Full-width balanced justification) */}
        <h2
          ref={textRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] 2xl:text-[56px] font-bold tracking-[-0.025em] leading-[1.24] sm:leading-[1.22] md:leading-[1.20] text-justify [text-align-last:left] w-full"
        >
          {words.map((word, i) => (
            <React.Fragment key={i}>
              <span className="reveal-word inline text-[#141414]/20 opacity-30 will-change-[color,opacity] transition-colors">
                {word}
              </span>
              {i < words.length - 1 && " "}
            </React.Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}
