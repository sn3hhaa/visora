"use client";

import * as React from "react";
import { CLOSE_SUPERSEDED, parseServerMessage, type ClientMessage, type InterviewSetupPayload } from "@/lib/realtime/protocol";
import { initialRoomState, interviewRoomReducer } from "@/lib/realtime/interview-state";
import { cacheReport } from "@/lib/realtime/report";

// `||`, not `??`: CI passes an empty string when no backend URL is configured.
export const INTERVIEW_WS_URL = process.env.NEXT_PUBLIC_INTERVIEW_WS_URL || "ws://localhost:4000/ws/interview";

/** Lets a page reload re-attach to the same backend session (the backend keeps it until idle expiry). */
const SESSION_STORAGE_KEY = "visora-active-session";
const MAX_RECONNECT_ATTEMPTS = 5;
const KEEPALIVE_MS = 25_000;

/** Developers running locally can start the backend; visitors to a static deployment cannot. */
function unreachableMessage(): string {
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  return local
    ? "Could not reach the interview server. Make sure the backend is running."
    : "The interview server is not available on this hosted preview. To run a full interview, start Visora locally (see the README on GitHub).";
}

function readStoredSessionId(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeSessionId(id: string | null) {
  try {
    if (id) window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    else window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode); resume-after-reload simply won't work.
  }
}

export function useInterviewSession(url: string = INTERVIEW_WS_URL) {
  const [state, dispatch] = React.useReducer(interviewRoomReducer, initialRoomState);

  const socketRef = React.useRef<WebSocket | null>(null);
  const sessionIdRef = React.useRef<string | null>(null);
  const completedRef = React.useRef(false);
  const attemptsRef = React.useRef(0);
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepaliveRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  /** Sockets we closed on purpose; their close events must not trigger a reconnect. */
  const intentionalCloses = React.useRef(new WeakSet<WebSocket>());
  /** Latest `connect`, so a scheduled reconnect can call it without a self-reference. */
  const connectRef = React.useRef<(message: ClientMessage) => void>(() => {});

  const clearTimers = React.useCallback(() => {
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    if (keepaliveRef.current) clearInterval(keepaliveRef.current);
    retryTimerRef.current = null;
    keepaliveRef.current = null;
  }, []);

  const closeSocket = React.useCallback(() => {
    const socket = socketRef.current;
    socketRef.current = null;
    clearTimers();
    if (socket) {
      intentionalCloses.current.add(socket);
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, "Client closed");
      }
    }
  }, [clearTimers]);

  const connect = React.useCallback(
    (firstMessage: ClientMessage) => {
      closeSocket();
      const resuming = firstMessage.type === "session_resume";
      dispatch({ type: "connecting", resuming });

      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch {
        dispatch({ type: "disconnected", willRetry: false, message: `Invalid interview server address: ${url}` });
        return;
      }
      socketRef.current = socket;

      socket.onopen = () => {
        attemptsRef.current = 0;
        dispatch({ type: "connected" });
        socket.send(JSON.stringify(firstMessage));
        keepaliveRef.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "ping" } satisfies ClientMessage));
        }, KEEPALIVE_MS);
      };

      socket.onmessage = (event) => {
        const message = parseServerMessage(event.data);
        if (!message) return;
        dispatch({ type: "server", message });

        if (message.type === "session_started") {
          sessionIdRef.current = message.sessionId;
          completedRef.current = message.phase === "completed";
          storeSessionId(completedRef.current ? null : message.sessionId);
        } else if (message.type === "interview_completed") {
          completedRef.current = true;
          if (message.report) cacheReport(message.report);
          storeSessionId(null);
          closeSocket();
        } else if (message.type === "error" && message.code === "session_not_found") {
          sessionIdRef.current = null;
          storeSessionId(null);
          closeSocket();
        }
      };

      socket.onclose = (event) => {
        if (intentionalCloses.current.has(socket)) return;
        if (socketRef.current === socket) socketRef.current = null;
        clearTimers();

        if (event.code === CLOSE_SUPERSEDED) {
          dispatch({ type: "disconnected", willRetry: false, message: "This interview was opened in another tab." });
          return;
        }
        const sessionId = sessionIdRef.current;
        if (!sessionId || completedRef.current) {
          dispatch({
            type: "disconnected",
            willRetry: false,
            message: sessionId ? undefined : unreachableMessage(),
          });
          return;
        }
        if (attemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          dispatch({ type: "disconnected", willRetry: false, message: "Lost connection to the interview server." });
          return;
        }
        const delay = Math.min(500 * 2 ** attemptsRef.current, 8000);
        attemptsRef.current += 1;
        dispatch({ type: "disconnected", willRetry: true, message: "Connection lost. Reconnecting…" });
        retryTimerRef.current = setTimeout(() => connectRef.current({ type: "session_resume", sessionId }), delay);
      };
    },
    [url, closeSocket, clearTimers],
  );

  React.useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  // Re-attach after a page reload, and always release the socket on unmount.
  React.useEffect(() => {
    const storedId = readStoredSessionId();
    if (storedId) {
      sessionIdRef.current = storedId;
      connect({ type: "session_resume", sessionId: storedId });
    }
    return closeSocket;
  }, [connect, closeSocket]);

  const send = React.useCallback((message: ClientMessage): boolean => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(message));
    return true;
  }, []);

  const start = React.useCallback(
    (setup: InterviewSetupPayload) => {
      sessionIdRef.current = null;
      completedRef.current = false;
      attemptsRef.current = 0;
      storeSessionId(null);
      connect({ type: "session_start", setup });
    },
    [connect],
  );

  const submitAnswer = React.useCallback((text: string) => send({ type: "answer_submit", text }), [send]);

  const end = React.useCallback(() => {
    if (!send({ type: "session_end" })) {
      // Not connected: nothing to tell the server, the session will expire on its own.
      closeSocket();
      storeSessionId(null);
      dispatch({ type: "reset" });
    }
  }, [send, closeSocket]);

  const reset = React.useCallback(() => {
    closeSocket();
    sessionIdRef.current = null;
    completedRef.current = false;
    storeSessionId(null);
    dispatch({ type: "reset" });
  }, [closeSocket]);

  const dismissError = React.useCallback(() => dispatch({ type: "dismiss_error" }), []);

  return { state, start, submitAnswer, end, reset, dismissError };
}
