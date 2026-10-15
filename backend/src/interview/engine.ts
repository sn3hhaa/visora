import { randomUUID } from "node:crypto";
import type { FastifyBaseLogger } from "fastify";
import { decideDeterministically, normalizeQuestion } from "../llm/demo-provider";
import { agentDecisionSchema, type AgentDecision, type InterviewProvider, type TurnRequest } from "../llm/provider";
import { DIFFICULTY_POLICIES, getContext } from "./contexts";
import type { CompletionReason, InterviewSession, TranscriptEntry } from "./types";

/** Live providers may not end the interview before this many questions unless topics run out. */
const MIN_QUESTIONS_BEFORE_CONCLUDE = 3;

export class InterviewStateError extends Error {
  constructor(
    readonly code: "not_awaiting_answer" | "session_completed",
    message: string,
  ) {
    super(message);
  }
}

export interface TurnResult {
  officerEntry: TranscriptEntry;
  completed: boolean;
  decisionSource: "provider" | "fallback";
}

export interface InterviewEngineOptions {
  provider: InterviewProvider;
  timeoutMs: number;
  logger?: FastifyBaseLogger;
}

export class InterviewEngine {
  constructor(private readonly options: InterviewEngineOptions) {}

  get providerName(): string {
    return this.options.provider.name;
  }

  async start(session: InterviewSession): Promise<TurnResult> {
    if (session.transcript.length > 0) {
      throw new InterviewStateError("not_awaiting_answer", "Interview has already started.");
    }
    session.phase = "processing";
    return this.advance(session, null);
  }

  /** Records the candidate's answer and moves the session to `processing`. Call `respond` next. */
  recordAnswer(session: InterviewSession, text: string): TranscriptEntry {
    if (session.phase === "completed") {
      throw new InterviewStateError("session_completed", "Interview has already completed.");
    }
    if (session.phase !== "awaiting_answer") {
      throw new InterviewStateError("not_awaiting_answer", "The officer has not finished the current turn.");
    }

    const candidateEntry = entry("candidate", text.trim());
    session.transcript.push(candidateEntry);
    session.phase = "processing";
    session.lastActivityAt = Date.now();
    return candidateEntry;
  }

  /** Produces the officer's turn in response to the most recent answer. */
  async respond(session: InterviewSession): Promise<TurnResult> {
    const last = session.transcript.at(-1);
    if (session.phase !== "processing" || last?.role !== "candidate") {
      throw new InterviewStateError("not_awaiting_answer", "No answer to respond to.");
    }
    return this.advance(session, last.text);
  }

  end(session: InterviewSession, reason: CompletionReason): void {
    if (session.phase === "completed") return;
    if (session.currentTopicId && !session.coveredTopicIds.includes(session.currentTopicId)) {
      session.coveredTopicIds.push(session.currentTopicId);
    }
    session.phase = "completed";
    session.completedAt = Date.now();
    session.completionReason = reason;
  }

  private async advance(session: InterviewSession, lastAnswer: string | null): Promise<TurnResult> {
    const request = buildRequest(session, lastAnswer);
    let decision: AgentDecision | null = null;
    let decisionSource: TurnResult["decisionSource"] = "provider";

    try {
      const raw = await withTimeout((signal) => this.options.provider.decideNextTurn(request, signal), this.options.timeoutMs);
      decision = validateDecision(raw, request);
      if (!decision) {
        this.options.logger?.warn({ sessionId: session.id, provider: this.providerName }, "provider returned an invalid decision; using fallback");
      }
    } catch (error) {
      this.options.logger?.warn({ sessionId: session.id, provider: this.providerName, err: error }, "provider failed; using fallback");
    }

    if (!decision) {
      decision = decideDeterministically(request);
      decisionSource = "fallback";
    }

    // The session may have been ended (e.g. candidate hung up) while the provider was thinking.
    if (session.completedAt !== null) {
      return { officerEntry: entry("officer", decision.question), completed: true, decisionSource };
    }

    const officerEntry = applyDecision(session, decision);
    return { officerEntry, completed: session.phase === "completed", decisionSource };
  }
}

