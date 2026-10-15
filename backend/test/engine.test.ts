import { describe, expect, it } from "vitest";
import { DIFFICULTY_POLICIES, getContext } from "../src/interview/contexts";
import { InterviewEngine, InterviewStateError, validateDecision } from "../src/interview/engine";
import type { InterviewSession } from "../src/interview/types";
import { DemoProvider, normalizeQuestion } from "../src/llm/demo-provider";
import type { InterviewProvider, TurnRequest } from "../src/llm/provider";
import { STRONG_ANSWER, makeSession, makeSetup } from "./helpers";

const demoEngine = () => new InterviewEngine({ provider: new DemoProvider(), timeoutMs: 1000 });

async function answer(engine: InterviewEngine, session: InterviewSession, text: string) {
  engine.recordAnswer(session, text);
  return engine.respond(session);
}

function officerQuestions(session: InterviewSession) {
  return session.transcript.filter((e) => e.role === "officer").map((e) => e.text);
}

describe("InterviewEngine with the demo provider", () => {
  it("opens with a question that uses the candidate profile", async () => {
    const session = makeSession(makeSetup("f1"));
    const result = await demoEngine().start(session);

    expect(result.officerEntry.kind).toBe("opening");
    expect(result.officerEntry.text).toContain("Carnegie Mellon University");
    expect(session.phase).toBe("awaiting_answer");
    expect(session.questionCount).toBe(1);
    expect(session.currentTopicId).toBe("program");
  });

  it("opens each context differently", async () => {
    const h1b = makeSession(makeSetup("h1b"));
    const b1b2 = makeSession(makeSetup("b1b2"));
    expect((await demoEngine().start(h1b)).officerEntry.text).toContain("Acme Robotics");
    expect((await demoEngine().start(b1b2)).officerEntry.text).toContain("Pittsburgh");
  });

  it("asks a follow-up when the answer is too short", async () => {
    const engine = demoEngine();
    const session = makeSession();
    await engine.start(session);
    const result = await answer(engine, session, "Because it is good.");

    expect(result.officerEntry.kind).toBe("follow_up");
    expect(result.officerEntry.topicId).toBe("program");
    expect(session.followUps.program).toBe(1);
  });

  it("probes hedging in realistic mode but not in comfortable mode", async () => {
    const hedged = "I think the program at Carnegie Mellon is probably the best fit for my goals in machine learning research.";

    const realistic = makeSession(makeSetup("f1", "realistic"));
    const engine = demoEngine();
    await engine.start(realistic);
    expect((await answer(engine, realistic, hedged)).officerEntry.text).toMatch(/Are you certain/);

    const comfortable = makeSession(makeSetup("f1", "comfortable"));
    await engine.start(comfortable);
    expect((await answer(engine, comfortable, hedged)).officerEntry.kind).toBe("new_topic");
  });

  it("moves to a new topic after a complete, specific answer", async () => {
    const engine = demoEngine();
    const session = makeSession();
    await engine.start(session);
    const result = await answer(engine, session, STRONG_ANSWER);

    expect(result.officerEntry.kind).toBe("new_topic");
    expect(session.coveredTopicIds).toEqual(["program"]);
    expect(session.currentTopicId).toBe("institution");
  });

  it.each(["comfortable", "realistic", "strict", "pressure"] as const)(
    "completes a %s interview without repeating questions or exceeding the budget",
    async (difficulty) => {
      const engine = demoEngine();
      const session = makeSession(makeSetup("b1b2", difficulty));
      await engine.start(session);

      const answers = ["Yes.", "I think so.", STRONG_ANSWER];
      for (let i = 0; i < 40 && session.phase !== "completed"; i++) {
        await answer(engine, session, answers[i % answers.length]);
      }

      const questions = officerQuestions(session).slice(0, -1); // closing remark excluded
      expect(session.phase).toBe("completed");
      expect(session.completionReason).toBe("concluded");
      expect(session.transcript.at(-1)?.kind).toBe("closing");
      expect(session.questionCount).toBeLessThanOrEqual(DIFFICULTY_POLICIES[difficulty].maxQuestions);
      expect(new Set(questions.map(normalizeQuestion)).size).toBe(questions.length);
      for (const [, count] of Object.entries(session.followUps)) {
        expect(count).toBeLessThanOrEqual(DIFFICULTY_POLICIES[difficulty].maxFollowUpsPerTopic);
      }
    },
  );

  it("is deterministic for identical inputs", async () => {
    const run = async () => {
      const engine = demoEngine();
      const session = makeSession(makeSetup("h1b", "strict"));
      await engine.start(session);
      for (const text of ["Engineer.", STRONG_ANSWER, "Maybe two years.", STRONG_ANSWER]) {
        if (session.phase === "completed") break;
        await answer(engine, session, text);
      }
      return officerQuestions(session);
    };
    expect(await run()).toEqual(await run());
  });

  it("rejects answers while the officer is still responding", async () => {
    const engine = demoEngine();
    const session = makeSession();
    expect(() => engine.recordAnswer(session, "too early")).toThrow(InterviewStateError);
  });

  it("rejects answers after the interview has ended", async () => {
    const engine = demoEngine();
    const session = makeSession();
    await engine.start(session);
    engine.end(session, "candidate_ended");
    expect(session.completionReason).toBe("candidate_ended");
    expect(() => engine.recordAnswer(session, "hello")).toThrow(/already completed/);
  });
});

