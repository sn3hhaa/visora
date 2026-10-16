/**
 * Client-side mirror of the interview WebSocket protocol.
 * Source of truth: backend/src/websocket/protocol.ts (see docs/realtime-protocol.md).
 * Keep the two in sync when the protocol changes.
 */
import type { InterviewContextId } from "@/types/context";
import type { B1B2Profile, F1Profile, H1BProfile, InterviewDifficulty } from "@/types/interview";
import type { SessionReport } from "./report";

export const PROTOCOL_VERSION = 1;
export const MAX_ANSWER_CHARS = 4000;

/** Close code the server uses when the session is resumed on another connection. */
export const CLOSE_SUPERSEDED = 4000;

export type InterviewSetupPayload =
  | { context: "f1"; difficulty: InterviewDifficulty; profile: F1Profile }
  | { context: "h1b"; difficulty: InterviewDifficulty; profile: H1BProfile }
  | { context: "b1b2"; difficulty: InterviewDifficulty; profile: B1B2Profile };

export type QuestionKind = "opening" | "follow_up" | "new_topic" | "closing";

export interface TranscriptEntry {
  id: string;
  role: "officer" | "candidate";
  text: string;
  /** ISO 8601 */
  at: string;
  kind?: QuestionKind;
  topicId?: string;
}

export type InterviewPhase = "awaiting_answer" | "processing" | "completed";
export type CompletionReason = "concluded" | "candidate_ended" | "expired";

export type ErrorCode =
  | "invalid_json"
  | "invalid_message"
  | "unsupported_message"
  | "no_session"
  | "session_exists"
  | "session_not_found"
  | "session_completed"
  | "busy"
  | "capacity"
  | "rate_limited"
  | "internal";

export type ClientMessage =
  | { type: "session_start"; setup: InterviewSetupPayload }
  | { type: "session_resume"; sessionId: string }
  | { type: "answer_submit"; text: string }
  | { type: "session_end" }
  | { type: "ping" };

export interface SessionSnapshot {
  sessionId: string;
  context: InterviewContextId;
  difficulty: InterviewDifficulty;
  phase: InterviewPhase;
  questionCount: number;
  maxQuestions: number;
  transcript: TranscriptEntry[];
}

export type ServerMessage =
  | ({ type: "session_started"; protocolVersion: number; provider: string; resumed: boolean } & SessionSnapshot)
  | { type: "agent_processing" }
  | { type: "next_question"; entry: TranscriptEntry; questionNumber: number; maxQuestions: number }
  | { type: "transcript_update"; entry: TranscriptEntry }
  | { type: "interview_completed"; sessionId: string; reason: CompletionReason; closing: TranscriptEntry | null; report: SessionReport }
  | { type: "error"; code: ErrorCode; message: string; recoverable: boolean }
  | { type: "pong" };

const SERVER_MESSAGE_TYPES = new Set<ServerMessage["type"]>([
  "session_started",
  "agent_processing",
  "next_question",
  "transcript_update",
  "interview_completed",
  "error",
  "pong",
]);

/** Parses a server frame. Returns null for anything that is not a known server message. */
export function parseServerMessage(raw: unknown): ServerMessage | null {
  if (typeof raw !== "string") return null;
  try {
    const data = JSON.parse(raw) as { type?: unknown };
    if (data && typeof data.type === "string" && SERVER_MESSAGE_TYPES.has(data.type as ServerMessage["type"])) {
      return data as ServerMessage;
    }
  } catch {
    // fall through
  }
  return null;
}
