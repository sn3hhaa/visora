import { SpeechSignals, PaceDataPoint, DimensionScore } from "@/types/analytics";

export const MOCK_SIGNALS: SpeechSignals = {
  speakingPaceWpm: 142,
  fillerCount: 6,
  averagePauseSeconds: 1.2,
  responseDurationSeconds: 38,
  clarityPercentage: 84,
  specificityPercentage: 78,
  consistencyPercentage: 91,
};

export const MOCK_PACE_TIMELINE: PaceDataPoint[] = [
  { time: "0:00", wpm: 135, optimalMin: 125, optimalMax: 155 },
  { time: "0:45", wpm: 142, optimalMin: 125, optimalMax: 155 },
  { time: "1:30", wpm: 158, optimalMin: 125, optimalMax: 155 },
  { time: "2:15", wpm: 148, optimalMin: 125, optimalMax: 155 },
  { time: "3:00", wpm: 139, optimalMin: 125, optimalMax: 155 },
  { time: "3:45", wpm: 144, optimalMin: 125, optimalMax: 155 },
  { time: "4:30", wpm: 141, optimalMin: 125, optimalMax: 155 },
];

export const MOCK_DIMENSIONS: DimensionScore[] = [
  { dimension: "Response Quality", score: 86, benchmark: 75 },
  { dimension: "Clarity", score: 84, benchmark: 72 },
  { dimension: "Specificity", score: 78, benchmark: 70 },
  { dimension: "Consistency", score: 91, benchmark: 80 },
  { dimension: "Speech Delivery", score: 82, benchmark: 75 },
];

