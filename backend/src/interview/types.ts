import { z } from "zod";

export const interviewContextIdSchema = z.enum(["f1", "h1b", "b1b2"]);
export type InterviewContextId = z.infer<typeof interviewContextIdSchema>;

export const difficultySchema = z.enum(["comfortable", "realistic", "strict", "pressure"]);
export type InterviewDifficulty = z.infer<typeof difficultySchema>;

const field = z.string().trim().max(500).default("");

export const f1ProfileSchema = z.object({
  university: field,
  program: field,
  academicBackground: field,
});

export const h1bProfileSchema = z.object({
  employer: field,
  role: field,
  experience: field,
});

export const b1b2ProfileSchema = z.object({
  purpose: field,
  duration: field,
  destination: field,
});

export type F1Profile = z.infer<typeof f1ProfileSchema>;
export type H1BProfile = z.infer<typeof h1bProfileSchema>;
export type B1B2Profile = z.infer<typeof b1b2ProfileSchema>;

/** Setup payload sent by the client. Mirrors the frontend's Zustand setup store. */
export const interviewSetupSchema = z.discriminatedUnion("context", [
  z.object({ context: z.literal("f1"), difficulty: difficultySchema, profile: f1ProfileSchema }),
  z.object({ context: z.literal("h1b"), difficulty: difficultySchema, profile: h1bProfileSchema }),
  z.object({ context: z.literal("b1b2"), difficulty: difficultySchema, profile: b1b2ProfileSchema }),
]);
export type InterviewSetup = z.infer<typeof interviewSetupSchema>;

export type QuestionKind = "opening" | "follow_up" | "new_topic" | "closing";

export interface TranscriptEntry {
  id: string;
  role: "officer" | "candidate";
  text: string;
  at: string;
  /** Officer entries only. */
  kind?: QuestionKind;
  topicId?: string;
}

export type InterviewPhase = "awaiting_answer" | "processing" | "completed";

export type CompletionReason = "concluded" | "candidate_ended" | "expired";

export interface InterviewSession {
  id: string;
  setup: InterviewSetup;
  phase: InterviewPhase;
  transcript: TranscriptEntry[];
  /** Number of officer questions asked so far (closing remark excluded). */
  questionCount: number;
  currentTopicId: string | null;
  coveredTopicIds: string[];
  /** Follow-ups asked per topic id. */
  followUps: Record<string, number>;
  createdAt: number;
  lastActivityAt: number;
  completedAt: number | null;
  completionReason: CompletionReason | null;
}
