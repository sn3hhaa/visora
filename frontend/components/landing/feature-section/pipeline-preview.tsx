import * as React from "react";
import {
  Activity,
  ChevronDown,
  Mic,
  FileText,
  Layers,
  BarChart2,
  User,
} from "lucide-react";

export function PipelinePreview() {
  return (
    <div className="w-full h-full bg-white rounded-[22px] p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] border border-[#E5E7EB] flex flex-col justify-between text-left select-none relative">
      {/* 1. Header Row */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
            <Activity className="w-5 h-5 text-[#16A34A]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111827] tracking-tight leading-snug">
              Visora Response Analysis
            </h3>
            <p className="text-[11.5px] sm:text-[12px] font-medium text-[#6B7280] leading-tight mt-0.5">
              Understands how you speak. In real time.
            </p>
          </div>
        </div>

        {/* Live Analysis badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D] shadow-2xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="text-[11px] sm:text-[11.5px] font-medium whitespace-nowrap">
            Live Analysis
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#15803D]" />
        </div>
      </div>

      {/* --- FLOW DIAGRAM CANVAS --- */}
      <div className="flex flex-col items-center w-full my-auto py-3">
        {/* Tier 1: 3 Input Stream Tiles */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full shrink-0">
          {/* Tile 1: Speech Stream */}
          <div className="py-3 px-2 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <Mic className="w-5 h-5 text-[#16A34A]" />
            <span className="text-[11.5px] sm:text-[12px] font-bold text-[#111827] leading-tight">
              Speech Stream
            </span>
          </div>

          {/* Tile 2: Pace & Pauses */}
          <div className="py-3 px-2 rounded-xl bg-[#F0F7FF] border border-[#BAE6FD] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <svg className="w-5 h-5 text-[#1E293B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c3-6 5-6 8 0s5 6 8 0 3-3 4-3" />
            </svg>
            <span className="text-[11.5px] sm:text-[12px] font-bold text-[#111827] leading-tight">
              Pace &amp; Pauses
            </span>
          </div>

          {/* Tile 3: Fillers & Length */}
          <div className="py-3 px-2 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] shadow-xs flex flex-col items-center justify-center gap-1.5 text-center">
            <FileText className="w-5 h-5 text-[#EA580C]" />
            <span className="text-[11.5px] sm:text-[12px] font-bold text-[#111827] leading-tight">
              Fillers &amp; Length
            </span>
          </div>
        </div>

        {/* Connector 1: 3-to-1 Bus Drop with Arrow into Response Evaluation */}
        <div className="w-full h-5 sm:h-6 flex flex-col items-center justify-between shrink-0">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Stems from bottom centers of tiles */}
            <line x1="16.666%" y1="0" x2="16.666%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="50%" y1="0" x2="50%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="83.333%" y1="0" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Horizontal Bus Line */}
            <line x1="16.666%" y1="10" x2="83.333%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Vertical Drop to Response Evaluation with arrow */}
            <line x1="50%" y1="10" x2="50%" y2="76%" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="48,72 50,100 52,72" fill="#94A3B8" />
          </svg>
        </div>

        {/* Tier 2: Response Evaluation (Card with 4 Progress Bars) */}
        <div className="w-full p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col gap-3.5 shrink-0">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#F0F7FF] border border-[#E0F2FE] flex items-center justify-center text-[#0284C7] shrink-0">
              <Layers className="w-4 h-4 text-[#0284C7]" />
            </div>
            <span className="text-[13px] sm:text-[13.5px] font-bold text-[#111827] leading-tight">
              Response Evaluation
            </span>
          </div>

          {/* 2x2 Progress Bar Grid */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 w-full">
            {/* Clarity */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-medium leading-none">
                <span className="text-[#111827]">Clarity</span>
                <span className="text-[#16A34A] font-bold">95%</span>
              </div>
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: "95%" }} />
              </div>
            </div>

            {/* Specificity */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-medium leading-none">
                <span className="text-[#111827]">Specificity</span>
                <span className="text-[#2563EB] font-bold">92%</span>
              </div>
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "92%" }} />
              </div>
            </div>

            {/* Consistency */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-medium leading-none">
                <span className="text-[#111827]">Consistency</span>
                <span className="text-[#9333EA] font-bold">96%</span>
              </div>
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#9333EA] rounded-full" style={{ width: "96%" }} />
              </div>
            </div>

            {/* Relevance */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-medium leading-none">
                <span className="text-[#111827]">Relevance</span>
                <span className="text-[#EA580C] font-bold">95%</span>
              </div>
              <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div className="h-full bg-[#EA580C] rounded-full" style={{ width: "95%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Connector 2: Arrow pointing down from Response Evaluation to Performance Insights */}
        <div className="w-full h-4 sm:h-5 flex items-center justify-center shrink-0">
          <svg className="w-4 h-full" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="0" x2="8" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />
            <polygon points="5,9 8,14 11,9" fill="#94A3B8" />
          </svg>
        </div>

        {/* Tier 3: Performance Insights Node */}
        <div className="px-5 py-2 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center gap-2.5 text-left shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#EA580C] shrink-0">
            <BarChart2 className="w-4 h-4 text-[#EA580C]" />
          </div>
          <span className="text-[12px] sm:text-[12.5px] font-bold text-[#111827] leading-tight">
            Performance Insights
          </span>
        </div>

        {/* Connector 3: 1-to-4 Bus Connector into Feedback Cards */}
        <div className="w-full h-5 sm:h-6 flex flex-col items-center justify-between shrink-0">
          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            {/* Center stem from Performance Insights */}
            <line x1="50%" y1="0" x2="50%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Horizontal Bus Line spanning 4 columns */}
            <line x1="12.5%" y1="10" x2="87.5%" y2="10" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* 4 Drops to Feedback cards */}
            <line x1="12.5%" y1="10" x2="12.5%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="37.5%" y1="10" x2="37.5%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="62.5%" y1="10" x2="62.5%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="87.5%" y1="10" x2="87.5%" y2="100%" stroke="#CBD5E1" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tier 4: 4 Feedback Categories (Strengths, Weak Areas, Question Review, Actionable Feedback) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full shrink-0">
          {/* Strengths */}
          <div className="py-3 px-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-1.5 text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shrink-0" />
            <span className="text-[10.5px] sm:text-[11px] font-bold text-[#111827] leading-tight">
              Strengths
            </span>
          </div>

          {/* Weak Areas */}
          <div className="py-3 px-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-1.5 text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] shrink-0" />
            <span className="text-[10.5px] sm:text-[11px] font-bold text-[#111827] leading-tight">
              Weak Areas
            </span>
          </div>

          {/* Question Review */}
          <div className="py-3 px-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-1.5 text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B] shrink-0" />
            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#111827] leading-tight">
              Question Review
            </span>
          </div>

          {/* Actionable Feedback */}
          <div className="py-3 px-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-center gap-1.5 text-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shrink-0" />
            <span className="text-[9.5px] sm:text-[10px] font-bold text-[#111827] leading-tight">
              Actionable Feedback
            </span>
          </div>
        </div>
      </div>

      {/* 3. Footer Row */}
      <div className="grid grid-cols-2 gap-4 pt-3 mt-1 border-t border-[#F3F4F6] shrink-0">
        {/* Left: ANALYSIS MODE */}
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-[#374151] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">
              ANALYSIS MODE
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#111827] leading-tight mt-0.5">
              Real-time · AI-powered
            </span>
          </div>
        </div>

        {/* Right: FEEDBACK STYLE */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
          <BarChart2 className="w-5 h-5 text-[#374151] shrink-0" />
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-tight">
              FEEDBACK STYLE
            </span>
            <span className="text-[12px] sm:text-[12.5px] font-semibold text-[#111827] leading-tight mt-0.5">
              Constructive · Personalized
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
