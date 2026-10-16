import type { DimensionSummary, Rating, SessionReport } from "@/lib/realtime/report";
import { RATING_BAR, RATING_LABELS, RatingPill, formatSeconds } from "./rating";

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8E887E]">{eyebrow}</span>
      <h2 className="font-serif text-2xl sm:text-[28px] leading-tight text-[#141414]">{title}</h2>
      <p className="text-[13px] text-[#6B665F] max-w-2xl leading-relaxed">{note}</p>
    </div>
  );
}

export function MeasuredMetrics({ report }: { report: SessionReport }) {
  const m = report.measured;
  const tiles: { label: string; value: string; hint?: string }[] = [
    { label: "Duration", value: formatSeconds(m.durationSeconds) },
    { label: "Answers", value: `${m.answersGiven}`, hint: `of ${m.questionsAsked} question${m.questionsAsked === 1 ? "" : "s"} asked` },
    { label: "Words per answer", value: m.averageWordsPerAnswer === null ? "—" : `${m.averageWordsPerAnswer}`, hint: `${m.totalWords} words in total` },
    { label: "Time to respond", value: formatSeconds(m.medianResponseSeconds), hint: "median, includes reading and typing" },
    { label: "Filler words", value: `${m.fillerWordCount}`, hint: "um, uh, you know, basically…" },
    { label: "Hedges", value: `${m.hedgeCount}`, hint: "I think, maybe, probably…" },
    { label: "Follow-ups", value: `${m.followUpsAsked}`, hint: "probes the officer needed" },
    { label: "Topics covered", value: `${m.topicsCovered.length} / ${m.topicsTotal}` },
  ];

  return (
    <section>
      <SectionHeading
        eyebrow="Measured"
        title="What happened"
        note="Counted and timed directly from the session. No interpretation involved."
      />
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-[#E6E0D6] bg-[#E6E0D6]">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-white p-4 sm:p-5 flex flex-col gap-1 min-w-0">
            <dt className="text-xs font-medium text-[#78736A]">{tile.label}</dt>
            <dd className="font-mono text-2xl sm:text-[28px] font-semibold tracking-tight text-[#141414] leading-none mt-1">{tile.value}</dd>
            {tile.hint && <dd className="text-[11.5px] text-[#8E887E] leading-snug">{tile.hint}</dd>}
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[12px] text-[#8E887E]">
        Speaking rate is not shown: it can only be measured from spoken answers, and this session used typed answers.
        {m.topicsCovered.length > 0 && <> Topics covered: {m.topicsCovered.map((topic) => topic.label).join(", ")}.</>}
      </p>
    </section>
  );
}

function Distribution({ counts }: { counts: Record<Rating, number> }) {
  const total = counts.strong + counts.adequate + counts.needs_work;
  const order: Rating[] = ["strong", "adequate", "needs_work"];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#EFEBE3]" aria-hidden>
        {order.map((rating) =>
          counts[rating] ? <div key={rating} className={RATING_BAR[rating]} style={{ width: `${(counts[rating] / total) * 100}%` }} /> : null,
        )}
      </div>
      <p className="text-[11.5px] text-[#78736A]">
        {order
          .filter((rating) => counts[rating])
          .map((rating) => `${counts[rating]} ${RATING_LABELS[rating].toLowerCase()}`)
          .join(" · ")}
      </p>
    </div>
  );
}

function DimensionRow({ dimension }: { dimension: DimensionSummary }) {
  const assessed = dimension.status === "assessed";
  return (
    <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-6 py-4 border-t border-[#EFEBE3] first:border-t-0">
      <div className="flex items-center gap-2.5 sm:flex-col sm:items-start sm:gap-1.5">
        <span className={`text-sm font-semibold ${assessed ? "text-[#141414]" : "text-[#A8A29E]"}`}>{dimension.label}</span>
        {assessed ? (
          <RatingPill rating={dimension.rating} />
        ) : (
          <span className="inline-flex rounded-full border border-[#E6E0D6] px-2 py-0.5 text-[11px] font-semibold text-[#A8A29E]">Not assessed</span>
        )}
      </div>
      <div className="flex flex-col gap-2 justify-center">
        {assessed && <Distribution counts={dimension.counts} />}
        <p className={`text-[12.5px] leading-relaxed ${assessed ? "text-[#5C564E]" : "text-[#A8A29E]"}`}>{dimension.note}</p>
      </div>
    </li>
  );
}

export function AssessedQualities({ report }: { report: SessionReport }) {
  return (
    <section>
      <SectionHeading
        eyebrow="Assessed · rule-based"
        title="How your answers read"
        note="Each answer is checked against simple, transparent rules: length, named details and figures, hedging and fillers. These are practice signals, not an AI judgement and not a prediction of any visa decision."
      />
      <ul className="rounded-2xl border border-[#E6E0D6] bg-white px-4 sm:px-6">
        {report.assessed.dimensions.map((dimension) => (
          <DimensionRow key={dimension.id} dimension={dimension} />
        ))}
      </ul>
    </section>
  );
}

export function Feedback({ report }: { report: SessionReport }) {
  const columns = [
    { title: "Worked well", items: report.strengths, empty: "Nothing stood out yet. Answer more questions to build a picture." },
    { title: "To sharpen", items: report.improvements, empty: "" },
  ];
  return (
    <section>
      <SectionHeading eyebrow="Feedback" title="What to take away" note="Every point below is derived from the answers in this session." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {columns.map((column) => (
          <div key={column.title} className="rounded-2xl border border-[#E6E0D6] bg-white p-5 sm:p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#141414] mb-3">{column.title}</h3>
            {column.items.length ? (
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={item} className="text-[13.5px] leading-relaxed text-[#3D3A35] pl-4 relative before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-[#A25A24]">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] text-[#8E887E]">{column.empty}</p>
            )}
          </div>
        ))}
      </div>

      {report.recommendations.length > 0 && (
        <div className="mt-4 rounded-2xl bg-[#1C1B18] text-[#FAF8F5] p-5 sm:p-7">
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[#D8CFC2] mb-4">Before your next attempt</h3>
          <ol className="flex flex-col gap-3.5">
            {report.recommendations.map((item, index) => (
              <li key={item} className="grid grid-cols-[28px_1fr] gap-2 text-[13.5px] leading-relaxed">
                <span className="font-mono text-[#C89A6A]">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
