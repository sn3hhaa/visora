"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { TranscriptEntry } from "@/lib/realtime/protocol";
import type { RoomPhase } from "@/lib/realtime/interview-state";

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  phase: RoomPhase;
}

function formatTime(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function TranscriptPanel({ transcript, phase }: TranscriptPanelProps) {
  const endRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, phase]);

  if (transcript.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-8 text-[#8E887E]">
        <div className="p-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE4DA]">
          {phase === "starting" ? (
            <Loader2 className="w-5 h-5 text-[#A25A24] animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#A25A24]" />
          )}
        </div>
        <p className="text-xs font-sans text-[#78736A] leading-relaxed max-w-[240px]">
          {phase === "starting"
            ? "Connecting to the officer…"
            : "Start the interview and the officer will open the session. The conversation appears here."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" role="log" aria-live="polite" aria-label="Interview transcript">
      {transcript.map((entry) => (
        <div
          key={entry.id}
          className={`flex flex-col gap-1 p-3 text-xs shadow-2xs ${
            entry.role === "officer"
              ? "self-start max-w-[88%] bg-[#FAF8F5] border border-[#EAE4DA] text-[#141414] rounded-2xl rounded-tl-xs"
              : "self-end max-w-[88%] bg-[#191919] text-white rounded-2xl rounded-tr-xs"
          }`}
        >
          <div className="flex items-center justify-between gap-4 text-[11px] font-sans">
            <span className={entry.role === "officer" ? "font-bold text-[#A25A24]" : "font-bold text-[#E8E2D8]"}>
              {entry.role === "officer" ? "Officer" : "You"}
            </span>
            <span className={entry.role === "officer" ? "text-[#8E887E]" : "text-[#9E988E]"}>{formatTime(entry.at)}</span>
          </div>
          <p className="leading-relaxed font-sans text-xs pt-0.5 whitespace-pre-wrap break-words">{entry.text}</p>
        </div>
      ))}

      {phase === "processing" && (
        <div className="self-start flex items-center gap-2 px-3 py-2 rounded-2xl rounded-tl-xs bg-[#FAF8F5] border border-[#EAE4DA] text-[11px] text-[#78736A]">
          <Loader2 className="w-3 h-3 animate-spin text-[#A25A24]" />
          <span>Officer is considering your answer…</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
