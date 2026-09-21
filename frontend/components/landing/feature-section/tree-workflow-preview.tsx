import * as React from "react";
import {
  Globe,
  ChevronDown,
  User,
  GraduationCap,
  Database,
  Briefcase,
  FileText,
  Layers,
  MessageSquare,
  Network,
  Search,
  BarChart2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export function TreeWorkflowPreview() {
  return (
    <div className="w-full h-full bg-white rounded-[22px] p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] border border-[#E5E7EB] flex flex-col justify-between text-left select-none relative">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF2FE] border border-[#D0E1FD] text-[#2563EB] flex items-center justify-center shrink-0 shadow-2xs">
            <Globe className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111827] tracking-tight leading-snug">
              Visora Conversation Engine
            </h3>
            <p className="text-[11.5px] sm:text-[12px] font-medium text-[#6B7280] leading-tight mt-0.5">
              Context-aware. Adaptive. Realistic.
            </p>
          </div>
        </div>

        {/* F-1 context active badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] shadow-2xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="text-[11px] sm:text-[11.5px] font-medium whitespace-nowrap">
            F-1 context active
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#15803D]" />
        </div>
      </div>

      {/* --- FLOW DIAGRAM CANVAS --- */}
      <div className="flex flex-col items-center w-full my-auto py-3">
        {/* Tier 1: Top Interview Context */}
        <div className="px-6 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-center shrink-0">
          <User className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/20" />
          <span className="text-[12.5px] sm:text-[13px] font-semibold text-[#111827]">
            Interview Context
          </span>
        </div>

        {/* Connector 1: Tier 1 to 3 Topics (Branching Out with smooth lines) */}
        <div className="w-full h-5 sm:h-6 flex flex-col items-center justify-between shrink-0">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="0" x2="50%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="16.666%" y1="10" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="16.666%" y1="10" x2="16.666%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="50%" y1="10" x2="50%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="83.333%" y1="10" x2="83.333%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tier 2: 3 Context Topics */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full shrink-0">
          {/* Academic */}
          <div className="py-3 px-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <GraduationCap className="w-5 h-5 text-[#374151] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-medium text-[#111827] leading-tight">
              Academic
            </span>
          </div>

          {/* Funding (Active Green) */}
          <div className="py-3 px-2 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <Database className="w-5 h-5 text-[#16A34A] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#16A34A] leading-tight">
              Funding
            </span>
          </div>

          {/* Career Plans */}
          <div className="py-3 px-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <Briefcase className="w-5 h-5 text-[#374151] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-medium text-[#111827] leading-tight">
              Career Plans
            </span>
          </div>
        </div>

        {/* Connector 2: Tier 2 to Conversation State (Converging 3-to-1 with downward Arrow) */}
        <div className="w-full h-5 sm:h-6 flex flex-col items-center justify-between shrink-0">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Stems from bottom of Academic, Funding, Career Plans */}
            <line x1="16.666%" y1="0" x2="16.666%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="50%" y1="0" x2="50%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="83.333%" y1="0" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Horizontal Bus Line */}
            <line x1="16.666%" y1="10" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Center stem drop with arrow */}
            <line x1="50%" y1="10" x2="50%" y2="76%" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="48,72 50,100 52,72" fill="#94A3B8" />
          </svg>
        </div>

        {/* Tier 3: Conversation State with Previous Answers & Open Threads */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full shrink-0">
          {/* Previous Answers */}
          <div className="px-2.5 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-1.5 shrink-0">
            <FileText className="w-4 h-4 text-[#374151] shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-medium text-[#111827] whitespace-nowrap">
              Previous Answers
            </span>
          </div>

          {/* Connector Arrow Left -> Center */}
          <div className="flex-1 flex items-center justify-center min-w-[6px] px-0.5">
            <svg className="w-full max-w-[22px] h-3" fill="none" viewBox="0 0 22 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="5" x2="16" y2="5" stroke="#CBD5E1" strokeWidth="1.5" />
              <polygon points="14,2 20,5 14,8" fill="#94A3B8" />
            </svg>
          </div>

          {/* Conversation State (Center Box) */}
          <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-2 text-center shrink-0">
            <Layers className="w-4.5 h-4.5 text-[#111827] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-bold text-[#111827] leading-tight whitespace-nowrap">
              Conversation State
            </span>
          </div>

          {/* Connector Arrow Right -> Center */}
          <div className="flex-1 flex items-center justify-center min-w-[6px] px-0.5">
            <svg className="w-full max-w-[22px] h-3" fill="none" viewBox="0 0 22 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="22" y1="5" x2="6" y2="5" stroke="#CBD5E1" strokeWidth="1.5" />
              <polygon points="8,2 2,5 8,8" fill="#94A3B8" />
            </svg>
          </div>

          {/* Open Threads */}
          <div className="px-2.5 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-1.5 shrink-0">
            <MessageSquare className="w-4 h-4 text-[#374151] shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-medium text-[#111827] whitespace-nowrap">
              Open Threads
            </span>
          </div>
        </div>

        {/* Connector 3: Arrow pointing down from Conversation State to Adaptive Decision */}
        <div className="w-full h-4 sm:h-5 flex items-center justify-center shrink-0">
          <svg className="w-4 h-full" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="0" x2="8" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="5,9 8,14 11,9" fill="#94A3B8" />
          </svg>
        </div>

        {/* Tier 4: Adaptive Decision */}
        <div className="px-5 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-2.5 text-center shrink-0">
          <Network className="w-4.5 h-4.5 text-[#D97706] shrink-0" />
          <span className="text-[12px] sm:text-[12.5px] font-bold text-[#111827] leading-tight">
            Adaptive Decision
          </span>
        </div>

        {/* Connector 4: Tier 4 to 3 Decisions (Branching Out) */}
        <div className="w-full h-5 sm:h-6 flex flex-col items-center justify-between shrink-0">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="50%" y1="0" x2="50%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="16.666%" y1="10" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="16.666%" y1="10" x2="16.666%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="50%" y1="10" x2="50%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="83.333%" y1="10" x2="83.333%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tier 5: 3 Decisions (Clarify, Follow-up, Challenge) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full shrink-0">
          {/* Clarify */}
          <div className="py-3 px-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-2 text-center">
            <Search className="w-4 h-4 text-[#374151] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-medium text-[#111827]">
              Clarify
            </span>
          </div>

          {/* Follow-up (Active Green) */}
          <div className="py-3 px-2 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] shadow-xs flex items-center justify-center gap-2 text-center">
            <MessageSquare className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#16A34A]">
              Follow-up
            </span>
          </div>

          {/* Challenge */}
          <div className="py-3 px-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-2 text-center">
            <BarChart2 className="w-4 h-4 text-[#374151] shrink-0" />
            <span className="text-[11.5px] sm:text-[12px] font-medium text-[#111827]">
              Challenge
            </span>
          </div>
        </div>

        {/* Connector 5: Arrow from Follow-up to Next Question */}
        <div className="w-full h-4 sm:h-5 flex items-center justify-center shrink-0">
          <svg className="w-4 h-full" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="0" x2="8" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="5,9 8,14 11,9" fill="#94A3B8" />
          </svg>
        </div>

        {/* Tier 6: Next Question Card */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#D97706] fill-[#D97706]/20" />
              <span className="text-[13px] sm:text-[13.5px] font-bold text-[#111827]">
                Next Question
              </span>
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-medium text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7] px-2.5 py-0.5 rounded-full shadow-2xs">
              Generated from context
            </span>
          </div>

          {/* Inner Quote Box */}
          <div className="w-full py-3.5 px-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-center">
            <p className="text-[12.5px] sm:text-[13px] font-medium text-[#111827] italic leading-snug">
              &ldquo;What specifically attracted you to this program?&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* 3. Footer Row */}
      <div className="grid grid-cols-2 gap-4 pt-3 mt-1 border-t border-[#F3F4F6] shrink-0">
        {/* Left: INTERVIEW MODE */}
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#374151] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">
              INTERVIEW MODE
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#111827] leading-tight mt-0.5">
              Measured · Neutral
            </span>
          </div>
        </div>

        {/* Right: ADAPTIVE BEHAVIOUR */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
          <SlidersHorizontal className="w-5 h-5 text-[#374151] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">
              ADAPTIVE BEHAVIOUR
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#111827] leading-tight mt-0.5">
              Dynamic questioning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
