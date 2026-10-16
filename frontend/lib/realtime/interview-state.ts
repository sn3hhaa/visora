import type { CompletionReason, ErrorCode, ServerMessage, TranscriptEntry } from "./protocol";
import type { SessionReport } from "./report";

export type ConnectionStatus = "idle" | "connecting" | "open" | "reconnecting" | "closed";

/** UI-facing interview phase. `idle` = no session yet; `starting` = waiting for `session_started`. */
export type RoomPhase = "idle" | "starting" | "awaiting_answer" | "processing" | "completed";

export interface InterviewRoomState {
  connection: ConnectionStatus;
  phase: RoomPhase;
  sessionId: string | null;
  provider: string | null;
  questionNumber: number;
  maxQuestions: number;
  transcript: TranscriptEntry[];
  /** `report` is null when the room re-attached to an already-finished session; fetch it over HTTP instead. */
  completion: { reason: CompletionReason; closing: TranscriptEntry | null; report: SessionReport | null } | null;
  error: { code: ErrorCode | "connection"; message: string; recoverable: boolean } | null;
}

export const initialRoomState: InterviewRoomState = {
  connection: "idle",
  phase: "idle",
  sessionId: null,
  provider: null,
  questionNumber: 0,
  maxQuestions: 0,
  transcript: [],
  completion: null,
  error: null,
};

export type RoomAction =
  | { type: "connecting"; resuming: boolean }
  | { type: "connected" }
  | { type: "disconnected"; willRetry: boolean; message?: string }
  | { type: "server"; message: ServerMessage }
  | { type: "dismiss_error" }
  | { type: "reset" };

function appendEntry(transcript: TranscriptEntry[], entry: TranscriptEntry): TranscriptEntry[] {
  // A resume snapshot can race with a live event; never show the same entry twice.
  return transcript.some((existing) => existing.id === entry.id) ? transcript : [...transcript, entry];
}

export function interviewRoomReducer(state: InterviewRoomState, action: RoomAction): InterviewRoomState {
  switch (action.type) {
    case "connecting":
      return {
        ...state,
        connection: action.resuming ? "reconnecting" : "connecting",
        phase: action.resuming ? state.phase : "starting",
        error: null,
      };
    case "connected":
      return { ...state, connection: "open" };
    case "disconnected":
      return {
        ...state,
        connection: action.willRetry ? "reconnecting" : "closed",
        // A connection that never produced a session leaves nothing to show; let the candidate try again.
        phase: !state.sessionId && state.phase === "starting" ? "idle" : state.phase,
        error: action.message ? { code: "connection", message: action.message, recoverable: action.willRetry } : state.error,
      };
    case "dismiss_error":
      return { ...state, error: null };
    case "reset":
      return initialRoomState;
    case "server":
      return applyServerMessage(state, action.message);
  }
}

function applyServerMessage(state: InterviewRoomState, message: ServerMessage): InterviewRoomState {
  switch (message.type) {
    case "session_started":
      return {
        ...state,
        sessionId: message.sessionId,
        provider: message.provider,
        maxQuestions: message.maxQuestions,
        questionNumber: message.questionCount,
        // On resume the server snapshot is authoritative.
        transcript: message.resumed ? message.transcript : state.transcript,
        phase: message.phase === "completed" ? "completed" : message.phase,
        error: null,
      };
    case "agent_processing":
      return state.phase === "completed" ? state : { ...state, phase: "processing" };
    case "next_question":
      return {
        ...state,
        phase: "awaiting_answer",
        questionNumber: message.questionNumber,
        maxQuestions: message.maxQuestions,
        transcript: appendEntry(state.transcript, message.entry),
      };
    case "transcript_update":
      return { ...state, transcript: appendEntry(state.transcript, message.entry) };
    case "interview_completed":
      return {
        ...state,
        phase: "completed",
        completion: { reason: message.reason, closing: message.closing, report: message.report ?? null },
        transcript: message.closing ? appendEntry(state.transcript, message.closing) : state.transcript,
      };
    case "error": {
      const error = { code: message.code, message: message.message, recoverable: message.recoverable };
      if (message.code === "session_not_found") {
        return { ...initialRoomState, connection: "closed", error };
      }
      return { ...state, error };
    }
    case "pong":
      return state;
  }
}
