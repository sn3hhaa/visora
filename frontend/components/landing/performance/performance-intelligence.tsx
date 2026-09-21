"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOCK_SIGNALS } from "@/lib/mock/analytics";
import { Gauge, HelpCircle, PauseCircle, Timer } from "lucide-react";

interface CircularTelemetryDialProps {
  label: string;
  rawNumber: number;
  isDecimal?: boolean;
  suffix?: string;
  sub: string;
  icon: React.ReactNode;
  percent: number;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  delay?: number;
  strokeColor?: string;
  trackColor?: string;
  iconColor?: string;
}

function CircularTelemetryDial({
  label,
  rawNumber,
  isDecimal = false,
  suffix = "",
  sub,
  icon,
  percent,
  triggerRef,
  delay = 0,
  strokeColor = "#2D5A43",
  trackColor = "#EDE6DC",
  iconColor = "#2D5A43",
}: CircularTelemetryDialProps) {
  const circleRef = React.useRef<SVGCircleElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const numberRef = React.useRef<HTMLSpanElement>(null);

  const radius = 43;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percent / 100);

  React.useEffect(() => {
    if (!circleRef.current || !contentRef.current || !triggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(circleRef.current, { strokeDashoffset: targetOffset });
      gsap.set(contentRef.current, { opacity: 1, scale: 1 });
      if (numberRef.current) {
        numberRef.current.innerText = isDecimal
          ? rawNumber.toFixed(1) + suffix
          : Math.round(rawNumber) + (suffix ? " " + suffix : "");
      }
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(circleRef.current, {
        strokeDashoffset: circumference,
      });
      gsap.set(contentRef.current, {
        opacity: 0,
        scale: 0.85,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(
        circleRef.current,
        {
          strokeDashoffset: targetOffset,
          duration: 1.4,
          ease: "power2.out",
        },
        delay
      );

      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: rawNumber,
          duration: 1.3,
          ease: "power2.out",
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.innerText = isDecimal
                ? counterObj.val.toFixed(1) + suffix
                : Math.round(counterObj.val) + (suffix ? " " + suffix : "");
            }
          },
        },
        delay + 0.1
      );

      tl.to(
        contentRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        delay + 0.4
      );
    }, triggerRef);

    return () => ctx.revert();
  }, [circumference, targetOffset, rawNumber, isDecimal, suffix, triggerRef, delay]);

  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative w-[140px] h-[140px] sm:w-[155px] sm:h-[155px] aspect-square shrink-0 rounded-full bg-white shadow-[0_6px_24px_rgba(28,24,18,0.05)] flex flex-col items-center justify-center text-center p-3 transition-all duration-300 group-hover:shadow-[0_12px_32px_rgba(28,24,18,0.09)] group-hover:-translate-y-1 mb-2.5 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={trackColor}
            strokeWidth="3.2"
            fill="none"
          />
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ strokeDashoffset: circumference }}
          />
        </svg>

        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center justify-center will-change-transform px-1.5"
          style={{ opacity: 0 }}
        >
          <div
            style={{ color: iconColor }}
            className="mb-1.5 transition-transform duration-300 group-hover:scale-110 shrink-0"
          >
            {icon}
          </div>
          <span
            ref={numberRef}
            className="text-xl sm:text-2xl font-mono font-bold text-[#141414] tracking-tight leading-none"
          >
            {isDecimal ? `0.0${suffix}` : `0${suffix ? " " + suffix : ""}`}
          </span>
          <span className="text-[9.5px] sm:text-[10.5px] text-[#78736A] max-w-[95px] sm:max-w-[110px] leading-tight mt-1.5 truncate">
            {sub}
          </span>
        </div>
      </div>

      <h4 className="text-xs sm:text-[13.5px] font-semibold text-[#141414] tracking-tight leading-snug">
        {label}
      </h4>
    </div>
  );
}

/**
 * Animated Cadence Telemetry Graph - Live Timeline Tracker
 */
