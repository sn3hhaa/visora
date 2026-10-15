import { describe, expect, it } from "vitest";
import { analyzeAnswer, countWords, findHedges, hasConcreteDetail } from "../src/interview/answer-analysis";
import { DIFFICULTY_POLICIES } from "../src/interview/contexts";

describe("answer analysis", () => {
  it("counts words", () => {
    expect(countWords("  one two   three ")).toBe(3);
    expect(countWords("")).toBe(0);
  });

  it("finds hedging phrases as whole words only", () => {
    expect(findHedges("I think it is maybe fine.")).toEqual(["i think", "maybe"]);
    expect(findHedges("I don’t know yet")).toEqual(["i don't know"]);
    expect(findHedges("Probability theory is my major")).toEqual([]);
  });

  it("detects concrete detail from numbers, currency and proper nouns", () => {
    expect(hasConcreteDetail("It costs 45000 per year")).toBe(true);
    expect(hasConcreteDetail("My sponsor pays in $")).toBe(true);
    expect(hasConcreteDetail("I will study at Carnegie Mellon")).toBe(true);
    expect(hasConcreteDetail("I like the university and the courses are good")).toBe(false);
    expect(hasConcreteDetail("Good question. I want to learn")).toBe(false);
  });

  it("applies the difficulty word threshold", () => {
    const answer = "My family will pay for everything I need there.";
    expect(analyzeAnswer(answer, DIFFICULTY_POLICIES.comfortable).isTooShort).toBe(false);
    expect(analyzeAnswer(answer, DIFFICULTY_POLICIES.pressure).isTooShort).toBe(true);
  });
});
