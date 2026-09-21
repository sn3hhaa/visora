import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroActions() {
  return (
    <div className="flex flex-row flex-nowrap items-center justify-start lg:justify-end gap-3.5 shrink-0 whitespace-nowrap">
      {/* Primary Dark Pill Button */}
      <Link
        href="/setup"
        className="h-12 px-6 sm:px-7 rounded-full bg-[#191919] hover:bg-black text-white text-[14px] sm:text-[15px] font-medium inline-flex items-center gap-2.5 shadow-sm transition-all duration-150 active:scale-95 group shrink-0"
      >
        <span>Get Started</span>
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-150 group-hover:translate-x-0.5">
          <ArrowRight className="w-3 h-3 text-white stroke-[2.5]" />
        </div>
      </Link>

      {/* Secondary Outline Pill Button */}
      <a
        href="#how-it-works"
        className="h-12 px-6 sm:px-7 rounded-full border border-[#D0C9BD] bg-white hover:bg-[#F5EFE6] text-[#191919] text-[14px] sm:text-[15px] font-medium inline-flex items-center justify-center transition-all duration-150 shadow-xs shrink-0"
      >
        <span>See how it works</span>
      </a>
    </div>
  );
}
