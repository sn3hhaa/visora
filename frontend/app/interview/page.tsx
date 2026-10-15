"use client";

import * as React from "react";
import Link from "next/link";
import { useInterviewStore } from "@/store/interview-store";
import { INTERVIEW_CONTEXTS } from "@/lib/constants/contexts";
import { useInterviewSession } from "@/hooks/use-interview-session";
import { buildSetupPayload } from "@/lib/realtime/setup-payload";
import type { InterviewRoomState } from "@/lib/realtime/interview-state";
import { TranscriptPanel } from "@/components/interview/transcript-panel";
import { AnswerComposer } from "@/components/interview/answer-composer";
import { SessionStats } from "@/components/interview/session-stats";
import { CameraSettings } from "@/components/interview/camera-settings";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Home,
  Loader2,
  Maximize2,
  MicOff,
  Minimize2,
  Phone,
  PhoneOff,
  RotateCcw,
  Settings,
  Video,
  VideoOff,
  X,
} from "lucide-react";

const difficultyLabels: Record<string, string> = {
  comfortable: "Practice",
  realistic: "Realistic",
  strict: "Strict",
  pressure: "Pressure",
};

const COMPLETION_LABELS: Record<string, string> = {
  concluded: "The officer concluded the interview.",
  candidate_ended: "You ended the interview.",
  expired: "The session expired after a period of inactivity.",
};

/** The persisted setup store only has real values after it rehydrates on the client. */
function useSetupHydrated() {
  return React.useSyncExternalStore(
    (onChange) => useInterviewStore.persist.onFinishHydration(onChange),
    () => useInterviewStore.persist.hasHydrated(),
    () => false,
  );
}

function officerStatus(state: InterviewRoomState): string | null {
  if (state.connection === "reconnecting") return "Reconnecting…";
  switch (state.phase) {
    case "starting":
      return "Joining…";
    case "processing":
      return "Officer is thinking…";
    case "awaiting_answer":
      return "Your turn to answer";
    case "completed":
      return "Interview complete";
    default:
      return null;
  }
}

