import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InterviewContextId } from "@/types/context";
import { InterviewDifficulty, CandidateProfile, F1Profile, H1BProfile, B1B2Profile } from "@/types/interview";

interface InterviewStore {
  selectedContext: InterviewContextId;
  difficulty: InterviewDifficulty;
  candidateProfile: CandidateProfile;
  currentStep: number;
  setSelectedContext: (contextId: InterviewContextId) => void;
  setDifficulty: (difficulty: InterviewDifficulty) => void;
  updateF1Profile: (data: Partial<F1Profile>) => void;
  updateH1BProfile: (data: Partial<H1BProfile>) => void;
  updateB1B2Profile: (data: Partial<B1B2Profile>) => void;
  setStep: (step: number) => void;
  resetSetup: () => void;
}

const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  contextId: "f1",
  f1: {
    university: "",
    program: "",
    academicBackground: "",
  },
  h1b: {
    employer: "",
    role: "",
    experience: "",
  },
  b1b2: {
    purpose: "",
    duration: "",
    destination: "",
  },
};

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      selectedContext: "f1",
      difficulty: "realistic",
      candidateProfile: DEFAULT_CANDIDATE_PROFILE,
      currentStep: 1,

      setSelectedContext: (contextId) =>
        set((state) => ({
          selectedContext: contextId,
          candidateProfile: {
            ...state.candidateProfile,
            contextId,
          },
        })),

      setDifficulty: (difficulty) => set({ difficulty }),

      updateF1Profile: (data) =>
        set((state) => ({
          candidateProfile: {
            ...state.candidateProfile,
            f1: {
              ...(state.candidateProfile.f1 || { university: "", program: "", academicBackground: "" }),
              ...data,
            },
          },
        })),

      updateH1BProfile: (data) =>
        set((state) => ({
          candidateProfile: {
            ...state.candidateProfile,
            h1b: {
              ...(state.candidateProfile.h1b || { employer: "", role: "", experience: "" }),
              ...data,
            },
          },
        })),

      updateB1B2Profile: (data) =>
        set((state) => ({
          candidateProfile: {
            ...state.candidateProfile,
            b1b2: {
              ...(state.candidateProfile.b1b2 || { purpose: "", duration: "", destination: "" }),
              ...data,
            },
          },
        })),

      setStep: (step) => set({ currentStep: step }),

      resetSetup: () =>
        set({
          selectedContext: "f1",
          difficulty: "realistic",
          candidateProfile: DEFAULT_CANDIDATE_PROFILE,
          currentStep: 1,
        }),
    }),
    {
      name: "visora-interview-setup",
      partialize: (state) => ({
        selectedContext: state.selectedContext,
        difficulty: state.difficulty,
        candidateProfile: state.candidateProfile,
      }),
    }
  )
);
