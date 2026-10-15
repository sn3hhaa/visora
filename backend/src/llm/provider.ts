import { z } from "zod";
import type { ContextDefinition, DifficultyPolicy } from "../interview/contexts";
import type { InterviewSetup, TranscriptEntry } from "../interview/types";

/** Everything a provider needs to decide the officer's next turn. */
export interface TurnRequest {
  setup: InterviewSetup;
  context: ContextDefinition;
  policy: DifficultyPolicy;
  transcript: readonly TranscriptEntry[];
  /** `null` when requesting the opening question. */
  lastAnswer: string | null;
  currentTopicId: string | null;
  coveredTopicIds: readonly string[];
  followUpsOnCurrentTopic: number;
  questionCount: number;
  remainingQuestions: number;
}

export const agentDecisionSchema = z.object({
  action: z.enum(["opening", "follow_up", "new_topic", "conclude"]),
  topicId: z.string().nullable(),
  question: z.string().trim().min(1).max(500),
  reason: z.string().trim().max(500).default(""),
});

export type AgentDecision = z.infer<typeof agentDecisionSchema>;

/**
 * An interview "brain". Implementations return a raw decision; the engine
 * validates it and applies interview rules, so providers may be unreliable.
 */
export interface InterviewProvider {
  readonly name: string;
  decideNextTurn(request: TurnRequest, signal?: AbortSignal): Promise<unknown>;
}
