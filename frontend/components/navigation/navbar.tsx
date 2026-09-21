"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/lib/constants/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center justify-between bg-[#191919] text-white px-5 sm:px-6 py-2 rounded-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.18)] max-w-[640px] w-full min-h-[44px]"
      >
        {/* Brand Logo with balanced proportion */}
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

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-[13px] font-normal text-[#B5B0A6] whitespace-nowrap">
          {MAIN_NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-white transition-colors duration-150 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right CTA Button (Try Visora White Pill) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/setup"
            className="inline-flex items-center justify-center bg-white text-[#191919] hover:bg-[#F2EDE5] text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-150 shadow-sm active:scale-95 whitespace-nowrap shrink-0"
          >
            <span>Try Visora</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-[#B5B0A6] hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden fixed top-20 inset-x-4 bg-[#191919] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 text-center z-50 animate-in fade-in duration-150">
          {MAIN_NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#B5B0A6] hover:text-white py-2 border-b border-white/5"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/setup"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center bg-white text-[#191919] font-medium text-sm py-2 rounded-full mt-1"
          >
            <span>Try Visora</span>
          </Link>
        </div>
      )}
    </header>
  );
}
