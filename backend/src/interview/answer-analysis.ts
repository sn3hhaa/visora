import type { DifficultyPolicy } from "./contexts";

const HEDGES = [
  "i think",
  "i guess",
  "maybe",
  "probably",
  "not sure",
  "i don't know",
  "i dont know",
  "kind of",
  "sort of",
  "hopefully",
];

export interface AnswerAnalysis {
  wordCount: number;
  isTooShort: boolean;
  hedges: string[];
  /** Heuristic: contains numbers, amounts, or proper nouns beyond the first word of a sentence. */
  hasConcreteDetail: boolean;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function findHedges(text: string): string[] {
  const lower = ` ${text.toLowerCase().replace(/[’]/g, "'")} `;
  return HEDGES.filter((hedge) => new RegExp(`[^a-z']${hedge}[^a-z']`).test(lower));
}

/** Words people use to fill silence. "like" is excluded: it is too often meaningful to count reliably. */
const FILLERS = ["um", "umm", "uh", "uhh", "er", "erm", "hmm", "you know", "i mean", "basically", "actually", "literally"];

/** Occurrences of each filler word, most frequent first. */
export function findFillers(text: string): { word: string; count: number }[] {
  const lower = ` ${text.toLowerCase().replace(/[’]/g, "'")} `;
  return FILLERS.map((word) => ({ word, count: lower.match(new RegExp(`(?<=[^a-z'])${word}(?=[^a-z'])`, "g"))?.length ?? 0 }))
    .filter((filler) => filler.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Numbers, amounts or currency symbols. */
export function hasFigures(text: string): boolean {
  return /\d|[$₹€£]/.test(text);
}

/** Capitalised words that are not the first word of a sentence and not "I" — names of people, places, organisations. */
export function hasNamedDetail(text: string): boolean {
  const sentences = text.split(/[.!?]+\s*/);
  return sentences.some((sentence) =>
    sentence
      .trim()
      .split(/\s+/)
      .slice(1)
      .some((word) => /^[A-Z][a-zA-Z]+/.test(word) && !/^I('|$)/.test(word)),
  );
}

export function hasConcreteDetail(text: string): boolean {
  return hasFigures(text) || hasNamedDetail(text);
}

export function analyzeAnswer(text: string, policy: DifficultyPolicy): AnswerAnalysis {
  const wordCount = countWords(text);
  return {
    wordCount,
    isTooShort: wordCount < policy.minAnswerWords,
    hedges: findHedges(text),
    hasConcreteDetail: hasConcreteDetail(text),
  };
}
