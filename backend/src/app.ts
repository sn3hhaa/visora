import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import type { WebSocket } from "ws";
import type { AppConfig } from "./config/env";
import { InterviewEngine } from "./interview/engine";
import { SessionManager } from "./interview/session-manager";
import { DemoProvider } from "./llm/demo-provider";
import type { InterviewProvider } from "./llm/provider";
import { handleInterviewSocket, type InterviewSocketDeps } from "./websocket/interview.socket";

export interface BuildAppOptions {
  /** Overrides the provider selected by config (used in tests). */
  provider?: InterviewProvider;
  rateLimit?: InterviewSocketDeps["rateLimit"];
}

export async function buildApp(config: AppConfig, options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: config.LOG_LEVEL },
    bodyLimit: 64 * 1024,
  });

  const provider = options.provider ?? createProvider(config);
  const engine = new InterviewEngine({ provider, timeoutMs: config.LLM_TIMEOUT_MS, logger: app.log });
  const sessions = new SessionManager({
    idleTtlMs: config.SESSION_IDLE_TTL_MS,
    maxSessions: config.MAX_SESSIONS,
    sweepIntervalMs: config.SESSION_SWEEP_INTERVAL_MS,
    onExpire: (session) => {
      engine.end(session, "expired");
      app.log.info({ sessionId: session.id }, "session expired");
    },
  });
  const attachments = new Map<string, WebSocket>();

  sessions.start();
  app.addHook("onClose", async () => sessions.stop());

  await app.register(cors, { origin: config.CORS_ORIGINS });
  await app.register(websocket, { options: { maxPayload: config.WS_MAX_PAYLOAD_BYTES } });

  app.get("/health", async () => ({
    status: "ok",
    service: "visora-backend",
    provider: engine.providerName,
    activeSessions: sessions.size,
    timestamp: new Date().toISOString(),
  }));

  app.get("/ws/interview", { websocket: true }, (socket, request) => {
    const origin = request.headers.origin;
    // Browsers always send Origin on WebSocket upgrades; non-browser clients (tests, CLI) may omit it.
    if (origin && !config.CORS_ORIGINS.includes(origin)) {
      request.log.warn({ origin }, "rejected websocket from disallowed origin");
      socket.close(1008, "Origin not allowed");
      return;
    }
    handleInterviewSocket(socket, { sessions, engine, logger: app.log, attachments, rateLimit: options.rateLimit });
  });

  return app;
}

function createProvider(config: AppConfig): InterviewProvider {
  switch (config.LLM_PROVIDER) {
    case "demo":
      return new DemoProvider();
  }
}
