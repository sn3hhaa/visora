export interface ConversationExchange {
  id: string;
  contextId: string;
  officerQuestion: string;
  candidateResponse: string;
  analysis: {
    intentDetected: string;
    signalType: "vague" | "clear" | "rambling" | "sharp";
    critique: string;
    adaptationReason: string;
  };
  officerFollowUp: string;
  refinedCandidateResponse?: string;
}

export const MOCK_ADAPTIVE_EXCHANGE: ConversationExchange = {
  id: "ex-01",
  contextId: "f1",
  officerQuestion: "Why did you choose this university?",
  candidateResponse: "I liked the program and the opportunities.",
  analysis: {
    intentDetected: "Generalized affinity without institutional specificity",
    signalType: "vague",
    critique: "Response lacks curriculum, faculty or research lab references. Suggests unverified preparation.",
    adaptationReason: "Adaptive probe triggered to test candidate's direct engagement with coursework.",
  },
  officerFollowUp: "What specifically attracted you to the program?",
  refinedCandidateResponse:
    "The curriculum under Professor Thorne in distributed consensus algorithms, and the direct alignment with my undergraduate capstone in Byzantine fault tolerance.",
};

export const MOCK_CONTEXT_EXCHANGES: Record<string, ConversationExchange[]> = {
  f1: [
    {
      id: "f1-1",
      contextId: "f1",
      officerQuestion: "What is your primary objective following graduation?",
      candidateResponse: "I plan to return and join our national research institute as a systems engineer.",
      analysis: {
        intentDetected: "Defined domestic trajectory",
        signalType: "sharp",
        critique: "Clear intent, concise timeline.",
        adaptationReason: "Validates non-immigrant intent; moves to financial feasibility.",
      },
      officerFollowUp: "How is your coursework being sponsored across the two-year duration?",
    },
  ],
  h1b: [
    {
      id: "h1b-1",
      contextId: "h1b",
      officerQuestion: "Explain the specialty nature of your daily responsibilities.",
      candidateResponse: "I develop low-latency telemetry pipelines processing high-frequency sensor streams.",
      analysis: {
        intentDetected: "Technical domain expertise",
        signalType: "sharp",
        critique: "Clear role definition without generic buzzwords.",
        adaptationReason: "Tests wage level alignment and team hierarchy.",
      },
      officerFollowUp: "Who defines the architectural specifications for the downstream consumers?",
    },
  ],
  b1b2: [
    {
      id: "b1b2-1",
      contextId: "b1b2",
      officerQuestion: "What is the specific agenda for your twelve-day visit?",
      candidateResponse: "Attending the International Photonic Symposium in Chicago and three days of regional travel.",
      analysis: {
        intentDetected: "Cohesive itinerary",
        signalType: "sharp",
        critique: "Precise date range matching documentation.",
        adaptationReason: "Checks employer authorization and return obligations.",
      },
      officerFollowUp: "Will you be delivering a keynote paper or attending as a general delegate?",
    },
  ],
};

