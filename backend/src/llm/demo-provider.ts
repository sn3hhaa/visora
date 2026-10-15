import type { InterviewDifficulty } from "../interview/types";
import { analyzeAnswer } from "../interview/answer-analysis";
import type { AgentDecision, InterviewProvider, TurnRequest } from "./provider";

const ELABORATE_PROBES: Record<InterviewDifficulty, string> = {
  comfortable: "Take your time. Could you tell me a little more about that?",
  realistic: "Can you elaborate on that?",
  strict: "That answer is incomplete. Please explain in more detail.",
  pressure: "That's not enough. Be specific.",
};

/**
 * Deterministic, rule-based officer. Used in demo mode and as the fallback
 * whenever a live provider fails or returns an invalid decision.
 */
export class DemoProvider implements InterviewProvider {
  readonly name = "demo";

  async decideNextTurn(request: TurnRequest): Promise<AgentDecision> {
    return decideDeterministically(request);
  }
}

export function decideDeterministically(request: TurnRequest): AgentDecision {
  const { context, setup, policy, lastAnswer, transcript } = request;
  const asked = new Set(
    transcript.filter((entry) => entry.role === "officer").map((entry) => normalizeQuestion(entry.text)),
  );
  const isNew = (question: string) => !asked.has(normalizeQuestion(question));

  if (lastAnswer === null) {
    return {
      action: "opening",
      topicId: context.topics[0]?.id ?? null,
      question: context.opening(setup),
      reason: "Opening question.",
    };
  }

  if (request.remainingQuestions <= 0) {
    return conclude(request, "Question budget reached.");
  }

  const currentTopic = context.topics.find((topic) => topic.id === request.currentTopicId);
  if (currentTopic && request.followUpsOnCurrentTopic < policy.maxFollowUpsPerTopic) {
    const analysis = analyzeAnswer(lastAnswer, policy);

    if (analysis.isTooShort) {
      const probe = ELABORATE_PROBES[setup.difficulty];
      if (isNew(probe)) {
        return { action: "follow_up", topicId: currentTopic.id, question: probe, reason: `Answer too short (${analysis.wordCount} words).` };
      }
      if (isNew(currentTopic.specificsProbe)) {
        return { action: "follow_up", topicId: currentTopic.id, question: currentTopic.specificsProbe, reason: "Answer too short." };
      }
    }

    if (policy.probeHedging && analysis.hedges.length > 0) {
      const probe = `You said "${analysis.hedges[0]}". Are you certain? Please give me a definite answer.`;
      if (isNew(probe)) {
        return { action: "follow_up", topicId: currentTopic.id, question: probe, reason: `Hedging: ${analysis.hedges.join(", ")}.` };
      }
    }

    if (!analysis.hasConcreteDetail && isNew(currentTopic.specificsProbe)) {
      return { action: "follow_up", topicId: currentTopic.id, question: currentTopic.specificsProbe, reason: "No concrete detail." };
    }
  }

  const covered = new Set([...request.coveredTopicIds, request.currentTopicId]);
  for (const topic of context.topics) {
    if (covered.has(topic.id)) continue;
    const variants = topic.questions(setup);
    const ordered = variants.map((_, i) => variants[(request.questionCount + i) % variants.length]);
    const question = ordered.find(isNew);
    if (question) {
      return { action: "new_topic", topicId: topic.id, question, reason: `Moving to ${topic.label}.` };
    }
  }

  return conclude(request, "All topics covered.");
}

function conclude(request: TurnRequest, reason: string): AgentDecision {
  return { action: "conclude", topicId: null, question: request.context.closing, reason };
}

export function normalizeQuestion(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