function buildRequest(session: InterviewSession, lastAnswer: string | null): TurnRequest {
  const policy = DIFFICULTY_POLICIES[session.setup.difficulty];
  return {
    setup: session.setup,
    context: getContext(session.setup.context),
    policy,
    transcript: session.transcript,
    lastAnswer,
    currentTopicId: session.currentTopicId,
    coveredTopicIds: session.coveredTopicIds,
    followUpsOnCurrentTopic: session.currentTopicId ? session.followUps[session.currentTopicId] ?? 0 : 0,
    questionCount: session.questionCount,
    remainingQuestions: policy.maxQuestions - session.questionCount,
  };
}

/** Returns a decision that satisfies interview rules, or null if the provider's output must be discarded. */
export function validateDecision(raw: unknown, request: TurnRequest): AgentDecision | null {
  const parsed = agentDecisionSchema.safeParse(raw);
  if (!parsed.success) return null;
  const decision = parsed.data;
  const topicIds = new Set(request.context.topics.map((topic) => topic.id));
  const covered = new Set([...request.coveredTopicIds, request.currentTopicId]);
  const remainingTopics = request.context.topics.filter((topic) => !covered.has(topic.id));

  if (request.lastAnswer === null) {
    if (decision.action !== "opening" && decision.action !== "new_topic") return null;
    if (!decision.topicId || !topicIds.has(decision.topicId)) return null;
    return { ...decision, action: "opening" };
  }

  if (request.remainingQuestions <= 0) {
    return decision.action === "conclude" ? decision : null;
  }

  const askedBefore = request.transcript.some(
    (entry) => entry.role === "officer" && normalizeQuestion(entry.text) === normalizeQuestion(decision.question),
  );

  switch (decision.action) {
    case "follow_up":
      if (!request.currentTopicId) return null;
      if (request.followUpsOnCurrentTopic >= request.policy.maxFollowUpsPerTopic) return null;
      if (askedBefore) return null;
      return { ...decision, topicId: request.currentTopicId };
    case "new_topic":
      if (!decision.topicId || !remainingTopics.some((topic) => topic.id === decision.topicId)) return null;
      if (askedBefore) return null;
      return decision;
    case "conclude":
      if (request.questionCount < MIN_QUESTIONS_BEFORE_CONCLUDE && remainingTopics.length > 0) return null;
      return decision;
    default:
      return null;
  }
}

function applyDecision(session: InterviewSession, decision: AgentDecision): TranscriptEntry {
  session.lastActivityAt = Date.now();

  if (decision.action === "conclude") {
    const closing = entry("officer", decision.question, "closing");
    session.transcript.push(closing);
    if (session.currentTopicId && !session.coveredTopicIds.includes(session.currentTopicId)) {
      session.coveredTopicIds.push(session.currentTopicId);
    }
    session.currentTopicId = null;
    session.phase = "completed";
    session.completedAt = Date.now();
    session.completionReason = "concluded";
    return closing;
  }

  if (decision.action === "follow_up" && session.currentTopicId) {
    session.followUps[session.currentTopicId] = (session.followUps[session.currentTopicId] ?? 0) + 1;
  } else {
    if (session.currentTopicId && !session.coveredTopicIds.includes(session.currentTopicId)) {
      session.coveredTopicIds.push(session.currentTopicId);
    }
    session.currentTopicId = decision.topicId;
  }

  const kind = decision.action === "opening" ? "opening" : decision.action === "follow_up" ? "follow_up" : "new_topic";
  const question = entry("officer", decision.question, kind, session.currentTopicId ?? undefined);
  session.transcript.push(question);
  session.questionCount += 1;
  session.phase = "awaiting_answer";
  return question;
}

function entry(role: TranscriptEntry["role"], text: string, kind?: TranscriptEntry["kind"], topicId?: string): TranscriptEntry {
  return {
    id: randomUUID(),
    role,
    text,
    at: new Date().toISOString(),
    ...(kind ? { kind } : {}),
    ...(topicId ? { topicId } : {}),
  };
}

async function withTimeout<T>(run: (signal: AbortSignal) => Promise<T>, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Provider timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([run(controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}