describe("InterviewEngine provider fallback", () => {
  const providerReturning = (value: unknown | (() => Promise<unknown>)): InterviewProvider => ({
    name: "stub",
    decideNextTurn: async () => (typeof value === "function" ? (value as () => Promise<unknown>)() : value),
  });

  it("falls back when the provider returns malformed output", async () => {
    const engine = new InterviewEngine({ provider: providerReturning({ nonsense: true }), timeoutMs: 1000 });
    const session = makeSession();
    const result = await engine.start(session);
    expect(result.decisionSource).toBe("fallback");
    expect(result.officerEntry.kind).toBe("opening");
  });

  it("falls back when the provider throws", async () => {
    const engine = new InterviewEngine({
      provider: providerReturning(() => Promise.reject(new Error("503"))),
      timeoutMs: 1000,
    });
    const result = await engine.start(makeSession());
    expect(result.decisionSource).toBe("fallback");
  });

  it("falls back when the provider times out", async () => {
    const engine = new InterviewEngine({
      provider: providerReturning(() => new Promise((resolve) => setTimeout(resolve, 500))),
      timeoutMs: 20,
    });
    const result = await engine.start(makeSession());
    expect(result.decisionSource).toBe("fallback");
  });

  it("uses a valid provider decision", async () => {
    const engine = new InterviewEngine({
      provider: providerReturning({ action: "opening", topicId: "funding", question: "Who pays for your studies?", reason: "" }),
      timeoutMs: 1000,
    });
    const session = makeSession();
    const result = await engine.start(session);
    expect(result.decisionSource).toBe("provider");
    expect(result.officerEntry.text).toBe("Who pays for your studies?");
    expect(session.currentTopicId).toBe("funding");
  });

  it("does not append a turn when the session ends while the provider is thinking", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const slow: InterviewProvider = {
      name: "slow",
      decideNextTurn: async (request) => {
        if (request.lastAnswer !== null) await gate;
        return new DemoProvider().decideNextTurn(request);
      },
    };
    const engine = new InterviewEngine({ provider: slow, timeoutMs: 5000 });
    const session = makeSession();
    await engine.start(session);
    engine.recordAnswer(session, STRONG_ANSWER);
    const pending = engine.respond(session);
    engine.end(session, "candidate_ended");
    release();

    const result = await pending;
    expect(result.completed).toBe(true);
    expect(session.transcript).toHaveLength(2);
    expect(session.completionReason).toBe("candidate_ended");
  });
});

describe("validateDecision", () => {
  const baseRequest = (overrides: Partial<TurnRequest> = {}): TurnRequest => {
    const setup = makeSetup();
    return {
      setup,
      context: getContext("f1"),
      policy: DIFFICULTY_POLICIES.realistic,
      transcript: [{ id: "1", role: "officer", text: "Why did you choose this university?", at: "", kind: "opening", topicId: "institution" }],
      lastAnswer: "Because of the faculty.",
      currentTopicId: "institution",
      coveredTopicIds: [],
      followUpsOnCurrentTopic: 0,
      questionCount: 1,
      remainingQuestions: 7,
      ...overrides,
    };
  };

  it("rejects repeated questions", () => {
    expect(validateDecision({ action: "follow_up", topicId: null, question: "Why did you choose this university?" }, baseRequest())).toBeNull();
  });

  it("rejects unknown or already-covered topics", () => {
    expect(validateDecision({ action: "new_topic", topicId: "weather", question: "Q?" }, baseRequest())).toBeNull();
    expect(validateDecision({ action: "new_topic", topicId: "institution", question: "Q?" }, baseRequest())).toBeNull();
  });

  it("rejects follow-ups beyond the per-topic limit", () => {
    expect(validateDecision({ action: "follow_up", topicId: null, question: "More?" }, baseRequest({ followUpsOnCurrentTopic: 1 }))).toBeNull();
  });

  it("rejects premature conclusion and requires it once the budget is spent", () => {
    expect(validateDecision({ action: "conclude", topicId: null, question: "Thanks." }, baseRequest())).toBeNull();
    expect(validateDecision({ action: "new_topic", topicId: "funding", question: "Who pays?" }, baseRequest({ remainingQuestions: 0 }))).toBeNull();
    expect(validateDecision({ action: "conclude", topicId: null, question: "Thanks." }, baseRequest({ remainingQuestions: 0 }))).not.toBeNull();
  });

  it("pins follow-ups to the current topic", () => {
    const decision = validateDecision({ action: "follow_up", topicId: "funding", question: "Which professor?" }, baseRequest());
    expect(decision?.topicId).toBe("institution");
  });
});
