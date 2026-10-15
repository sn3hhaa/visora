import type { FastifyBaseLogger } from "fastify";
import { WebSocket, type RawData } from "ws";
import { DIFFICULTY_POLICIES } from "../interview/contexts";
import { InterviewStateError, type InterviewEngine, type TurnResult } from "../interview/engine";
import { SessionCapacityError, type SessionManager } from "../interview/session-manager";
import type { InterviewSession } from "../interview/types";
import {
  CLIENT_MESSAGE_TYPES,
  PROTOCOL_VERSION,
  clientMessageSchema,
  type ClientMessage,
  type ErrorCode,
  type ServerMessage,
  type SessionSnapshot,
} from "./protocol";

export interface InterviewSocketDeps {
  sessions: SessionManager;
  engine: InterviewEngine;
  logger: FastifyBaseLogger;
  /** Session id → the socket currently attached to it. */
  attachments: Map<string, WebSocket>;
  rateLimit?: { windowMs: number; maxMessages: number };
}

const DEFAULT_RATE_LIMIT = { windowMs: 10_000, maxMessages: 30 };
export const CLOSE_SUPERSEDED = 4000;
export const CLOSE_POLICY_VIOLATION = 1008;

export function handleInterviewSocket(socket: WebSocket, deps: InterviewSocketDeps): void {
  const { sessions, engine, attachments } = deps;
  const rateLimit = deps.rateLimit ?? DEFAULT_RATE_LIMIT;
  let sessionId: string | null = null;
  let windowStart = Date.now();
  let messagesInWindow = 0;
  const log = deps.logger.child({ component: "interview-socket" });

  const send = (message: ServerMessage) => sendTo(socket, message);
  const sendError = (code: ErrorCode, message: string, recoverable = true) =>
    send({ type: "error", code, message, recoverable });

  const attach = (session: InterviewSession) => {
    const previous = attachments.get(session.id);
    if (previous && previous !== socket && previous.readyState === WebSocket.OPEN) {
      previous.close(CLOSE_SUPERSEDED, "Session resumed on another connection");
    }
    attachments.set(session.id, socket);
    sessionId = session.id;
  };

  const currentSession = (): InterviewSession | null => {
    if (!sessionId) {
      sendError("no_session", "Start a session before sending this message.");
      return null;
    }
    const session = sessions.get(sessionId);
    if (!session) {
      sendError("session_not_found", "This session has expired. Please start a new interview.", false);
      sessionId = null;
      return null;
    }
    return session;
  };

  /** Officer turns go to whichever socket is attached now, which may differ after a resume. */
  const deliverTurn = (session: InterviewSession, result: TurnResult) => {
    const target = attachments.get(session.id);
    if (!target) return;
    if (result.completed) {
      // Only a provider-concluded interview carries a closing remark; a candidate hang-up has already been reported.
      if (session.completionReason === "concluded") {
        sendTo(target, { type: "interview_completed", sessionId: session.id, reason: "concluded", closing: result.officerEntry });
      }
      return;
    }
    sendTo(target, {
      type: "next_question",
      entry: result.officerEntry,
      questionNumber: session.questionCount,
      maxQuestions: DIFFICULTY_POLICIES[session.setup.difficulty].maxQuestions,
    });
  };

  const handlers: { [K in ClientMessage["type"]]: (message: Extract<ClientMessage, { type: K }>) => Promise<void> | void } = {
    ping: () => send({ type: "pong" }),

    session_start: async ({ setup }) => {
      if (sessionId) {
        sendError("session_exists", "This connection already has an active session.");
        return;
      }
      let session: InterviewSession;
      try {
        session = sessions.create(setup);
      } catch (error) {
        if (error instanceof SessionCapacityError) {
          sendError("capacity", error.message);
          return;
        }
        throw error;
      }
      attach(session);
      log.info({ sessionId: session.id, context: setup.context, difficulty: setup.difficulty }, "session started");
      send({ type: "session_started", protocolVersion: PROTOCOL_VERSION, provider: engine.providerName, resumed: false, ...snapshot(session) });
      send({ type: "agent_processing" });
      deliverTurn(session, await engine.start(session));
    },

    session_resume: ({ sessionId: requestedId }) => {
      if (sessionId) {
        sendError("session_exists", "This connection already has an active session.");
        return;
      }
      const session = sessions.get(requestedId);
      if (!session) {
        sendError("session_not_found", "This session has expired. Please start a new interview.", false);
        return;
      }
      sessions.touch(session);
      attach(session);
      log.info({ sessionId: session.id }, "session resumed");
      send({ type: "session_started", protocolVersion: PROTOCOL_VERSION, provider: engine.providerName, resumed: true, ...snapshot(session) });
    },

    answer_submit: async ({ text }) => {
      const session = currentSession();
      if (!session) return;
      if (session.phase === "completed") {
        sendError("session_completed", "This interview has already ended.", false);
        return;
      }
      if (session.phase === "processing") {
        sendError("busy", "Please wait for the officer's next question.");
        return;
      }
      const candidateEntry = engine.recordAnswer(session, text);
      send({ type: "transcript_update", entry: candidateEntry });
      send({ type: "agent_processing" });
      deliverTurn(session, await engine.respond(session));
    },

    session_end: () => {
      const session = currentSession();
      if (!session) return;
      if (session.phase !== "completed") {
        engine.end(session, "candidate_ended");
        log.info({ sessionId: session.id }, "session ended by candidate");
      }
      send({ type: "interview_completed", sessionId: session.id, reason: session.completionReason ?? "candidate_ended", closing: null });
    },
  };

  socket.on("message", async (raw: RawData, isBinary: boolean) => {
    const now = Date.now();
    if (now - windowStart > rateLimit.windowMs) {
      windowStart = now;
      messagesInWindow = 0;
    }
    messagesInWindow += 1;
    if (messagesInWindow > rateLimit.maxMessages * 2) {
      socket.close(CLOSE_POLICY_VIOLATION, "Rate limit exceeded");
      return;
    }
    if (messagesInWindow > rateLimit.maxMessages) {
      sendError("rate_limited", "Too many messages. Slow down.");
      return;
    }

    if (isBinary) {
      sendError("invalid_message", "Binary frames are not supported on this endpoint.");
      return;
    }

    let data: unknown;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      sendError("invalid_json", "Message is not valid JSON.");
      return;
    }

    const parsed = clientMessageSchema.safeParse(data);
    if (!parsed.success) {
      const type = (data as { type?: unknown } | null)?.type;
      if (typeof type !== "string" || !(CLIENT_MESSAGE_TYPES as readonly string[]).includes(type)) {
        sendError("unsupported_message", `Unsupported message type: ${String(type)}`);
      } else {
        sendError("invalid_message", parsed.error.issues.map((issue) => `${issue.path.join(".") || "message"}: ${issue.message}`).join("; "));
      }
      return;
    }

    try {
      const message = parsed.data;
      await (handlers[message.type] as (m: ClientMessage) => Promise<void> | void)(message);
    } catch (error) {
      if (error instanceof InterviewStateError) {
        sendError(error.code === "session_completed" ? "session_completed" : "busy", error.message);
        return;
      }
      log.error({ err: error, sessionId }, "failed to handle message");
      sendError("internal", "Something went wrong while processing your message.");
    }
  });

  socket.on("close", () => {
    if (sessionId && attachments.get(sessionId) === socket) {
      attachments.delete(sessionId);
      log.info({ sessionId }, "socket detached; session kept until idle expiry");
    }
  });

  socket.on("error", (error) => log.warn({ err: error, sessionId }, "socket error"));
}

function sendTo(target: WebSocket, message: ServerMessage): void {
  if (target.readyState === WebSocket.OPEN) target.send(JSON.stringify(message));
}

function snapshot(session: InterviewSession): SessionSnapshot {
  return {
    sessionId: session.id,
    context: session.setup.context,
    difficulty: session.setup.difficulty,
    phase: session.phase,
    questionCount: session.questionCount,
    maxQuestions: DIFFICULTY_POLICIES[session.setup.difficulty].maxQuestions,
    transcript: [...session.transcript],
  };
}
