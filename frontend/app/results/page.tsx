"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { INTERVIEW_WS_URL } from "@/hooks/use-interview-session";
import { apiBaseUrl, cacheReport, fetchReport, readCachedReport, type SessionReport } from "@/lib/realtime/report";
import { AnswerBreakdown } from "@/components/results/answer-breakdown";
import { AssessedQualities, Feedback, MeasuredMetrics } from "@/components/results/report-summary";
import { asset } from "@/lib/asset-path";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; report: SessionReport }
  | { status: "missing" | "not_found" | "in_progress" | "unreachable" };

const DIFFICULTY_LABELS: Record<string, string> = {
  comfortable: "Comfortable",
  realistic: "Realistic",
  strict: "Strict",
  pressure: "Pressure",
};

const PROVIDER_LABELS: Record<string, string> = {
  demo: "Demo officer (rule-based)",
};

const COMPLETION_LABELS: Record<string, string> = {
  concluded: "The officer concluded the interview",
  candidate_ended: "You ended the interview",
  expired: "The session expired",
};

/** The report cached by the interview room in this tab, else the backend's copy while the session is still in memory. */
async function loadReport(sessionId: string | null, signal: AbortSignal): Promise<LoadState> {
  if (!sessionId) return { status: "missing" };
  const cached = readCachedReport(sessionId);
  if (cached) return { status: "ready", report: cached };
  const result = await fetchReport(apiBaseUrl(INTERVIEW_WS_URL), sessionId, signal);
  if (result.status !== "ok") return { status: result.status };
  cacheReport(result.report);
  return { status: "ready", report: result.report };
}

function useReport(sessionId: string | null): [LoadState, () => void] {
  const [state, setState] = React.useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    const controller = new AbortController();
    loadReport(sessionId, controller.signal)
      .then((next) => {
        if (!controller.signal.aborted) setState(next);
      })
      .catch(() => {
        // Aborted on unmount.
      });
    return () => controller.abort();
  }, [sessionId, attempt]);

  const retry = React.useCallback(() => {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }, []);

  return [state, retry];
}

const MESSAGES: Record<Exclude<LoadState["status"], "loading" | "ready">, { title: string; body: string }> = {
  missing: { title: "No interview selected", body: "Finish an interview and choose “View your results” to see its report here." },
  not_found: {
    title: "This report is no longer available",
    body: "Reports are kept in memory only while the session is active and are deleted after a period of inactivity. Nothing is stored permanently.",
  },
  in_progress: { title: "This interview is still in progress", body: "The report is generated when the interview ends." },
  unreachable: { title: "Could not reach the interview server", body: "Make sure the backend is running, then try again." },
};

function ResultsContent() {
  const sessionId = useSearchParams().get("session");
  const [state, retry] = useReport(sessionId);

  if (state.status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 py-32 text-sm text-[#6B665F]" role="status">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading your report…
      </div>
    );
  }

  if (state.status !== "ready") {
    const message = MESSAGES[state.status];
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-32 text-center">
        <AlertCircle className="w-6 h-6 text-[#A25A24]" />
        <h1 className="font-serif text-2xl text-[#141414]">{message.title}</h1>
        <p className="text-[13.5px] leading-relaxed text-[#6B665F]">{message.body}</p>
        <div className="mt-3 flex gap-2">
          {state.status === "unreachable" && (
            <button type="button" onClick={retry} className="rounded-full border border-[#DCD5C9] bg-white px-4 py-2 text-xs font-semibold hover:bg-[#F2EDE5]">
              Try again
            </button>
          )}
          <Link href="/setup" className="rounded-full bg-[#141414] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2C332A]">
            Start an interview
          </Link>
        </div>
      </div>
    );
  }

  const { report } = state;
  const completed = report.completedAt ? new Date(report.completedAt) : null;

  return (
    <div className="flex flex-col gap-14 sm:gap-16">
      <header className="flex flex-col gap-4 pt-6 sm:pt-10">
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#8E887E]">
          {[report.contextLabel, DIFFICULTY_LABELS[report.difficulty] ?? report.difficulty, PROVIDER_LABELS[report.provider] ?? report.provider].join(" · ")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-[-0.01em] text-[#141414]">Interview report</h1>
        <p className="text-sm text-[#5C564E]">
          {report.completionReason ? COMPLETION_LABELS[report.completionReason] : "Interview ended"}
          {completed && ` on ${completed.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} at ${completed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}.
        </p>
        <p className="max-w-2xl rounded-xl border border-[#EBD7C3] bg-[#FAF3EC] px-4 py-3 text-[12.5px] leading-relaxed text-[#7A4A22]">
          This is practice feedback built from your typed answers in this session. It is not immigration advice and does not predict the outcome of a
          real visa interview.
        </p>
      </header>

      <MeasuredMetrics report={report} />
      <AssessedQualities report={report} />
      <Feedback report={report} />
      <AnswerBreakdown answers={report.answers} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-[#F5F2EC] text-[#141414]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-20 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 py-5 border-b border-[#E6E0D6]">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <img src={asset("/images/visora-logo-white.png")} alt="Visora" className="h-4 w-auto invert" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/interview"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[#5C564E] hover:bg-black/5 hover:text-[#141414]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Interview room
            </Link>
            <Link
              href="/setup"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#2C332A]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              New interview
            </Link>
          </div>
        </nav>
        <React.Suspense fallback={null}>
          <ResultsContent />
        </React.Suspense>
      </div>
    </main>
  );
}
