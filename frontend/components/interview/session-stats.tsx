"use client";

import * as React from "react";
import { Clock, Cpu, ListOrdered, Wifi } from "lucide-react";
import type { InterviewRoomState } from "@/lib/realtime/interview-state";

const CONNECTION_LABELS: Record<InterviewRoomState["connection"], string> = {
  idle: "Not connected",
  connecting: "Connecting…",
  open: "Connected",
  reconnecting: "Reconnecting…",
  closed: "Disconnected",
};

const PROVIDER_LABELS: Record<string, string> = {
  demo: "Demo (rule-based)",
};

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** Elapsed interview time, measured from the first and last transcript timestamps the server issued. */
function useElapsed(state: InterviewRoomState): string {
  const first = state.transcript[0]?.at;
  const last = state.transcript[state.transcript.length - 1]?.at;
  const running = Boolean(first) && state.phase !== "completed";
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [running]);

  if (!first) return "--";
  const end = running ? now : Date.parse(last ?? first);
  return formatElapsed(end - Date.parse(first));
}

export function SessionStats({ state }: { state: InterviewRoomState }) {
  const elapsed = useElapsed(state);
  const provider = state.provider ? PROVIDER_LABELS[state.provider] ?? state.provider : "--";
  const question = state.maxQuestions ? `${state.questionNumber} of ${state.maxQuestions}` : "--";

  const tiles = [
    { label: "Connection", value: CONNECTION_LABELS[state.connection], icon: Wifi, tone: "text-emerald-600" },
    { label: "Officer engine", value: provider, icon: Cpu, tone: "text-[#485244]" },
    { label: "Question", value: question, icon: ListOrdered, tone: "text-[#A25A24]" },
    { label: "Elapsed", value: elapsed, icon: Clock, tone: "text-[#5C564E]" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {tiles.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="bg-[#FAF8F5] border border-[#EAE4DA] rounded-2xl p-3 flex flex-col gap-1 shadow-2xs min-w-0">
          <div className="flex items-center gap-1.5 text-[#78736A] text-xs font-sans font-medium">
            <Icon className={`w-3.5 h-3.5 ${tone}`} />
            <span>{label}</span>
          </div>
          <span className="text-sm font-sans font-bold text-[#141414] truncate">{value}</span>
        </div>
      ))}
    </div>
  );
}
