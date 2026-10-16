import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildSessionReport } from "../src/analytics/report";
import { InterviewEngine } from "../src/interview/engine";
import type { InterviewSession } from "../src/interview/types";
import { DemoProvider } from "../src/llm/demo-provider";
import { STRONG_ANSWER, makeSession, makeSetup } from "./helpers";

const VAGUE_ANSWER = "Um, I think it is a good place, you know.";
const START = new Date("2026-10-16T10:00:00.000Z");

const engine = () => new InterviewEngine({ provider: new DemoProvider(), timeoutMs: 1000 });

/** Answers each question after `delaySeconds` of (fake) time. */
async function play(session: InterviewSession, answers: string[], delaySeconds = 10) {
  const e = engine();
  vi.setSystemTime(START);
  session.createdAt = START.getTime();
  await e.start(session);
  for (const text of answers) {
    if (session.phase !== "awaiting_answer") break;
    vi.setSystemTime(Date.now() + delaySeconds * 1000);
    e.recordAnswer(session, text);
    await e.respond(session);
  }
  return e;
}

beforeEach(() => vi.useFakeTimers({ toFake: ["Date"] }));
afterEach(() => vi.useRealTimers());

describe("buildSessionReport", () => {
  it("measures a concluded interview from the real transcript", async () => {
    const session = makeSession(makeSetup("f1", "comfortable"));
    await play(session, Array(10).fill(STRONG_ANSWER), 12);
    expect(session.phase).toBe("completed");

    const report = buildSessionReport(session, "demo");
    const answered = session.transcript.filter((entry) => entry.role === "candidate").length;

    expect(report).toMatchObject({ sessionId: session.id, context: "f1", difficulty: "comfortable", provider: "demo", inputMode: "text", completionReason: "concluded" });
    expect(report.measured.answersGiven).toBe(answered);
    expect(report.measured.questionsAsked).toBe(session.questionCount);
    expect(report.measured.totalWords).toBe(answered * STRONG_ANSWER.split(/\s+/).length);
    expect(report.measured.medianResponseSeconds).toBe(12);
    expect(report.measured.durationSeconds).toBe(answered * 12);
    expect(report.measured.speakingRateWpm).toBeNull();
    expect(report.measured.topicsCovered.length).toBe(report.measured.topicsTotal);
    expect(report.answers.map((answer) => answer.questionNumber)).toEqual(Array.from({ length: answered }, (_, i) => i + 1));
  });

  it("rates strong answers as strong and finds nothing to fix", async () => {
    const session = makeSession(makeSetup("f1", "comfortable"));
    await play(session, Array(10).fill(STRONG_ANSWER));
    const report = buildSessionReport(session, "demo");

    const rated = report.assessed.dimensions.filter((dimension) => dimension.status === "assessed");
    expect(rated.map((dimension) => dimension.id)).toEqual(["completeness", "specificity", "directness"]);
    expect(rated.every((dimension) => dimension.status === "assessed" && dimension.rating === "strong")).toBe(true);
    expect(report.strengths.length).toBeGreaterThan(0);
    expect(report.recommendations).toEqual([]);
  });

  it("never claims to have assessed relevance or consistency", async () => {
    const session = makeSession();
    await play(session, [STRONG_ANSWER]);
    const report = buildSessionReport(session, "demo");
    const notAssessed = report.assessed.dimensions.filter((dimension) => dimension.status === "not_assessed").map((dimension) => dimension.id);
    expect(notAssessed).toEqual(["relevance", "consistency"]);
  });

  it("flags vague answers, counts fillers and hedges, and links the follow-ups they caused", async () => {
    const session = makeSession(makeSetup("f1", "realistic"));
    await play(session, [VAGUE_ANSWER, VAGUE_ANSWER, VAGUE_ANSWER]);
    const report = buildSessionReport(session, "demo");
    const first = report.answers[0];

    expect(first.measured.fillerWords).toEqual([
      { word: "um", count: 1 },
      { word: "you know", count: 1 },
    ]);
    expect(first.measured.hedges).toEqual(["i think"]);
    expect(first.assessed).toMatchObject({
      completeness: { rating: "needs_work" },
      specificity: { rating: "needs_work" },
      directness: { rating: "needs_work" },
    });
    expect(first.followUp).toBe(session.transcript[2].text);
    expect(report.measured.fillerWordCount).toBe(6);
    expect(report.measured.hedgeCount).toBe(3);
    expect(report.measured.followUpsAsked).toBeGreaterThan(0);

    const ratings = Object.fromEntries(
      report.assessed.dimensions.flatMap((dimension) => (dimension.status === "assessed" ? [[dimension.id, dimension.rating]] : [])),
    );
    expect(ratings).toEqual({ completeness: "needs_work", specificity: "needs_work", directness: "needs_work" });
    expect(report.improvements.some((line) => line.includes("12-word bar"))).toBe(true);
    // Topic-specific rehearsal advice uses the probe for the topic that was answered vaguely.
    expect(report.recommendations.some((line) => line.startsWith("Course specifics:"))).toBe(true);
  });

  it("reports a candidate-ended interview with no answers without inventing feedback", async () => {
    const session = makeSession(makeSetup("b1b2"));
    const e = await play(session, []);
    vi.setSystemTime(Date.now() + 5000);
    e.end(session, "candidate_ended");
    const report = buildSessionReport(session, "demo");

    expect(report.completionReason).toBe("candidate_ended");
    expect(report.measured).toMatchObject({ answersGiven: 0, totalWords: 0, averageWordsPerAnswer: null, medianResponseSeconds: null, durationSeconds: 5 });
    expect(report.answers).toEqual([]);
    expect(report.strengths).toEqual([]);
    expect(report.assessed.dimensions.every((dimension) => dimension.status === "not_assessed")).toBe(true);
  });
});
