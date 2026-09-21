"use client";

import * as React from "react";
import { Play, RotateCcw, Volume2, VolumeX, Trophy } from "lucide-react";

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "cone" | "radar" | "barrier" | "drone";
  counted?: boolean;
}

interface Cloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
}

export function AirplaneGame() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Game state: starts stationary in "idle" mode
  const [gameState, setGameState] = React.useState<"idle" | "playing" | "gameover">("idle");
  const [score, setScore] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);
  const [isSoundMuted, setIsSoundMuted] = React.useState(true);

  // References for animation loop
  const stateRef = React.useRef({
    gameState: "idle" as "idle" | "playing" | "gameover",
    score: 0,
    highScore: 0,
    plane: {
      x: 50,
      y: 0,
      vy: 0,
      width: 44,
      height: 24,
      rotation: 0,
      grounded: true,
    },
    gravity: 0.48,
    jumpForce: -8.8,
    speed: 5.2,
    baseSpeed: 5.2,
    obstacles: [] as Obstacle[],
    clouds: [] as Cloud[],
    runwayOffset: 0,
    groundY: 140,
    lastSpawn: 0,
    spawnDistance: 240,
    animationFrameId: 0,
  });

  // Load high score
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("visora_flight_highscore");
      if (saved) {
        const val = parseInt(saved, 10);
        setHighScore(val);
        stateRef.current.highScore = val;
      }
    } catch {
      // ignore
    }
  }, []);

  // Simple Web Audio sound effects
  const playSound = React.useCallback(
    (type: "jump" | "score" | "crash") => {
      if (isSoundMuted || typeof window === "undefined") return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === "jump") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === "score") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.setValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === "crash") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        }
      } catch {
        // AudioContext fallback
      }
    },
    [isSoundMuted]
  );

  // Explicitly Start / Restart flight via Play button
  const startGame = React.useCallback(() => {
    const s = stateRef.current;
    s.gameState = "playing";
    s.score = 0;
    s.speed = s.baseSpeed;
    s.plane.y = s.groundY - s.plane.height;
    s.plane.vy = 0;
    s.plane.rotation = 0;
    s.plane.grounded = true;
    s.obstacles = [];
    s.lastSpawn = 0;
    s.spawnDistance = 220;

    setScore(0);
    setGameState("playing");
    playSound("jump");
  }, [playSound]);

  // Jump action (only active during gameplay)
  const handleJump = React.useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === "playing") {
      s.plane.vy = s.jumpForce;
      s.plane.grounded = false;
      playSound("jump");
    }
  }, [playSound]);

  // Keyboard controls: only active when user is playing
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (s.gameState === "playing") {
        if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView) {
              e.preventDefault();
              handleJump();
            }
          }
        } else if (["ArrowDown", "KeyS"].includes(e.code)) {
          e.preventDefault();
          stateRef.current.plane.vy += 2.5;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  // Setup Canvas & Game Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 600;
    let height = 180;

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(300, Math.floor(rect.width));
      height = Math.max(160, Math.floor(rect.height || 180));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const s = stateRef.current;
      s.groundY = height - 24;
      if (s.plane.grounded || s.gameState === "idle") {
        s.plane.y = s.groundY - s.plane.height;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (containerRef.current) observer.observe(containerRef.current);

    // Static clouds
    stateRef.current.clouds = [
      { x: 40, y: 22, speed: 0.5, scale: 0.9 },
      { x: 200, y: 35, speed: 0.35, scale: 1.1 },
      { x: 390, y: 16, speed: 0.65, scale: 0.8 },
      { x: 560, y: 30, speed: 0.45, scale: 1.0 },
    ];

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.666, 2.0);
      lastTime = time;

      const s = stateRef.current;
      const p = s.plane;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Clouds
      ctx.fillStyle = "#EAE4DA";
      s.clouds.forEach((cloud) => {
        if (s.gameState === "playing") {
          cloud.x -= (cloud.speed + s.speed * 0.1) * dt;
          if (cloud.x < -100) {
            cloud.x = width + Math.random() * 80;
            cloud.y = 12 + Math.random() * 35;
          }
        }
        ctx.beginPath();
        const r = 9 * cloud.scale;
        ctx.arc(cloud.x, cloud.y, r, 0, Math.PI * 2);
        ctx.arc(cloud.x + r * 0.9, cloud.y - r * 0.4, r * 1.1, 0, Math.PI * 2);
        ctx.arc(cloud.x + r * 1.8, cloud.y, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Runway Ground & Striping
      ctx.strokeStyle = "#D6CFC4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, s.groundY);
      ctx.lineTo(width, s.groundY);
      ctx.stroke();

      // Moving Runway Dashes (only moves when playing)
      if (s.gameState === "playing") {
        s.runwayOffset = (s.runwayOffset + s.speed * dt) % 36;
      }
      ctx.strokeStyle = "#8A847A";
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 22]);
      ctx.beginPath();
      ctx.moveTo(-s.runwayOffset, s.groundY + 12);
      ctx.lineTo(width + 36, s.groundY + 12);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 3. Update Game Logic
      if (s.gameState === "playing") {
        p.vy += s.gravity * dt;
        p.y += p.vy * dt;

        if (p.y >= s.groundY - p.height) {
          p.y = s.groundY - p.height;
          p.vy = 0;
          p.grounded = true;
          p.rotation = 0;
        } else {
          p.grounded = false;
          const targetRot = p.vy < 0 ? -0.22 : Math.min(0.24, p.vy * 0.035);
          p.rotation += (targetRot - p.rotation) * 0.15;
        }

        if (p.y < 6) {
          p.y = 6;
          p.vy = 0;
        }

        s.score += Math.round(s.speed * 0.1 * dt);
        setScore(s.score);

        s.speed = Math.min(11, s.baseSpeed + Math.floor(s.score / 200) * 0.45);

        s.lastSpawn += s.speed * dt;
        if (s.lastSpawn > s.spawnDistance) {
          s.lastSpawn = 0;
          const types: Obstacle["type"][] = ["cone", "radar", "barrier", "drone"];
          const type = types[Math.floor(Math.random() * types.length)];
          let obsW = 20;
          let obsH = 26;
          let obsY = s.groundY - obsH;

          if (type === "cone") {
            obsW = 16;
            obsH = 22;
            obsY = s.groundY - obsH;
          } else if (type === "radar") {
            obsW = 24;
            obsH = 32;
            obsY = s.groundY - obsH;
          } else if (type === "barrier") {
            obsW = 28;
            obsH = 20;
            obsY = s.groundY - obsH;
          } else if (type === "drone") {
            obsW = 22;
            obsH = 16;
            obsY = s.groundY - 46 - Math.random() * 26;
          }

          s.obstacles.push({
            x: width + 20,
            y: obsY,
            width: obsW,
            height: obsH,
            type,
          });

          s.spawnDistance = 240 + Math.random() * 160;
        }

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed * dt;

          if (!obs.counted && obs.x < p.x) {
            obs.counted = true;
            if (s.score % 200 < 20) {
              playSound("score");
            }
          }

          const hitPadding = 5;
          const planeBox = {
            left: p.x + 8,
            right: p.x + p.width - hitPadding,
            top: p.y + 4,
            bottom: p.y + p.height - (p.grounded ? 0 : 3),
          };

          const obsBox = {
            left: obs.x + 3,
            right: obs.x + obs.width - 3,
            top: obs.y + 3,
            bottom: obs.y + obs.height,
          };

          const isColliding =
            planeBox.right > obsBox.left &&
            planeBox.left < obsBox.right &&
            planeBox.bottom > obsBox.top &&
            planeBox.top < obsBox.bottom;

          if (isColliding) {
            s.gameState = "gameover";
            setGameState("gameover");
            playSound("crash");

            if (s.score > s.highScore) {
              s.highScore = s.score;
              setHighScore(s.score);
              try {
                localStorage.setItem("visora_flight_highscore", `${s.score}`);
              } catch {
                // ignore
              }
            }
            break;
          }

          if (obs.x < -50) {
            s.obstacles.splice(i, 1);
          }
        }
      } else {
        // Idle/Gameover: parked stationarily on runway
        p.y = s.groundY - p.height;
        p.rotation = 0;
      }

      // 4. Draw Obstacles
      s.obstacles.forEach((obs) => {
        ctx.fillStyle = "#1E221D";
        ctx.strokeStyle = "#1E221D";

        if (obs.type === "cone") {
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#FAF8F5";
          ctx.fillRect(obs.x + 4, obs.y + 8, obs.width - 8, 4);
        } else if (obs.type === "radar") {
          ctx.lineWidth = 2;
          ctx.strokeRect(obs.x + 6, obs.y + 14, obs.width - 12, obs.height - 14);
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + 8, 8, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(obs.x + obs.width / 2, obs.y + 8);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + 14);
          ctx.stroke();
        } else if (obs.type === "barrier") {
          ctx.fillRect(obs.x, obs.y + obs.height - 16, obs.width, 16);
          ctx.fillStyle = "#FAF8F5";
          ctx.fillRect(obs.x + 4, obs.y + obs.height - 12, obs.width - 8, 4);
        } else if (obs.type === "drone") {
          ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, 8);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + 2);
          ctx.lineTo(obs.x + obs.width, obs.y + 2);
          ctx.moveTo(obs.x + 2, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width - 2, obs.y + obs.height);
          ctx.stroke();
          ctx.fillStyle = Math.sin(time * 0.01) > 0 ? "#C84B31" : "#8A847A";
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Draw Sleek Airplane (Vector Sprite)
      ctx.save();
      ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
      ctx.rotate(p.rotation);

      // Fuselage Main Body
      ctx.fillStyle = "#181A18";
      ctx.beginPath();
      ctx.moveTo(22, 1);
      ctx.quadraticCurveTo(8, -8, -12, -7);
      ctx.lineTo(-20, -15);
      ctx.lineTo(-22, -15);
      ctx.lineTo(-18, -3);
      ctx.lineTo(-20, 4);
      ctx.quadraticCurveTo(0, 6, 22, 1);
      ctx.closePath();
      ctx.fill();

      // Main Wing
      ctx.fillStyle = "#2D342B";
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(-8, 9);
      ctx.lineTo(-14, 9);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();

      // Cockpit Window
      ctx.fillStyle = "#FAF8F5";
      ctx.beginPath();
      ctx.moveTo(15, -2);
      ctx.lineTo(9, -5);
      ctx.lineTo(6, -2);
      ctx.closePath();
      ctx.fill();

      // Landing Gear (When near ground or parked)
      if (p.grounded || s.gameState !== "playing" || p.y > s.groundY - p.height - 12) {
        ctx.fillStyle = "#4A453E";
        ctx.fillRect(8, 5, 2, 5);
        ctx.beginPath();
        ctx.arc(9, 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-8, 5, 2, 5);
        ctx.beginPath();
        ctx.arc(-7, 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Jet trail when flying
      if (!p.grounded && s.gameState === "playing") {
        ctx.fillStyle = "#D97736";
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-26 - Math.random() * 6, 1);
        ctx.lineTo(-20, 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      s.animationFrameId = requestAnimationFrame(loop);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(stateRef.current.animationFrameId);
    };
  }, [playSound]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => {
        if (gameState === "playing") {
          handleJump();
        }
      }}
      className={`relative w-full h-[170px] sm:h-[180px] bg-transparent overflow-hidden select-none focus:outline-none ${
        gameState === "playing" ? "cursor-pointer" : "cursor-default"
      }`}
      aria-label="Interactive Airplane Runner"
    >
      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top HUD: Distance Score on Top-Left + Play Controls on Top-Right */}
      <div className="absolute top-1.5 inset-x-1 flex items-center justify-between pointer-events-none z-10">
        {/* Score & Status */}
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#141414]">
            {score.toString().padStart(4, "0")}m
          </span>

          {highScore > 0 && (
            <span className="flex items-center gap-1 font-mono text-[11px] text-[#8C8477]">
              <Trophy className="w-2.5 h-2.5 text-[#B48434]" />
              HI {highScore.toString().padStart(4, "0")}m
            </span>
          )}

          {gameState === "gameover" && (
            <span className="text-[11px] font-mono text-[#B33927] font-semibold animate-pulse">
              • CRASHED (CLICK RETRY)
            </span>
          )}
        </div>

        {/* Top-Right Action Controls: Dedicated Play / Retry Button & Sound Toggle */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Main Play Button to explicitly start / retry */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (gameState === "idle" || gameState === "gameover") {
                startGame();
              } else if (gameState === "playing") {
                handleJump();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1916] hover:bg-[#2C332A] text-[#FAF8F5] text-[11px] font-medium transition-all shadow-sm active:scale-95"
            aria-label={gameState === "playing" ? "Fly Up" : "Start Airplane Game"}
          >
            {gameState === "gameover" ? (
              <>
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </>
            ) : gameState === "playing" ? (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Fly</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSoundMuted((prev) => !prev);
            }}
            className="p-1 rounded-full text-[#8C8477] hover:text-[#141414] transition-colors"
            aria-label={isSoundMuted ? "Unmute audio" : "Mute audio"}
          >
            {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
