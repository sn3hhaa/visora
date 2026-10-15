import { z } from "zod";
import {
  interviewSetupSchema,
  type CompletionReason,
  type InterviewContextId,
  type InterviewDifficulty,
  type InterviewPhase,
  type TranscriptEntry,
} from "../interview/types";

export const PROTOCOL_VERSION = 1;
export const MAX_ANSWER_CHARS = 4000;

export const clientMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("session_start"), setup: interviewSetupSchema }),
  z.object({ type: z.literal("session_resume"), sessionId: z.string().min(1).max(64) }),
  z.object({ type: z.literal("answer_submit"), text: z.string().trim().min(1).max(MAX_ANSWER_CHARS) }),
  z.object({ type: z.literal("session_end") }),
  z.object({ type: z.literal("ping") }),
]);

export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ClientMessageType = ClientMessage["type"];
export const CLIENT_MESSAGE_TYPES: readonly ClientMessageType[] = clientMessageSchema.options.map(
  (option) => option.shape.type.value,
);

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
  | { type: "interview_completed"; sessionId: string; reason: CompletionReason; closing: TranscriptEntry | null }
  | { type: "error"; code: ErrorCode; message: string; recoverable: boolean }
  | { type: "pong" };
