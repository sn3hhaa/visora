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

export function hasConcreteDetail(text: string): boolean {
  if (/\d|[$₹€£]/.test(text)) return true;
  // Capitalised words that are not the first word of a sentence and not "I".
  const sentences = text.split(/[.!?]+\s*/);
  return sentences.some((sentence) =>
    sentence
      .trim()
      .split(/\s+/)
      .slice(1)
      .some((word) => /^[A-Z][a-zA-Z]+/.test(word) && !/^I('|$)/.test(word)),
  );
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
