import type { Rating } from "@/lib/realtime/report";

export const RATING_LABELS: Record<Rating, string> = {
  strong: "Strong",
  adequate: "Adequate",
  needs_work: "Needs work",
};

const RATING_STYLES: Record<Rating, string> = {
  strong: "text-[#3B4636] bg-[#ECEEEA] border-[#D3D9CF]",
  adequate: "text-[#8A4D1F] bg-[#FAF3EC] border-[#EBD7C3]",
  needs_work: "text-[#9F2D20] bg-[#FDF1EF] border-[#F2CFC9]",
};

export const RATING_BAR: Record<Rating, string> = {
  strong: "bg-[#485244]",
  adequate: "bg-[#C89A6A]",
  needs_work: "bg-[#C8574A]",
};

export function RatingPill({ rating }: { rating: Rating }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${RATING_STYLES[rating]}`}>
      {RATING_LABELS[rating]}
    </span>
  );
}

export function formatSeconds(total: number | null): string {
  if (total === null) return "—";
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes ? `${minutes}m ${seconds.toString().padStart(2, "0")}s` : `${seconds}s`;
}
