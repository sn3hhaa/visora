export interface SpeechSignals {
  speakingPaceWpm: number;
  fillerCount: number;
  averagePauseSeconds: number;
  responseDurationSeconds: number;
  clarityPercentage: number;
  specificityPercentage: number;
  consistencyPercentage: number;
}

export interface PaceDataPoint {
  time: string;
  wpm: number;
  optimalMin: number;
  optimalMax: number;
}

export interface DimensionScore {
  dimension: string;
  score: number;
  benchmark: number;
}

export interface QuestionBreakdown {
  questionNumber: number;
  questionText: string;
  candidateResponse: string;
  duration: string;
  clarity: number;
  specificity: number;
  followUpTriggered: string;
}

export interface PerformanceReport {
  overallReadiness: number;
  readinessLabel: string;
  signals: SpeechSignals;
  paceTimeline: PaceDataPoint[];
  dimensions: DimensionScore[];
  strengths: string[];
  sharpenAreas: string[];
  questions: QuestionBreakdown[];
}