function SpeakingCadenceGraph({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const pathRef = React.useRef<SVGPathElement>(null);
  const verticalLineRef = React.useRef<SVGLineElement>(null);
  const dotRef = React.useRef<SVGGElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const tooltipTextRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (
      !pathRef.current ||
      !verticalLineRef.current ||
      !dotRef.current ||
      !tooltipRef.current ||
      !tooltipTextRef.current ||
      !triggerRef.current
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const path = pathRef.current;
    const totalLength = path.getTotalLength();

    const computeWpm = (y: number) => {
      const normalized = (180 - y) / (180 - 80);
      const wpm = 130 + normalized * (155 - 130);
      return Math.round(Math.max(120, Math.min(160, wpm)));
    };

    const updateTracker = (progress: number) => {
      if (!pathRef.current || !verticalLineRef.current || !dotRef.current || !tooltipRef.current) return;

      const currentDistance = Math.max(0.1, progress * totalLength);
      path.style.strokeDashoffset = `${totalLength - currentDistance}`;

      const point = path.getPointAtLength(currentDistance);

      verticalLineRef.current.setAttribute("x1", `${point.x}`);
      verticalLineRef.current.setAttribute("y1", `${point.y}`);
      verticalLineRef.current.setAttribute("x2", `${point.x}`);
      verticalLineRef.current.setAttribute("y2", "215");

      dotRef.current.setAttribute("transform", `translate(${point.x}, ${point.y})`);

      const pctX = (point.x / 520) * 100;
      const pctY = (point.y / 240) * 100;
      tooltipRef.current.style.left = `${pctX}%`;
      tooltipRef.current.style.top = `${pctY}%`;

      if (tooltipTextRef.current) {
        if (progress >= 0.98) {
          tooltipTextRef.current.innerText = "+142 WPM";
        } else {
          const liveWpm = computeWpm(point.y);
          tooltipTextRef.current.innerText = `${liveWpm} WPM`;
        }
      }
    };

    if (prefersReducedMotion) {
      updateTracker(1);
      gsap.set([dotRef.current, verticalLineRef.current, tooltipRef.current], { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      path.style.strokeDasharray = `${totalLength}`;
      path.style.strokeDashoffset = `${totalLength}`;
      gsap.set([dotRef.current, verticalLineRef.current], { opacity: 0 });
      gsap.set(tooltipRef.current, { opacity: 0, scale: 0.7 });

      const trackerObj = { progress: 0 };

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 68%",
          toggleActions: "play none none reverse",
        },
      });

      masterTl.to(
        [dotRef.current, verticalLineRef.current, tooltipRef.current],
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          onStart: () => updateTracker(0.01),
        }
      );

      masterTl.to(
        trackerObj,
        {
          progress: 1,
          duration: 2.6,
          ease: "power2.inOut",
          onUpdate: () => {
            updateTracker(trackerObj.progress);
          },
        },
        "-=0.1"
      );

      masterTl.to(
        tooltipRef.current,
        {
          scale: 1.08,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        "+=0.05"
      );
    }, triggerRef);

    return () => ctx.revert();
  }, [triggerRef]);

  return (
    <div className="relative w-full h-full p-6 sm:p-8 rounded-3xl bg-white border border-[#E6E0D6] shadow-[0_6px_28px_rgba(28,24,18,0.04)] flex flex-col justify-between overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4 mb-4 z-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] leading-[1.1]">
            Speaking Pace Cadence
          </h3>
          <p className="text-xs text-[#78736A] mt-1.5 font-normal">
            Continuous stability monitoring against 130–155 WPM envelope
          </p>
        </div>

        {/* Live Cadence Badge */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E8E2D8] px-3 py-1.5 rounded-full text-xs font-mono text-[#2C332A] shadow-2xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">
            Optimal
          </span>
        </div>
      </div>

      {/* Interactive Wave Stage */}
      <div className="relative w-full h-64 sm:h-72 my-auto">
        {/* Floating Tooltip Pill */}
        <div
          ref={tooltipRef}
          className="absolute z-30 -translate-x-1/2 -translate-y-[125%] pointer-events-none will-change-transform"
          style={{ left: "88%", top: "30%", opacity: 0 }}
        >
          <div className="relative bg-[#141414] text-white text-xs sm:text-[13px] font-mono font-bold px-3 py-1.5 rounded-lg shadow-[0_8px_20px_rgba(20,20,20,0.25)] flex items-center gap-1 whitespace-nowrap">
            <span ref={tooltipTextRef}>+142 WPM</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#141414]" />
          </div>
        </div>

        {/* SVG Graphic with Guidelines and Animated Wave Line */}
        <svg
          viewBox="0 0 520 240"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Upper Threshold Guideline (155 WPM) */}
          <g className="opacity-70">
            <line
              x1="20"
              y1="80"
              x2="500"
              y2="80"
              stroke="#D8D1C5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x="505"
              y="84"
              fill="#A49E93"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="start"
            >
              155
            </text>
          </g>

          {/* Lower Threshold Guideline (130 WPM) */}
          <g className="opacity-70">
            <line
              x1="20"
              y1="180"
              x2="500"
              y2="180"
              stroke="#D8D1C5"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x="505"
              y="184"
              fill="#A49E93"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="start"
            >
              130
            </text>
          </g>

          {/* Vertical Drop Marker Guide Line */}
          <line
            ref={verticalLineRef}
            x1="35"
            y1="195"
            x2="35"
            y2="215"
            stroke="#D8D1C5"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Main Cadence Trend Line in Website Signature Deep Botanical Pine (#2C332A) */}
          <path
            ref={pathRef}
            d="M 35 195 C 100 195, 120 100, 165 100 C 210 100, 240 170, 295 170 C 355 170, 395 72, 460 72"
            fill="none"
            stroke="#2C332A"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Endpoint / Moving Dot Marker */}
          <g ref={dotRef} transform="translate(35, 195)">
            <circle cx="0" cy="0" r="10" fill="#2C332A" fillOpacity="0.15" />
            <circle cx="0" cy="0" r="5.5" fill="#2C332A" />
          </g>
        </svg>
      </div>

      {/* Bottom Timeline Indicator */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#888278] pt-2 border-t border-[#F2ECE4] z-10">
        <span>0:00 (Start)</span>
        <span>1:15 (Follow-up 1)</span>
        <span>2:30 (Deep Probe)</span>
        <span className="text-[#141414] font-semibold">4:30 (Current)</span>
      </div>
    </div>
  );
}

