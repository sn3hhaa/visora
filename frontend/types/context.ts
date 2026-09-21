export type InterviewContextId = "f1" | "h1b" | "b1b2";

export interface ContextDefinition {
  id: InterviewContextId;
  number: string;
  code: string;
  category: string;
  headline: string;
  supporting: string;
  image: string;
  topics: string[];
}

