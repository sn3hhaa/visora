import { WebSocket } from "ws";
import { interviewSetupSchema, type InterviewDifficulty, type InterviewSession, type InterviewSetup } from "../src/interview/types";
import { SessionManager } from "../src/interview/session-manager";

export function makeSetup(context: InterviewSetup["context"] = "f1", difficulty: InterviewDifficulty = "realistic"): InterviewSetup {
  const profiles = {
    f1: { university: "Carnegie Mellon University", program: "M.S. in Computer Science", academicBackground: "B.Tech in Computer Engineering" },
    h1b: { employer: "Acme Robotics", role: "Senior Software Engineer", experience: "6 years" },
    b1b2: { purpose: "attending the PyCon US conference", duration: "12 days", destination: "Pittsburgh" },
  };
  return interviewSetupSchema.parse({ context, difficulty, profile: profiles[context] });
}

export function makeSession(setup: InterviewSetup = makeSetup()): InterviewSession {
  const manager = new SessionManager({ idleTtlMs: 60_000, maxSessions: 10, sweepIntervalMs: 60_000 });
  return manager.create(setup);
}

export const STRONG_ANSWER =
  "I chose Carnegie Mellon because Professor Rao's Parallel Data Lab matches my capstone on distributed storage, and my father, a civil engineer earning 24 lakh per year, has committed 45,000 dollars from savings.";

export type ServerMsg = { type: string; [key: string]: any };

/** Minimal test client that buffers server messages and lets tests await specific types. */
export class TestClient {
  readonly messages: ServerMsg[] = [];
  private waiters: { predicate: (m: ServerMsg) => boolean; resolve: (m: ServerMsg) => void }[] = [];
  private cursor = 0;
  closeCode: number | null = null;

  private constructor(readonly ws: WebSocket) {
    ws.on("message", (raw) => {
      const message = JSON.parse(raw.toString()) as ServerMsg;
      this.messages.push(message);
      this.waiters = this.waiters.filter((waiter) => {
        if (waiter.predicate(message)) {
          waiter.resolve(message);
          return false;
        }
        return true;
      });
    });
    ws.on("close", (code) => {
      this.closeCode = code;
    });
  }

  static connect(url: string, headers: Record<string, string> = {}): Promise<TestClient> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url, { headers });
      const client = new TestClient(ws);
      ws.once("open", () => resolve(client));
      ws.once("error", reject);
    });
  }

  send(message: unknown): void {
    this.ws.send(typeof message === "string" ? message : JSON.stringify(message));
  }

  /** Resolves with the next message of `type` not yet consumed by a previous `next` call. */
  next(type: string, timeoutMs = 3000): Promise<ServerMsg> {
    return this.nextOf([type], timeoutMs);
  }

  /** Like `next`, but accepts whichever of `types` arrives first. */
  nextOf(types: string[], timeoutMs = 3000): Promise<ServerMsg> {
    const index = this.messages.findIndex((m, i) => i >= this.cursor && types.includes(m.type));
    if (index !== -1) {
      this.cursor = index + 1;
      return Promise.resolve(this.messages[index]);
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out waiting for "${types.join("|")}". Got: ${this.messages.map((m) => m.type).join(", ")}`)), timeoutMs);
      this.waiters.push({
        predicate: (m) => types.includes(m.type),
        resolve: (m) => {
          clearTimeout(timer);
          this.cursor = this.messages.indexOf(m) + 1;
          resolve(m);
        },
      });
    });
  }

  closed(): Promise<number> {
    if (this.closeCode !== null) return Promise.resolve(this.closeCode);
    return new Promise((resolve) => this.ws.once("close", (code) => resolve(code)));
  }

  close(): void {
    this.ws.close();
  }
}
