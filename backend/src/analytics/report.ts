import { countWords, findFillers, findHedges, hasFigures, hasNamedDetail } from "../interview/answer-analysis";
import { DIFFICULTY_POLICIES, getContext, type TopicDefinition } from "../interview/contexts";
import type {
  CompletionReason,
  InterviewContextId,
  InterviewDifficulty,
  InterviewSession,
  QuestionKind,
  TranscriptEntry,
} from "../interview/types";

/**
 * Post-interview report built only from what actually happened in the session.
 *
 * `measured` values are counted or timed directly. `assessed` values are rule-based
 * judgements over the answer text; they are labelled as such and never presented as
 * percentages or approval odds. Qualities that need language understanding
 * (relevance, consistency) are reported as not assessed until an LLM evaluator exists.
 */

export const REPORT_VERSION = 1;

export type Rating = "strong" | "adequate" | "needs_work";

export interface Assessment {
  rating: Rating;
  note: string;
}

export type AssessedDimensionId = "completeness" | "specificity" | "directness" | "relevance" | "consistency";

export type DimensionSummary =
  | { id: AssessedDimensionId; label: string; status: "assessed"; rating: Rating; counts: Record<Rating, number>; note: string }
  | { id: AssessedDimensionId; label: string; status: "not_assessed"; note: string };

export interface AnswerReport {
  questionNumber: number;
  question: string;
  questionKind: QuestionKind;
  topicId: string | null;
  topicLabel: string | null;
  answer: string;
  measured: {
    wordCount: number;
    /** Seconds from the question being issued to the answer reaching the server. */
    responseSeconds: number;
    fillerWords: { word: string; count: number }[];
    hedges: string[];
  };
  assessed: {
    completeness: Assessment;
    specificity: Assessment;
    directness: Assessment;
  };
  /** The follow-up question this answer prompted, if any. */
  followUp: string | null;
}

