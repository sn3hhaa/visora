import { ChevronDown, CornerDownRight } from "lucide-react";
import type { AnswerReport } from "@/lib/realtime/report";
import { RatingPill, formatSeconds } from "./rating";

const KIND_LABELS: Record<AnswerReport["questionKind"], string> = {
  opening: "Opening",
  follow_up: "Follow-up",
  new_topic: "New topic",
  closing: "Closing",
};

function AnswerItem({ answer, defaultOpen }: { answer: AnswerReport; defaultOpen: boolean }) {
  const fillerTotal = answer.measured.fillerWords.reduce((total, filler) => total + filler.count, 0);
  const assessments = [
    { label: "Completeness", value: answer.assessed.completeness },
    { label: "Specificity", value: answer.assessed.specificity },
    { label: "Directness", value: answer.assessed.directness },
  ];

  return (
    <details open={defaultOpen} className="group border-t border-[#EFEBE3] first:border-t-0">
      <summary className="flex cursor-pointer list-none items-start gap-4 py-4 sm:py-5 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-[13px] text-[#A25A24] pt-0.5 w-7 shrink-0">{String(answer.questionNumber).padStart(2, "0")}</span>
        <span className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-[#8E887E]">
            {[answer.topicLabel, KIND_LABELS[answer.questionKind]].filter(Boolean).join(" · ")}
          </span>
          <span className="font-serif text-[17px] sm:text-lg leading-snug text-[#141414]">{answer.question}</span>
        </span>
        <ChevronDown className="w-4 h-4 mt-1 shrink-0 text-[#8E887E] transition-transform group-open:rotate-180" aria-hidden />
      </summary>

      <div className="pb-6 pl-11 pr-1 flex flex-col gap-4">
        <blockquote className="rounded-xl bg-[#FAF8F5] border border-[#EAE4DA] px-4 py-3 text-[13.5px] leading-relaxed text-[#3D3A35]">
          {answer.answer}
        </blockquote>

        <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-mono text-[#6B665F]">
          <span>{answer.measured.wordCount} words</span>
          <span>{formatSeconds(answer.measured.responseSeconds)} to respond</span>
          <span>
            {fillerTotal} filler{fillerTotal === 1 ? "" : "s"}
            {fillerTotal > 0 && ` (${answer.measured.fillerWords.map((filler) => filler.word).join(", ")})`}
          </span>
          <span>
            {answer.measured.hedges.length} hedge{answer.measured.hedges.length === 1 ? "" : "s"}
            {answer.measured.hedges.length > 0 && ` (${answer.measured.hedges.join(", ")})`}
          </span>
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {assessments.map(({ label, value }) => (
            <li key={label} className="flex flex-col gap-1.5 rounded-xl border border-[#EFEBE3] p-3">
              <span className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#141414]">{label}</span>
                <RatingPill rating={value.rating} />
              </span>
              <span className="text-[12px] leading-snug text-[#6B665F]">{value.note}</span>
            </li>
          ))}
        </ul>

        {answer.followUp && (
          <p className="flex items-start gap-2 text-[12.5px] text-[#5C564E]">
            <CornerDownRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#A25A24]" aria-hidden />
            <span>
              Prompted a follow-up: <span className="italic">“{answer.followUp}”</span>
            </span>
          </p>
        )}
      </div>
    </details>
  );
}

export function AnswerBreakdown({ answers }: { answers: AnswerReport[] }) {
  return (
    <section>
      <div className="flex flex-col gap-1.5 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8E887E]">Question by question</span>
        <h2 className="font-serif text-2xl sm:text-[28px] leading-tight text-[#141414]">The full exchange</h2>
      </div>
      {answers.length ? (
        <div className="rounded-2xl border border-[#E6E0D6] bg-white px-4 sm:px-6">
          {answers.map((answer, index) => (
            <AnswerItem key={answer.questionNumber} answer={answer} defaultOpen={index === 0} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-[#E6E0D6] bg-white p-6 text-[13px] text-[#8E887E]">No questions were answered in this session.</p>
      )}
    </section>
  );
}
