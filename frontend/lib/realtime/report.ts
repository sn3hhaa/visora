/**
 * Client-side mirror of the post-interview report.
 * Source of truth: backend/src/analytics/report.ts. Keep the two in sync.
 */
import type { InterviewContextId } from "@/types/context";
import type { InterviewDifficulty } from "@/types/interview";
import type { CompletionReason, QuestionKind } from "./protocol";

export type Rating = "strong" | "adequate" | "needs_work";

export interface Assessment {
  rating: Rating;
  note: string;
}

export type AssessedDimensionId = "completeness" | "specificity" | "directness" | "relevance" | "consistency";

export type DimensionSummary =
  | { id: AssessedDimensionId; label: string; status: "assessed"; rating: Rating; counts: Record<Rating, number>; note: string }
  | { id: AssessedDimensionId; label: string; status: "not_assessed"; note: string };

export interface AnswerReport {
  questionNumber: number;
  question: string;
  questionKind: QuestionKind;
  topicId: string | null;
  topicLabel: string | null;
  answer: string;
  measured: {
    wordCount: number;
    responseSeconds: number;
    fillerWords: { word: string; count: number }[];
    hedges: string[];
  };
  assessed: {
    completeness: Assessment;
    specificity: Assessment;
    directness: Assessment;
  };
  followUp: string | null;
}

export interface SessionReport {
  version: 1;
  sessionId: string;
  context: InterviewContextId;
  contextLabel: string;
  difficulty: InterviewDifficulty;
  provider: string;
  inputMode: "text";
  completionReason: CompletionReason | null;
  startedAt: string;
  completedAt: string | null;
  measured: {
    durationSeconds: number;
    questionsAsked: number;
    answersGiven: number;
    totalWords: number;
    averageWordsPerAnswer: number | null;
    medianResponseSeconds: number | null;
    fillerWordCount: number;
    hedgeCount: number;
    followUpsAsked: number;
    topicsCovered: { id: string; label: string }[];
    topicsTotal: number;
    speakingRateWpm: number | null;
  };
  assessed: {
    method: "rules";
    dimensions: DimensionSummary[];
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  answers: AnswerReport[];
}

const REPORT_STORAGE_PREFIX = "visora-report:";

/** Keeps the report in this tab so the results page works even after the backend session expires. */
export function cacheReport(report: SessionReport) {
  try {
    window.sessionStorage.setItem(REPORT_STORAGE_PREFIX + report.sessionId, JSON.stringify(report));
  } catch {
    // Storage unavailable or full; the results page falls back to the backend.
  }
}

export function readCachedReport(sessionId: string): SessionReport | null {
  try {
    const raw = window.sessionStorage.getItem(REPORT_STORAGE_PREFIX + sessionId);
    const report = raw ? (JSON.parse(raw) as SessionReport) : null;
    return report?.version === 1 && report.sessionId === sessionId ? report : null;
  } catch {
    return null;
  }
}

/** HTTP base of the interview backend, derived from the WebSocket URL unless set explicitly. */
export function apiBaseUrl(wsUrl: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  try {
    const url = new URL(wsUrl);
    url.protocol = url.protocol === "wss:" ? "https:" : "http:";
    return url.origin;
  } catch {
    return "http://localhost:4000";
  }
}

export type ReportFetchResult =
  | { status: "ok"; report: SessionReport }
  | { status: "not_found" | "in_progress" | "unreachable" };

export async function fetchReport(baseUrl: string, sessionId: string, signal?: AbortSignal): Promise<ReportFetchResult> {
  try {
    const response = await fetch(`${baseUrl}/sessions/${encodeURIComponent(sessionId)}/report`, { signal, cache: "no-store" });
    if (response.status === 404) return { status: "not_found" };
    if (response.status === 409) return { status: "in_progress" };
    if (!response.ok) return { status: "unreachable" };
    return { status: "ok", report: (await response.json()) as SessionReport };
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    return { status: "unreachable" };
  }
}
