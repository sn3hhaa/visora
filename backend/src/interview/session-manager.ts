import { randomUUID } from "node:crypto";
import type { InterviewSession, InterviewSetup } from "./types";

export class SessionCapacityError extends Error {
  constructor() {
    super("The server has reached its active session limit. Please try again shortly.");
  }
}

export interface SessionManagerOptions {
  idleTtlMs: number;
  maxSessions: number;
  sweepIntervalMs: number;
  /** Called when a session is removed by expiry, before deletion. */
  onExpire?: (session: InterviewSession) => void;
  now?: () => number;
}

const SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isValidSessionId(id: string): boolean {
  return SESSION_ID_PATTERN.test(id);
}

/** In-memory session store. Sessions live on a single backend instance. */
export class SessionManager {
  private readonly sessions = new Map<string, InterviewSession>();
  private sweepTimer: NodeJS.Timeout | null = null;
  private readonly now: () => number;

  constructor(private readonly options: SessionManagerOptions) {
    this.now = options.now ?? Date.now;
  }

  start(): void {
    if (this.sweepTimer) return;
    this.sweepTimer = setInterval(() => this.sweep(), this.options.sweepIntervalMs);
    this.sweepTimer.unref();
  }

  stop(): void {
    if (this.sweepTimer) clearInterval(this.sweepTimer);
    this.sweepTimer = null;
  }

  create(setup: InterviewSetup): InterviewSession {
    if (this.sessions.size >= this.options.maxSessions) {
      this.sweep();
      if (this.sessions.size >= this.options.maxSessions) throw new SessionCapacityError();
    }

    const now = this.now();
    const session: InterviewSession = {
      id: randomUUID(),
      setup,
      phase: "processing",
      transcript: [],
      questionCount: 0,
      currentTopicId: null,
      coveredTopicIds: [],
      followUps: {},
      createdAt: now,
      lastActivityAt: now,
      completedAt: null,
      completionReason: null,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  get(id: string): InterviewSession | undefined {
    if (!isValidSessionId(id)) return undefined;
    const session = this.sessions.get(id);
    if (session && this.isExpired(session)) {
      this.expire(session);
      return undefined;
    }
    return session;
  }

  touch(session: InterviewSession): void {
    session.lastActivityAt = this.now();
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  get size(): number {
    return this.sessions.size;
  }

  /** Removes idle sessions. Returns the number removed. */
  sweep(): number {
    let removed = 0;
    for (const session of this.sessions.values()) {
      if (this.isExpired(session)) {
        this.expire(session);
        removed += 1;
      }
    }
    return removed;
  }

  private isExpired(session: InterviewSession): boolean {
    return this.now() - session.lastActivityAt > this.options.idleTtlMs;
  }

  private expire(session: InterviewSession): void {
    this.options.onExpire?.(session);
    this.sessions.delete(session.id);
  }
}