export interface SessionReport {
  version: typeof REPORT_VERSION;
  sessionId: string;
  context: InterviewContextId;
  contextLabel: string;
  difficulty: InterviewDifficulty;
  provider: string;
  /** How answers were given. Speaking-rate metrics require "voice". */
  inputMode: "text";
  completionReason: CompletionReason | null;
  startedAt: string;
  completedAt: string | null;
  measured: {
    durationSeconds: number;
    questionsAsked: number;
    answersGiven: number;
    totalWords: number;
    averageWordsPerAnswer: number | null;
    medianResponseSeconds: number | null;
    fillerWordCount: number;
    hedgeCount: number;
    followUpsAsked: number;
    topicsCovered: { id: string; label: string }[];
    topicsTotal: number;
    /** Words per minute of speech. Not measurable from typed answers. */
    speakingRateWpm: number | null;
  };
  assessed: {
    method: "rules";
    dimensions: DimensionSummary[];
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  answers: AnswerReport[];
}

const DIMENSION_LABELS: Record<AssessedDimensionId, string> = {
  completeness: "Completeness",
  specificity: "Specificity",
  directness: "Directness",
  relevance: "Relevance",
  consistency: "Consistency",
};

const DIFFICULTY_LABELS: Record<InterviewDifficulty, string> = {
  comfortable: "Comfortable",
  realistic: "Realistic",
  strict: "Strict",
  pressure: "Pressure",
};

export function buildSessionReport(session: InterviewSession, provider: string): SessionReport {
  const context = getContext(session.setup.context);
  const policy = DIFFICULTY_POLICIES[session.setup.difficulty];
  const topicById = new Map(context.topics.map((topic) => [topic.id, topic]));
  const answers = pairAnswers(session.transcript).map((pair, index) =>
    buildAnswerReport(pair, index + 1, policy.minAnswerWords, topicById),
  );

  const end = session.completedAt ?? session.lastActivityAt;
  const responseTimes = answers.map((answer) => answer.measured.responseSeconds);
  const totalWords = sum(answers.map((answer) => answer.measured.wordCount));
  const coveredIds = [...new Set([...session.coveredTopicIds, ...(session.currentTopicId ? [session.currentTopicId] : [])])];

  const dimensions: DimensionSummary[] = [
    summarise("completeness", answers, `Answers of at least ${policy.minAnswerWords} words meet the ${DIFFICULTY_LABELS[session.setup.difficulty]} bar; twice that is strong.`),
    summarise("specificity", answers, "Based on names, figures, dates and amounts in each answer."),
    summarise("directness", answers, "Based on hedging phrases and filler words in each answer."),
    { id: "relevance", label: DIMENSION_LABELS.relevance, status: "not_assessed", note: "Needs an AI evaluator to judge whether answers address the question. Not available in demo mode." },
    { id: "consistency", label: DIMENSION_LABELS.consistency, status: "not_assessed", note: "Needs an AI evaluator to compare statements across answers. Not available in demo mode." },
  ];

  return {
    version: REPORT_VERSION,
    sessionId: session.id,
    context: context.id,
    contextLabel: context.label,
    difficulty: session.setup.difficulty,
    provider,
    inputMode: "text",
    completionReason: session.completionReason,
    startedAt: new Date(session.createdAt).toISOString(),
    completedAt: session.completedAt === null ? null : new Date(session.completedAt).toISOString(),
    measured: {
      durationSeconds: Math.max(0, Math.round((end - session.createdAt) / 1000)),
      questionsAsked: session.questionCount,
      answersGiven: answers.length,
      totalWords,
      averageWordsPerAnswer: answers.length ? Math.round(totalWords / answers.length) : null,
      medianResponseSeconds: median(responseTimes),
      fillerWordCount: sum(answers.flatMap((answer) => answer.measured.fillerWords.map((filler) => filler.count))),
      hedgeCount: sum(answers.map((answer) => answer.measured.hedges.length)),
      followUpsAsked: session.transcript.filter((entry) => entry.role === "officer" && entry.kind === "follow_up").length,
      topicsCovered: coveredIds.flatMap((id) => {
        const topic = topicById.get(id);
        return topic ? [{ id, label: topic.label }] : [];
      }),
      topicsTotal: context.topics.length,
      speakingRateWpm: null,
    },
    assessed: { method: "rules", dimensions },
    ...feedback(answers, dimensions, policy.minAnswerWords, session.setup.difficulty, topicById),
    answers,
  };
}

interface AnswerPair {
  question: TranscriptEntry;
  answer: TranscriptEntry;
  next: TranscriptEntry | undefined;
}

/** Each officer question followed directly by a candidate answer. Unanswered questions are skipped. */
function pairAnswers(transcript: readonly TranscriptEntry[]): AnswerPair[] {
  const pairs: AnswerPair[] = [];
  transcript.forEach((entry, index) => {
    const reply = transcript[index + 1];
    if (entry.role === "officer" && entry.kind !== "closing" && reply?.role === "candidate") {
      pairs.push({ question: entry, answer: reply, next: transcript[index + 2] });
    }
  });
  return pairs;
}

function buildAnswerReport(
  { question, answer, next }: AnswerPair,
  questionNumber: number,
  minWords: number,
  topicById: Map<string, TopicDefinition>,
): AnswerReport {
  const wordCount = countWords(answer.text);
  const fillerWords = findFillers(answer.text);
  const hedges = findHedges(answer.text);
  const figures = hasFigures(answer.text);
  const names = hasNamedDetail(answer.text);
  const fillerTotal = sum(fillerWords.map((filler) => filler.count));
  const softeners = hedges.length + fillerTotal;

  return {
    questionNumber,
    question: question.text,
    questionKind: question.kind ?? "new_topic",
    topicId: question.topicId ?? null,
    topicLabel: (question.topicId && topicById.get(question.topicId)?.label) || null,
    answer: answer.text,
    measured: {
      wordCount,
      responseSeconds: Math.max(0, Math.round((Date.parse(answer.at) - Date.parse(question.at)) / 1000)),
      fillerWords,
      hedges,
    },
    assessed: {
      completeness:
        wordCount >= minWords * 2
          ? { rating: "strong", note: `${wordCount} words — a full answer.` }
          : wordCount >= minWords
            ? { rating: "adequate", note: `${wordCount} words — enough, with room to add context.` }
            : { rating: "needs_work", note: `${wordCount} words — below the ${minWords}-word bar for this difficulty.` },
      specificity:
        figures && names
          ? { rating: "strong", note: "Includes both named details and figures." }
          : figures || names
            ? { rating: "adequate", note: figures ? "Includes figures but no names of people, places or organisations." : "Includes named details but no figures, dates or amounts." }
            : { rating: "needs_work", note: "No names, figures, dates or amounts." },
      directness:
        softeners === 0
          ? { rating: "strong", note: "No hedging or filler words." }
          : softeners === 1
            ? { rating: "adequate", note: `One softener: "${hedges[0] ?? fillerWords[0]?.word}".` }
            : { rating: "needs_work", note: `${softeners} hedges or fillers: ${[...hedges, ...fillerWords.map((filler) => filler.word)].map((word) => `"${word}"`).join(", ")}.` },
    },
    followUp: next?.role === "officer" && next.kind === "follow_up" ? next.text : null,
  };
}

type RatedDimension = "completeness" | "specificity" | "directness";

function summarise(id: RatedDimension, answers: AnswerReport[], note: string): DimensionSummary {
  if (answers.length === 0) {
    return { id, label: DIMENSION_LABELS[id], status: "not_assessed", note: "No answers were given." };
  }
  const counts: Record<Rating, number> = { strong: 0, adequate: 0, needs_work: 0 };
  for (const answer of answers) counts[answer.assessed[id].rating] += 1;
  const total = answers.length;
  // Weak answers weigh more than strong ones: two vague answers out of five is worth flagging.
  const rating: Rating = counts.needs_work / total >= 0.4 ? "needs_work" : counts.strong / total >= 0.6 ? "strong" : "adequate";
  return { id, label: DIMENSION_LABELS[id], status: "assessed", rating, counts, note };
}

const RECOMMENDATIONS: Record<RatedDimension, string> = {
  completeness: "Answer in two or three sentences: the direct answer first, then the reason, then one supporting fact.",
  specificity: "Prepare the exact facts officers ask for — names, amounts, dates and durations — so you can state them without searching.",
  directness: "Lead with a definite statement. Replace \"I think\" and \"maybe\" with what you know, and pause silently instead of using fillers.",
};

function feedback(
  answers: AnswerReport[],
  dimensions: DimensionSummary[],
  minWords: number,
  difficulty: InterviewDifficulty,
  topicById: Map<string, TopicDefinition>,
): Pick<SessionReport, "strengths" | "improvements" | "recommendations"> {
  const total = answers.length;
  if (total === 0) {
    return {
      strengths: [],
      improvements: ["The interview ended before any question was answered, so there is nothing to evaluate yet."],
      recommendations: ["Start a new interview and answer at least three questions to get feedback."],
    };
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];
  const count = (id: RatedDimension, rating: Rating) => answers.filter((answer) => answer.assessed[id].rating === rating).length;
  const of = (n: number) => `${n} of ${total} answer${total === 1 ? "" : "s"}`;

  for (const dimension of dimensions) {
    if (dimension.status !== "assessed") continue;
    const id = dimension.id as RatedDimension;
    if (dimension.rating === "strong") {
      strengths.push(
        {
          completeness: `${of(count(id, "strong"))} were fully developed, well past the ${minWords}-word bar for ${DIFFICULTY_LABELS[difficulty]} mode.`,
          specificity: `${of(count(id, "strong"))} backed claims with both names and figures.`,
          directness: `${of(count(id, "strong"))} were stated plainly, without hedging or filler words.`,
        }[id],
      );
    } else if (dimension.rating === "needs_work") {
      improvements.push(
        {
          completeness: `${of(count(id, "needs_work"))} fell below the ${minWords}-word bar the officer expects in ${DIFFICULTY_LABELS[difficulty]} mode.`,
          specificity: `${of(count(id, "needs_work"))} gave no names, figures, dates or amounts.`,
          directness: `${of(count(id, "needs_work"))} leaned on hedges or fillers, which invites the officer to probe.`,
        }[id],
      );
      recommendations.push(RECOMMENDATIONS[id]);
    }
  }

  const followUps = answers.filter((answer) => answer.followUp !== null).length;
  if (followUps === 0 && total >= 3) {
    strengths.push("The officer never needed a follow-up to get the information it was looking for.");
  } else if (followUps >= 2) {
    improvements.push(`${of(followUps)} prompted a follow-up question before the officer moved on.`);
  }

  // Point at the exact probe the candidate should rehearse for each vague topic.
  const vagueTopics = new Set(
    answers.filter((answer) => answer.assessed.specificity.rating === "needs_work" && answer.topicId).map((answer) => answer.topicId as string),
  );
  for (const topicId of vagueTopics) {
    const topic = topicById.get(topicId);
    if (topic) recommendations.push(`${topic.label}: rehearse an answer to "${topic.specificsProbe}"`);
  }

  if (strengths.length === 0) {
    const best = (["completeness", "specificity", "directness"] as const)
      .map((id) => ({ id, strong: count(id, "strong") }))
      .sort((a, b) => b.strong - a.strong)[0];
    if (best.strong > 0) strengths.push(`${of(best.strong)} rated strong on ${DIMENSION_LABELS[best.id].toLowerCase()}.`);
  }
  if (improvements.length === 0) {
    improvements.push("No recurring weaknesses in these answers. Try a harder difficulty to be pushed further.");
  }

  return { strengths, improvements, recommendations };
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}
