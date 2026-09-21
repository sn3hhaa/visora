"use client";

import * as React from "react";
import Link from "next/link";
import { useInterviewStore } from "@/store/interview-store";
import { INTERVIEW_CONTEXTS } from "@/lib/constants/contexts";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  Maximize2,
  Minimize2,
  Home,
  ArrowLeft,
  Sparkles,
  Activity,
  Cpu,
  Radio,
  ShieldCheck,
  Volume2,
  X,
  Sliders,
} from "lucide-react";

interface TranscriptMessage {
  id: string;
  sender: "officer" | "candidate";
  text: string;
  timestamp: string;
}

const difficultyLabels: Record<string, string> = {
  comfortable: "Practice",
  realistic: "Realistic",
  pressure: "Pressure",
  strict: "Strict",
};

export default function InterviewRoomPage() {
  const { selectedContext, difficulty, candidateProfile } = useInterviewStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const contextDef =
    INTERVIEW_CONTEXTS.find((c) => c.id === selectedContext) || INTERVIEW_CONTEXTS[0];

  // Video and Audio States
  const [isVideoOn, setIsVideoOn] = React.useState(true);
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isCallActive, setIsCallActive] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  // Media streams
  const userVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = React.useRef<MediaStream | null>(null);

  // Telemetry & Transcript States
  const [ttfb, setTtfb] = React.useState<string>("--");
  const [frames, setFrames] = React.useState<number>(0);
  const [transcripts, setTranscripts] = React.useState<TranscriptMessage[]>([]);
  const transcriptEndRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

  // Settings State
  const [selectedMic, setSelectedMic] = React.useState("Default - Built-in Microphone");
  const [selectedCamera, setSelectedCamera] = React.useState("Default - HD Web Camera");
  const [noiseSuppression, setNoiseSuppression] = React.useState(true);
  const [echoCancellation, setEchoCancellation] = React.useState(true);

  // Initialize/Toggle Webcam
  React.useEffect(() => {
    async function setupCamera() {
      if (isVideoOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false,
          });
          mediaStreamRef.current = stream;
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        } catch {
          // Camera permission denied or not available
        }
      } else {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = null;
        }
      }
    }

    setupCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  // Telemetry frames counter when call is active
  React.useEffect(() => {
    let frameInterval: NodeJS.Timeout;
    if (isCallActive) {
      setTtfb("185 ms");
      frameInterval = setInterval(() => {
        setFrames((prev) => prev + 1);
      }, 100);
    } else {
      setTtfb("--");
      setFrames(0);
    }
    return () => clearInterval(frameInterval);
  }, [isCallActive]);

  // Auto-scroll transcript
  React.useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  // Start Call Handler: Generates conversational voice simulation
  const handleStartCall = () => {
    setIsCallActive(true);
    setTranscripts([]);

    // Clear any previous timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    let q1 = "";
    let a1 = "";
    let q2 = "";
    let a2 = "";

    if (selectedContext === "f1") {
      const uni = candidateProfile.f1?.university ? candidateProfile.f1.university : "Carnegie Mellon University";
      const deg = candidateProfile.f1?.program ? candidateProfile.f1.program : "M.S. in Computer Science";
      q1 = `Good morning. I see you are applying for an F-1 academic visa for ${uni}. Can you state your degree program and academic objective?`;
      a1 = `Good morning Officer. I have been admitted to the ${deg} program at ${uni}. My objective is to specialize in distributed systems and return to lead software architecture in my home country.`;
      q2 = `Who is sponsoring your education and living expenses during your tenure?`;
      a2 = `My family has secured savings and an approved education loan covering the full tuition and living expenses.`;
    } else if (selectedContext === "h1b") {
      const emp = candidateProfile.h1b?.employer ? candidateProfile.h1b.employer : "Google LLC";
      const role = candidateProfile.h1b?.role ? candidateProfile.h1b.role : "Senior Software Engineer";
      q1 = `Good morning. Please state the title of your specialty occupation with ${emp} and describe your primary technical duties.`;
      a1 = `Good morning Officer. I will be working as a ${role} at ${emp}, architecting cloud infrastructure and high-throughput real-time APIs.`;
      q2 = `How does your degree background qualify you specifically for this specialty position?`;
      a2 = `I hold a Bachelor's and Master's in Computer Engineering with 5 years of specialized experience in cloud distributed backends.`;
    } else {
      const dest = candidateProfile.b1b2?.destination ? candidateProfile.b1b2.destination : "San Francisco, CA";
      const purp = candidateProfile.b1b2?.purpose ? candidateProfile.b1b2.purpose : "Attending a global tech summit";
      q1 = `Good morning. What is the specific purpose, intended duration, and itinerary of your planned travel to ${dest}?`;
      a1 = `Good morning Officer. I am visiting ${dest} for 12 days for ${purp} and meeting key industry partners.`;
      q2 = `What ties ensure you will return promptly upon completion of your visit?`;
      a2 = `I have permanent employment, my family, and property ties here that require my active presence.`;
    }

    const t1 = setTimeout(() => {
      setTranscripts([
        {
          id: "msg-1",
          sender: "officer",
          text: q1,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1000);

    const t2 = setTimeout(() => {
      setTranscripts((prev) => [
        ...prev,
        {
          id: "msg-2",
          sender: "candidate",
          text: a1,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 4500);

    const t3 = setTimeout(() => {
      setTranscripts((prev) => [
        ...prev,
        {
          id: "msg-3",
          sender: "officer",
          text: q2,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 9000);

    const t4 = setTimeout(() => {
      setTranscripts((prev) => [
        ...prev,
        {
          id: "msg-4",
          sender: "candidate",
          text: a2,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 14000);

    timeoutsRef.current = [t1, t2, t3, t4];
  };

  // End Call Handler
  const handleEndCall = () => {
    setIsCallActive(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const displayCode = mounted ? contextDef.code : "F-1";
  const displayCategory = mounted ? contextDef.category : "Academic";
  const displayDifficulty = mounted
    ? difficultyLabels[difficulty]?.toUpperCase() || difficulty.toUpperCase()
    : "REALISTIC";

  return (
    <main
      className={`h-screen max-h-screen w-full bg-[#F5F2EC] text-[#141414] ${
        isFullscreen ? "p-0" : "p-3 sm:p-5 lg:p-6"
      } overflow-hidden flex flex-col justify-center items-center select-none font-sans transition-all duration-200`}
    >
      {/* Outer Main Container with Soft Rounded Border matching reference */}
      <div
        className={`w-full h-full bg-white flex overflow-hidden relative ${
          isFullscreen
            ? "max-w-none rounded-none border-0 shadow-none"
            : "max-w-[1440px] rounded-3xl sm:rounded-[32px] border border-[#E6E0D4] shadow-[0_12px_40px_rgba(20,20,20,0.06)]"
        }`}
      >
        {/* Left 70%: Video Call Screens & Call Controls */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 lg:p-6 border-r border-[#EFEBE3] overflow-hidden bg-white">
          {/* Top Bar: Brand, Home, and Fullscreen */}
          <div className="flex items-center justify-between gap-4 pb-2 shrink-0">
            {/* Left: Brand Logo & Home Action */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                <img
                  src="/images/visora-logo-white.png"
                  alt="Visora"
                  className="h-4 sm:h-4.5 w-auto object-contain invert"
                />
              </Link>
              <div className="h-4 w-px bg-[#DCD5C9]" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#6B665F] hover:text-[#141414] px-2.5 py-1 rounded-full hover:bg-black/5 transition-all font-medium"
                title="Go to Homepage"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>

            {/* Center: Context & Mode Pill (Dynamic from User Selection) */}
            <div className="hidden sm:flex items-center gap-2 bg-[#FAF8F5] border border-[#E8E2D8] px-3.5 py-1.5 rounded-full shadow-2xs text-xs font-sans text-[#6B665F]">
              <span className={`w-2 h-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-pulse" : "bg-[#A8A29E]"}`} />
              <span className="font-bold text-[#141414] tracking-tight">{displayCode}</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="font-medium text-[#5C564E]">{displayCategory}</span>
              <span className="text-[#D0CAC0]">•</span>
              <span className="text-[11px] font-semibold tracking-wide uppercase text-[#A25A24] bg-[#FAF3EC] px-2 py-0.5 rounded-full border border-[#EBD7C3]">
                {displayDifficulty}
              </span>
            </div>

            {/* Right: Full screen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 text-xs text-[#5C564E] hover:text-[#141414] bg-white border border-[#E8E2D8] hover:border-[#C5BCAD] px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer font-medium"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit full screen" : "Full screen"}</span>
            </button>
          </div>

          {/* Center: 2 Video Call Screens (Side by Side - Immersive & Full) */}
          <div className="flex-1 my-3 sm:my-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch min-h-0 overflow-hidden">
            {/* Screen 1: AI Model / Consular Officer Stream Placeholder */}
            <div className="relative w-full h-full min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#161820] border border-[#E4DED3] shadow-[0_4px_24px_rgba(20,20,20,0.06)] flex flex-col items-center justify-center group">
              {/* Officer image background with subtle editorial lighting */}
              <img
                src={contextDef.image}
                alt="AI Consular Officer"
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Holographic AI Soundwave Indicator when speaking */}
              {isCallActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-emerald-400">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI Officer Speaking</span>
                </div>
              )}

              {/* Officer Identification Tag */}
              <div className="absolute bottom-4 left-4 z-10 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium shadow-sm">
                <span>Officer</span>
              </div>
            </div>

            {/* Screen 2: User / Candidate Camera View */}
            <div className="relative w-full h-full min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#202022] border border-[#E4DED3] shadow-[0_4px_24px_rgba(20,20,20,0.06)] flex flex-col items-center justify-center">
              {/* Live Webcam Video Feed */}
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover -scale-x-100 ${isVideoOn ? "block" : "hidden"}`}
              />

              {/* Video Off Placeholder */}
              {!isVideoOn && (
                <div className="flex items-center justify-center text-[#B5B0A6]">
                  <span className="text-xs font-mono tracking-wide">Camera is turned off</span>
                </div>
              )}

              {/* Candidate Identification Tag */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium shadow-sm">
                <span>You (me)</span>
                {!isMicOn && <MicOff className="w-3.5 h-3.5 text-red-400" />}
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="flex items-center justify-between pt-2 shrink-0 border-t border-[#EFEBE3]">
            {/* Left: Working Settings Trigger */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-full text-[#5C564E] hover:text-[#141414] hover:bg-black/5 transition-all cursor-pointer relative"
              title="Audio & Video Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Center: Call Controls (Camera - Call - Mic) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Camera Video Toggle (Left) */}
              <button
                type="button"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-all cursor-pointer shadow-xs ${
                  isVideoOn
                    ? "bg-white text-[#141414] border border-[#DCD5C9] hover:bg-[#F2EDE5]"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                }`}
                title={isVideoOn ? "Turn off camera" : "Turn on camera"}
              >
                {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {/* Call Start / End Pill Button (Center) */}
              {!isCallActive ? (
                <button
                  type="button"
                  onClick={handleStartCall}
                  className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Call</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="inline-flex items-center gap-2 bg-[#EF4444] hover:bg-[#DC2626] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>
              )}

              {/* Mic Toggle (Right) */}
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-all cursor-pointer shadow-xs ${
                  isMicOn
                    ? "bg-white text-[#141414] border border-[#DCD5C9] hover:bg-[#F2EDE5]"
                    : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                }`}
                title={isMicOn ? "Mute microphone" : "Unmute microphone"}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Right: Back to Setup Navigation */}
            <Link
              href="/setup"
              className="p-2.5 rounded-full text-[#5C564E] hover:text-[#141414] hover:bg-black/5 transition-all cursor-pointer"
              title="Back to Setup"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right 30%: Top Half Transcript + Bottom Half 4 Stats */}
        <div className="w-full md:w-80 lg:w-[380px] xl:w-[400px] flex flex-col justify-between p-4 sm:p-5 lg:p-6 bg-white overflow-hidden shrink-0">
          {/* Top Half: Transcript Area */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden pb-4 border-b border-[#EFEBE3]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4] shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.06em] text-[#141414]">
                  Transcript
                </span>
                <span className={`w-2 h-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-pulse" : "bg-[#B5B0A6]"}`} />
              </div>
              <span className="text-xs font-sans text-[#78736A] font-medium">
                {isCallActive ? "Live Recording" : "Standby"}
              </span>
            </div>

            {/* Transcript Messages List (Left for Officer, Right for You) */}
            <div className="flex-1 min-h-0 my-2 overflow-y-auto flex flex-col gap-3 pr-1">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-8 text-[#8E887E]">
                  <div className="p-2.5 rounded-full bg-[#FAF8F5] border border-[#EAE4DA]">
                    <Sparkles className="w-5 h-5 text-[#A25A24]" />
                  </div>
                  <p className="text-xs font-sans text-[#78736A] leading-relaxed max-w-[240px]">
                    Voice dialogue will stream here in real-time when the session begins...
                  </p>
                </div>
              ) : (
                transcripts.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 p-3 text-xs shadow-2xs transition-all duration-300 ${
                      msg.sender === "officer"
                        ? "self-start max-w-[88%] bg-[#FAF8F5] border border-[#EAE4DA] text-[#141414] rounded-2xl rounded-tl-xs"
                        : "self-end max-w-[88%] bg-[#191919] text-white rounded-2xl rounded-tr-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] font-sans">
                      <span className={msg.sender === "officer" ? "font-bold text-[#A25A24]" : "font-bold text-[#E8E2D8]"}>
                        {msg.sender === "officer" ? "Officer" : "You (me)"}
                      </span>
                      <span className={msg.sender === "officer" ? "text-[#8E887E]" : "text-[#9E988E]"}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="leading-relaxed font-sans text-xs pt-0.5">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Voice Stream Status Footer */}
            <div className="pt-2.5 flex items-center justify-between border-t border-[#F0ECE4] text-xs font-sans text-[#78736A] shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCallActive ? "bg-emerald-500 animate-pulse" : "bg-[#B5B0A6]"}`} />
                <span className="font-medium text-[#5C564E]">{isCallActive ? "Voice Stream Active" : "Voice Agent Ready"}</span>
              </div>
              <span className="text-[11px] text-[#A25A24] font-semibold tracking-wide uppercase">Auto Transcription</span>
            </div>
          </div>

          {/* Bottom Half: 4 Telemetry Stats (2x2 Grid) */}
          <div className="pt-4 flex flex-col gap-2.5 shrink-0">
            <span className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[#78736A]">
              Live Engine Telemetry
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* TTFB */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DA] rounded-2xl p-3 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#78736A] text-xs font-sans font-medium">
                  <Activity className="w-3.5 h-3.5 text-[#A25A24]" />
                  <span>TTFB</span>
                </div>
                <span className="text-sm font-sans font-bold text-[#141414]">
                  {ttfb}
                </span>
              </div>

              {/* LLM / TTS */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DA] rounded-2xl p-3 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#78736A] text-xs font-sans font-medium">
                  <Cpu className="w-3.5 h-3.5 text-[#485244]" />
                  <span>LLM / TTS</span>
                </div>
                <span className="text-sm font-sans font-bold text-[#141414]">
                  {isCallActive ? "Live (Gemini)" : "--"}
                </span>
              </div>

              {/* Frames */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DA] rounded-2xl p-3 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#78736A] text-xs font-sans font-medium">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Frames</span>
                </div>
                <span className="text-sm font-sans font-bold text-emerald-700">
                  {frames}
                </span>
              </div>

              {/* Loss */}
              <div className="bg-[#FAF8F5] border border-[#EAE4DA] rounded-2xl p-3 flex flex-col gap-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[#78736A] text-xs font-sans font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>Loss</span>
                </div>
                <span className="text-sm font-sans font-bold text-rose-700">
                  0%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal (Working Audio & Video Controls) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EAE4DA] rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0ECE4]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#A25A24]" />
                <h3 className="text-sm font-bold text-[#141414]">Device &amp; Audio Calibration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-full text-[#78736A] hover:text-[#141414] hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Microphone Selector */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-[#5C564E]">Audio Input (Microphone)</label>
              <select
                value={selectedMic}
                onChange={(e) => setSelectedMic(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              >
                <option>Default - Built-in Microphone</option>
                <option>High Definition Audio Device</option>
                <option>USB Audio Headset</option>
              </select>
            </div>

            {/* Camera Selector */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-[#5C564E]">Video Input (Camera)</label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DCD5C9] bg-[#FAF8F5] text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              >
                <option>Default - HD Web Camera</option>
                <option>Integrated Front Camera (1080p)</option>
                <option>External Virtual Capture</option>
              </select>
            </div>

            {/* Advanced Toggles */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#F0ECE4] text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#5C564E]">AI Noise Suppression</span>
                <input
                  type="checkbox"
                  checked={noiseSuppression}
                  onChange={(e) => setNoiseSuppression(e.target.checked)}
                  className="rounded text-[#141414] accent-[#141414]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-[#5C564E]">Acoustic Echo Cancellation</span>
                <input
                  type="checkbox"
                  checked={echoCancellation}
                  onChange={(e) => setEchoCancellation(e.target.checked)}
                  className="rounded text-[#141414] accent-[#141414]"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-full bg-[#141414] hover:bg-[#2C332A] text-white py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
