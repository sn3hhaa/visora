import { PerformanceReport } from "@/types/analytics";
import { MOCK_SIGNALS, MOCK_PACE_TIMELINE, MOCK_DIMENSIONS } from "./analytics";

export const MOCK_PERFORMANCE_REPORT: PerformanceReport = {
  overallReadiness: 82,
  readinessLabel: "Overall performance",
  signals: MOCK_SIGNALS,
  paceTimeline: MOCK_PACE_TIMELINE,
  dimensions: MOCK_DIMENSIONS,
  strengths: [
    "Concise articulation of academic curriculum and financial structuring.",
    "Immediate, unhesitating answers regarding past technical deliverables.",
    "Zero contradictions between initial statements and follow-up clarifications.",
  ],
  sharpenAreas: [
    "Initial responses on career trajectories began with generalized phrases before narrowing.",
    "Speaking pace accelerated slightly (+18 WPM) when handling counter-intuitive follow-ups.",
  ],
  questions: [
    {
      questionNumber: 1,
      questionText: "Why did you choose this university?",
      candidateResponse:
        "The curriculum under Professor Thorne in distributed consensus algorithms, and the direct alignment with my undergraduate capstone in Byzantine fault tolerance.",
      duration: "34s",
      clarity: 92,
      specificity: 94,
      followUpTriggered: "None (sufficient depth)",
    },
    {
      questionNumber: 2,
      questionText: "How are you financing the tuition and living expenses for this two-year program?",
      candidateResponse:
        "Through a confirmed department graduate research assistantship covering 60% of tuition, combined with family savings documented in our institutional bank affidavits.",
      duration: "41s",
      clarity: 88,
      specificity: 86,
      followUpTriggered: "Verification of assistantship stipend timeline",
    },
    {
      questionNumber: 3,
      questionText: "What are your post-graduation career commitments in your home country?",
      candidateResponse:
        "I will be returning to assume the Senior Distributed Systems Analyst post at the National Computing Laboratory in Bangalore.",
      duration: "29s",
      clarity: 90,
      specificity: 89,
      followUpTriggered: "Inquiry into current laboratory projects",
    },
    {
      questionNumber: 4,
      questionText: "How does this curriculum directly support your long-term research goals?",
      candidateResponse:
        "It provides rigorous formal verification methodologies that directly bridge my practical distributed systems experience with high-assurance infrastructure design.",
      duration: "37s",
      clarity: 93,
      specificity: 91,
      followUpTriggered: "Verification of lab publication timeline",
    },
  ],
};

