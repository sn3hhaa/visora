import type { FastifyInstance } from "fastify";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { buildApp, type BuildAppOptions } from "../src/app";
import { loadConfig } from "../src/config/env";
import { DemoProvider } from "../src/llm/demo-provider";
import type { InterviewProvider } from "../src/llm/provider";
import { STRONG_ANSWER, TestClient, makeSetup } from "./helpers";

let app: FastifyInstance | null = null;
const clients: TestClient[] = [];

async function start(options: BuildAppOptions = {}) {
  app = await buildApp(loadConfig({ NODE_ENV: "test", LOG_LEVEL: "silent", PORT: "0" }), options);
  await app.listen({ port: 0, host: "127.0.0.1" });
  const { port } = app.server.address() as AddressInfo;
  return {
    http: `http://127.0.0.1:${port}`,
    connect: async (headers?: Record<string, string>) => {
      const client = await TestClient.connect(`ws://127.0.0.1:${port}/ws/interview`, headers);
      clients.push(client);
      return client;
    },
  };
}

afterEach(async () => {
  clients.splice(0).forEach((client) => client.close());
  await app?.close();
  app = null;
});

describe("GET /health", () => {
  it("reports status and provider", async () => {
    const { http } = await start();
    const body = await (await fetch(`${http}/health`)).json();
    expect(body).toMatchObject({ status: "ok", service: "visora-backend", provider: "demo", activeSessions: 0 });
  });

  it("allows the configured CORS origin only", async () => {
    const { http } = await start();
    const allowed = await fetch(`${http}/health`, { headers: { Origin: "http://localhost:3000" } });
    const denied = await fetch(`${http}/health`, { headers: { Origin: "http://evil.example" } });
    expect(allowed.headers.get("access-control-allow-origin")).toBe("http://localhost:3000");
    expect(denied.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("interview WebSocket", () => {
  it("runs a complete interview from setup to conclusion", async () => {
    const { connect } = await start();
    const client = await connect({ Origin: "http://localhost:3000" });

    client.send({ type: "session_start", setup: makeSetup("f1", "comfortable") });
    const started = await client.next("session_started");
    expect(started).toMatchObject({ context: "f1", difficulty: "comfortable", provider: "demo", resumed: false, maxQuestions: 6 });
    expect(started.sessionId).toMatch(/^[0-9a-f-]{36}$/);
    await client.next("agent_processing");
    const first = await client.next("next_question");
    expect(first.entry.text).toContain("Carnegie Mellon University");
    expect(first.questionNumber).toBe(1);

    let completed = null;
    for (let turn = 0; turn < 10 && !completed; turn++) {
      client.send({ type: "answer_submit", text: STRONG_ANSWER });
      const echoed = await client.next("transcript_update");
      expect(echoed.entry).toMatchObject({ role: "candidate", text: STRONG_ANSWER });
      await client.next("agent_processing");
      const reply = await client.nextOf(["next_question", "interview_completed"]);
      if (reply.type === "interview_completed") completed = reply;
    }

    expect(completed).toMatchObject({ reason: "concluded", sessionId: started.sessionId });
    expect(completed!.closing.kind).toBe("closing");
  });

  it("validates messages", async () => {
    const { connect } = await start();
    const client = await connect();

    client.send("not json");
    expect((await client.next("error")).code).toBe("invalid_json");

    client.send({ type: "launch_missiles" });
    expect((await client.next("error")).code).toBe("unsupported_message");

    client.send({ type: "session_start", setup: { context: "f1", difficulty: "impossible", profile: {} } });
    const invalid = await client.next("error");
    expect(invalid.code).toBe("invalid_message");
    expect(invalid.message).toContain("difficulty");

    client.send({ type: "answer_submit", text: "hello" });
    expect((await client.next("error")).code).toBe("no_session");

    client.send({ type: "answer_submit", text: "x".repeat(5000) });
    expect((await client.next("error")).code).toBe("invalid_message");

    client.send({ type: "ping" });
    await client.next("pong");
  });

  it("rejects a second session on the same connection", async () => {
    const { connect } = await start();
    const client = await connect();
    client.send({ type: "session_start", setup: makeSetup() });
    await client.next("next_question");
    client.send({ type: "session_start", setup: makeSetup() });
    expect((await client.next("error")).code).toBe("session_exists");
  });

  it("rejects answers while the officer is still thinking", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const slow: InterviewProvider = {
      name: "slow",
      decideNextTurn: async (request) => {
        if (request.lastAnswer !== null) await gate;
        return new DemoProvider().decideNextTurn(request);
      },
    };
    const { connect } = await start({ provider: slow });
    const client = await connect();
    client.send({ type: "session_start", setup: makeSetup() });
    await client.next("next_question");

    client.send({ type: "answer_submit", text: STRONG_ANSWER });
    await client.next("agent_processing");
    client.send({ type: "answer_submit", text: "again" });
    expect((await client.next("error")).code).toBe("busy");
    release();
    await client.next("next_question");
  });

  it("ends a session on request and refuses further answers", async () => {
    const { connect } = await start();
    const client = await connect();
    client.send({ type: "session_start", setup: makeSetup("h1b") });
    const { sessionId } = await client.next("session_started");
    await client.next("next_question");

    client.send({ type: "session_end" });
    expect(await client.next("interview_completed")).toMatchObject({ sessionId, reason: "candidate_ended", closing: null });

    client.send({ type: "answer_submit", text: "late answer" });
    expect((await client.next("error")).code).toBe("session_completed");
  });

  it("resumes a session after a disconnect", async () => {
    const { connect } = await start();
    const first = await connect();
    first.send({ type: "session_start", setup: makeSetup("b1b2", "strict") });
    const { sessionId } = await first.next("session_started");
    await first.next("next_question");
    first.close();
    await first.closed();

    const second = await connect();
    second.send({ type: "session_resume", sessionId });
    const resumed = await second.next("session_started");
    expect(resumed).toMatchObject({ sessionId, resumed: true, phase: "awaiting_answer", questionCount: 1 });
    expect(resumed.transcript).toHaveLength(1);

    second.send({ type: "answer_submit", text: STRONG_ANSWER });
    await second.next("next_question");
  });

  it("supersedes the old connection when a session is resumed elsewhere", async () => {
    const { connect } = await start();
    const first = await connect();
    first.send({ type: "session_start", setup: makeSetup() });
    const { sessionId } = await first.next("session_started");
    await first.next("next_question");

    const second = await connect();
    second.send({ type: "session_resume", sessionId });
    await second.next("session_started");
    expect(await first.closed()).toBe(4000);
  });

  it("reports unknown sessions on resume", async () => {
    const { connect } = await start();
    const client = await connect();
    client.send({ type: "session_resume", sessionId: "00000000-0000-4000-8000-000000000000" });
    expect(await client.next("error")).toMatchObject({ code: "session_not_found", recoverable: false });
  });

  it("closes connections from disallowed browser origins", async () => {
    const { connect } = await start();
    const client = await connect({ Origin: "http://evil.example" });
    expect(await client.closed()).toBe(1008);
  });

  it("rate limits chatty clients", async () => {
    const { connect } = await start({ rateLimit: { windowMs: 60_000, maxMessages: 3 } });
    const client = await connect();
    for (let i = 0; i < 4; i++) client.send({ type: "ping" });
    expect((await client.next("error")).code).toBe("rate_limited");
    for (let i = 0; i < 4; i++) client.send({ type: "ping" });
    expect(await client.closed()).toBe(1008);
  });
});