export default function InterviewRoomPage() {
  const { selectedContext, difficulty, candidateProfile } = useInterviewStore();
  const hydrated = useSetupHydrated();
  const { state, start, submitAnswer, end, reset, dismissError } = useInterviewSession();

  const [isVideoOn, setIsVideoOn] = React.useState(true);
  const [cameraId, setCameraId] = React.useState<string | null>(null);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const userVideoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Local camera preview only: the stream never leaves the browser.
  React.useEffect(() => {
    if (!isVideoOn) return;
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({
        video: cameraId ? { deviceId: { exact: cameraId }, width: 1280, height: 720 } : { width: 1280, height: 720 },
        audio: false,
      })
      .then((mediaStream) => {
        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = mediaStream;
        setCameraError(null);
        if (userVideoRef.current) userVideoRef.current.srcObject = mediaStream;
      })
      .catch(() => {
        if (!cancelled) setCameraError("Camera unavailable or permission denied.");
      });
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      if (userVideoRef.current) userVideoRef.current.srcObject = null;
    };
  }, [isVideoOn, cameraId]);

  const contextDef = INTERVIEW_CONTEXTS.find((c) => c.id === selectedContext) || INTERVIEW_CONTEXTS[0];
  const displayCode = hydrated ? contextDef.code : "";
  const displayCategory = hydrated ? contextDef.category : "";
  const displayDifficulty = hydrated ? (difficultyLabels[difficulty] ?? difficulty).toUpperCase() : "";

  const inSession = state.phase !== "idle" && state.phase !== "completed";
  const isDemo = state.provider === "demo";
  const status = officerStatus(state);
  const currentQuestion = [...state.transcript].reverse().find((entry) => entry.role === "officer");
  const canAnswer = state.phase === "awaiting_answer" && state.connection === "open";

  const handleStart = () => start(buildSetupPayload(selectedContext, difficulty, candidateProfile));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  return (
    <main
      className={`h-screen max-h-screen w-full bg-[#F5F2EC] text-[#141414] ${
        isFullscreen ? "p-0" : "p-3 sm:p-5 lg:p-6"
      } overflow-hidden flex flex-col justify-center items-center font-sans transition-all duration-200`}
    >
      <div
        className={`w-full h-full bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative ${
          isFullscreen
            ? "max-w-none rounded-none border-0 shadow-none"
            : "max-w-[1440px] rounded-3xl sm:rounded-[32px] border border-[#E6E0D4] shadow-[0_12px_40px_rgba(20,20,20,0.06)]"
        }`}
      >
        {/* Left: officer and candidate tiles with call controls */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 lg:p-6 md:border-r border-[#EFEBE3] md:overflow-hidden bg-white min-h-[520px] md:min-h-0">
          <div className="flex items-center justify-between gap-4 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                <img src="/images/visora-logo-white.png" alt="Visora" className="h-4 sm:h-4.5 w-auto object-contain invert" />
              </Link>
              <div className="h-4 w-px bg-[#DCD5C9]" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#6B665F] hover:text-[#141414] px-2.5 py-1 rounded-full hover:bg-black/5 transition-all font-medium"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#FAF8F5] border border-[#E8E2D8] px-3.5 py-1.5 rounded-full shadow-2xs text-xs font-sans text-[#6B665F]">
              <span className={`w-2 h-2 rounded-full ${inSession ? "bg-emerald-500 animate-pulse" : "bg-[#A8A29E]"}`} />
              <span className="font-bold text-[#141414] tracking-tight">{displayCode}</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="font-medium text-[#5C564E]">{displayCategory}</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase text-[#A25A24] bg-[#FAF3EC] px-2 py-0.5 rounded-full border border-[#EBD7C3]">
                {displayDifficulty}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 text-xs text-[#5C564E] hover:text-[#141414] bg-white border border-[#E8E2D8] hover:border-[#C5BCAD] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer font-medium"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? "Exit full screen" : "Full screen"}</span>
            </button>
          </div>

          <div className="flex-1 my-3 sm:my-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch min-h-0 overflow-hidden">
            {/* Officer tile. A static portrait until the avatar service is integrated. */}
            <div className="relative w-full h-full min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#161820] border border-[#E4DED3] shadow-[0_4px_24px_rgba(20,20,20,0.06)] flex flex-col items-center justify-center">
              <img src={contextDef.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {status && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-medium text-white">
                  {state.phase === "processing" || state.phase === "starting" || state.connection === "reconnecting" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${state.phase === "completed" ? "bg-[#A8A29E]" : "bg-emerald-400"}`} />
                  )}
                  <span>{status}</span>
                </div>
              )}

              {currentQuestion && state.phase !== "idle" && (
                <p className="absolute bottom-14 left-4 right-4 z-10 text-sm sm:text-[15px] leading-relaxed text-white font-serif">
                  {currentQuestion.text}
                </p>
              )}

              <div className="absolute bottom-4 left-4 z-10 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium shadow-sm">
                <span>Officer</span>
              </div>
            </div>

            {/* Candidate camera preview */}
            <div className="relative w-full h-full min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#202022] border border-[#E4DED3] shadow-[0_4px_24px_rgba(20,20,20,0.06)] flex flex-col items-center justify-center">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${isVideoOn && !cameraError ? "block" : "hidden"}`}
              />
              {(!isVideoOn || cameraError) && (
                <span className="text-xs font-mono tracking-wide text-[#B5B0A6] px-6 text-center">
                  {isVideoOn ? cameraError : "Camera is turned off"}
                </span>
              )}
              <div className="absolute top-4 right-4 text-[10.5px] text-white/70 bg-black/45 px-2.5 py-1 rounded-full">
                Preview only · not recorded
              </div>
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium shadow-sm">
                <span>You</span>
                <MicOff className="w-3.5 h-3.5 text-white/60" aria-label="Voice input not available yet" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 shrink-0 border-t border-[#EFEBE3]">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-full text-[#5C564E] hover:text-[#141414] hover:bg-black/5 transition-all cursor-pointer"
              title="Camera settings"
              aria-label="Camera settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-all cursor-pointer shadow-xs ${
                  isVideoOn
                    ? "bg-white text-[#141414] border border-[#DCD5C9] hover:bg-[#F2EDE5]"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                }`}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                aria-label={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {inSession ? (
                <button
                  type="button"
                  onClick={end}
                  className="inline-flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End interview</span>
                </button>
              ) : state.phase === "completed" ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 bg-[#141414] hover:bg-[#2C332A] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New interview</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={!hydrated || state.connection === "connecting" || state.connection === "reconnecting"}
                  className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] disabled:bg-[#A7D9B8] disabled:cursor-wait text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start interview</span>
                </button>
              )}

              <button
                type="button"
                disabled
                className="p-3 rounded-full shadow-xs bg-white text-[#B5B0A6] border border-[#E8E2D8] cursor-not-allowed"
                title="Voice answers are not available yet. Type your answers in the transcript panel."
                aria-label="Microphone (not available yet)"
              >
                <MicOff className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/setup"
              className="p-2.5 rounded-full text-[#5C564E] hover:text-[#141414] hover:bg-black/5 transition-all cursor-pointer"
              title="Back to setup"
              aria-label="Back to setup"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right: transcript, answer input and session facts */}
        <div className="w-full md:w-80 lg:w-[380px] xl:w-[400px] flex flex-col justify-between p-4 sm:p-5 lg:p-6 bg-white md:overflow-hidden shrink-0 border-t md:border-t-0 border-[#EFEBE3]">
          <div className="flex-1 min-h-[360px] md:min-h-0 flex flex-col overflow-hidden pb-4 border-b border-[#EFEBE3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4] shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.06em] text-[#141414]">Transcript</span>
                <span className={`w-2 h-2 rounded-full ${inSession ? "bg-emerald-500 animate-pulse" : "bg-[#B5B0A6]"}`} />
              </div>
              {isDemo && (
                <span
                  className="text-[10.5px] font-semibold uppercase tracking-wide text-[#A25A24] bg-[#FAF3EC] border border-[#EBD7C3] px-2 py-0.5 rounded-full"
                  title="The officer is a deterministic, rule-based demo. No AI model is involved."
                >
                  Demo mode
                </span>
              )}
            </div>

            {state.error && (
              <div
                role="alert"
                className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-px shrink-0" />
                <span className="flex-1">{state.error.message}</span>
                <button type="button" onClick={dismissError} aria-label="Dismiss" className="shrink-0 hover:text-red-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex-1 min-h-0 my-2 overflow-y-auto pr-1">
              <TranscriptPanel transcript={state.transcript} phase={state.phase} />
            </div>

            <div className="pt-2.5 border-t border-[#F0ECE4] shrink-0">
              {state.phase === "completed" ? (
                <div className="flex items-start gap-2 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DA] p-3 text-xs text-[#5C564E]">
                  <CheckCircle2 className="w-4 h-4 text-[#485244] shrink-0 mt-px" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-[#141414]">Interview complete</span>
                    <span>
                      {COMPLETION_LABELS[state.completion?.reason ?? "candidate_ended"]} You answered{" "}
                      {state.transcript.filter((entry) => entry.role === "candidate").length} question(s).
                    </span>
                  </div>
                </div>
              ) : (
                <AnswerComposer
                  enabled={canAnswer}
                  onSubmit={submitAnswer}
                  placeholder={
                    canAnswer
                      ? "Type your answer…"
                      : state.phase === "processing"
                        ? "Waiting for the officer…"
                        : state.phase === "idle"
                          ? "Start the interview to answer"
                          : "Not connected"
                  }
                />
              )}
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2.5 shrink-0">
            <span className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">Session</span>
            <SessionStats state={state} />
          </div>
        </div>
      </div>

      {showSettings && (
        <CameraSettings
          selectedId={cameraId}
          onSelect={(id) => {
            setCameraId(id);
            setIsVideoOn(true);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