export function PerformanceIntelligence() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const dialsGridRef = React.useRef<HTMLDivElement>(null);
  const signals = MOCK_SIGNALS;

  const statCardsData = [
    {
      label: "Speaking Pace",
      rawNumber: signals.speakingPaceWpm,
      suffix: "WPM",
      sub: "Target: 130 - 155 WPM",
      icon: <Gauge className="w-5 h-5" />,
      percent: 88,
      delay: 0,
      strokeColor: "#2D5A43", // 1. Forest Pine Green
      trackColor: "#E4EDE6",
      iconColor: "#2D5A43",
    },
    {
      label: "Fillers",
      rawNumber: signals.fillerCount,
      suffix: "",
      sub: "Detected in session",
      icon: <HelpCircle className="w-5 h-5" />,
      percent: 30,
      delay: 0.15,
      strokeColor: "#C45A2C", // 2. Warm Terracotta / Amber
      trackColor: "#FCEEE7",
      iconColor: "#C45A2C",
    },
    {
      label: "Average Pause",
      rawNumber: signals.averagePauseSeconds,
      isDecimal: true,
      suffix: "s",
      sub: "Natural cadence",
      icon: <PauseCircle className="w-5 h-5" />,
      percent: 75,
      delay: 0.3,
      strokeColor: "#2B5B75", // 3. Aegean Slate Blue
      trackColor: "#E5EFF5",
      iconColor: "#2B5B75",
    },
    {
      label: "Response Duration",
      rawNumber: signals.responseDurationSeconds,
      suffix: "s",
      sub: "Average per inquiry",
      icon: <Timer className="w-5 h-5" />,
      percent: 82,
      delay: 0.45,
      strokeColor: "#7D4E38", // 4. Heritage Walnut Bronze
      trackColor: "#F7ECE4",
      iconColor: "#7D4E38",
    },
  ];

  return (
    <section
      id="performance"
      ref={sectionRef}
      className="relative w-full pt-10 sm:pt-12 md:pt-14 pb-14 sm:pb-16 md:pb-20 bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-12"
    >
      {/* Top Header Block: Left-Aligned Headline & Subtitle */}
      <div className="max-w-3xl mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold tracking-[-0.03em] text-[#141414] leading-[1.08] mb-3.5">
          See the signals <br />
          behind your answers.
        </h2>
        <p className="text-xs sm:text-sm md:text-[15px] text-[#68645E] max-w-xl font-normal leading-relaxed">
          Every conversation produces biometric telemetry.<br className="hidden sm:inline" />
          Inspect your pacing, hesitation patterns, and precision metrics.
        </p>
      </div>

      {/* Analytics Stage: Graph on Left & 4 Telemetry Metrics (2 in a Row, 2x2 Grid) on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Side: Animated Speaking Pace Cadence Graph (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <SpeakingCadenceGraph triggerRef={sectionRef} />
        </div>

        {/* Right Side: 4 Animated Loading Circular Dials in 2x2 Grid (2 in one row) */}
        <div
          ref={dialsGridRef}
          className="lg:col-span-5 grid grid-cols-2 gap-y-7 gap-x-5 sm:gap-x-7 items-center justify-items-center max-w-[370px] sm:max-w-[420px] mx-auto lg:mx-auto w-full my-auto"
        >
          {statCardsData.map((dial) => (
            <CircularTelemetryDial
              key={dial.label}
              label={dial.label}
              rawNumber={dial.rawNumber}
              isDecimal={dial.isDecimal}
              suffix={dial.suffix}
              sub={dial.sub}
              icon={dial.icon}
              percent={dial.percent}
              triggerRef={dialsGridRef}
              delay={dial.delay}
              strokeColor={dial.strokeColor}
              trackColor={dial.trackColor}
              iconColor={dial.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

