import { InterviewContextId } from "./context";

export type InterviewDifficulty = "comfortable" | "realistic" | "strict" | "pressure";

export interface F1Profile {
  university: string;
  program: string;
  academicBackground: string;
}

export interface H1BProfile {
  employer: string;
  role: string;
  experience: string;
}

export interface B1B2Profile {
  purpose: string;
  duration: string;
  destination: string;
}

export interface CandidateProfile {
  contextId: InterviewContextId;
  f1?: F1Profile;
  h1b?: H1BProfile;
  b1b2?: B1B2Profile;
}

export interface InterviewSetupState {
  selectedContext: InterviewContextId;
  difficulty: InterviewDifficulty;
  candidateProfile: CandidateProfile;
  currentStep: number;
}

