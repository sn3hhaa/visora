"use client";

import * as React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: "Portfolio",
    href: "https://visora.app",
    icon: <Globe className="w-[18px] h-[18px]" />,
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Overview & Features", href: "/features" },
      { label: "Simulation Arena", href: "/setup" },
      { label: "Question Bank & Scoring", href: "/features" },
      { label: "Voice & Real-time AI", href: "/features" },
    ],
  },
  {
    title: "Visa Tracks",
    links: [
      { label: "F-1 Student Visa", href: "/setup" },
      { label: "B-1 / B-2 Visitor Visa", href: "/setup" },
      { label: "H-1B Work Visa", href: "/setup" },
      { label: "Consular Mock Scenarios", href: "/setup" },
    ],
  },
  {
    title: "Company & Legal",
    links: [
      { label: "About Visora", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative w-full bg-[#FAF8F5] border-t border-[#EAE4DA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Brand, Description & Socials (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity mb-4">
              <img
                src="/images/visora-logo-dark.png"
                alt="Visora"
                className="h-6 sm:h-7 w-auto object-contain mix-blend-multiply"
              />
            </Link>

            <p className="text-sm text-[#736E65] max-w-sm leading-relaxed mb-6 font-normal">
              Visora empowers visa candidates to transform high-stakes interview preparation into calm, fluent mastery with real-time AI consular simulations.
            </p>

            {/* Social Links Row */}
            <div className="flex items-center gap-4 text-[#1A1916]">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-[#22211E] hover:text-[#485244] hover:opacity-80 transition-all flex items-center justify-center"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: 3 Navigation Columns (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col">
                <h3 className="text-xs font-semibold text-[#141414] tracking-wider uppercase mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#736E65] hover:text-[#141414] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-6 border-t border-[#EAE4DA] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A847A]">
          <p>© {new Date().getFullYear()} VISORA Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#141414] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#141414] transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#141414] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
