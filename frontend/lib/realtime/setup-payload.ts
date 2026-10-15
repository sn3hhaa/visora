import type { InterviewContextId } from "@/types/context";
import type { CandidateProfile, InterviewDifficulty } from "@/types/interview";
import type { InterviewSetupPayload } from "./protocol";

/** Maps the persisted setup store onto the `session_start` payload the backend validates. */
export function buildSetupPayload(
  context: InterviewContextId,
  difficulty: InterviewDifficulty,
  profile: CandidateProfile,
): InterviewSetupPayload {
  switch (context) {
    case "f1":
      return {
        context,
        difficulty,
        profile: {
          university: profile.f1?.university ?? "",
          program: profile.f1?.program ?? "",
          academicBackground: profile.f1?.academicBackground ?? "",
        },
      };
    case "h1b":
      return {
        context,
        difficulty,
        profile: {
          employer: profile.h1b?.employer ?? "",
          role: profile.h1b?.role ?? "",
          experience: profile.h1b?.experience ?? "",
        },
      };
    case "b1b2":
      return {
        context,
        difficulty,
        profile: {
          purpose: profile.b1b2?.purpose ?? "",
          duration: profile.b1b2?.duration ?? "",
          destination: profile.b1b2?.destination ?? "",
        },
      };
  }
}
