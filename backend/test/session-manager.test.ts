import { describe, expect, it, vi } from "vitest";
import { SessionCapacityError, SessionManager, isValidSessionId } from "../src/interview/session-manager";
import { makeSetup } from "./helpers";

function manager(overrides: Partial<ConstructorParameters<typeof SessionManager>[0]> = {}) {
  let now = 1_000_000;
  const instance = new SessionManager({ idleTtlMs: 1000, maxSessions: 2, sweepIntervalMs: 60_000, now: () => now, ...overrides });
  return { instance, advance: (ms: number) => (now += ms) };
}

describe("SessionManager", () => {
  it("issues UUID v4 session ids and stores the setup", () => {
    const { instance } = manager();
    const session = instance.create(makeSetup("h1b", "strict"));
    expect(isValidSessionId(session.id)).toBe(true);
    expect(instance.get(session.id)?.setup.difficulty).toBe("strict");
  });

  it("rejects malformed ids without lookup", () => {
    const { instance } = manager();
    expect(instance.get("x")).toBeUndefined();
    expect(instance.get("../../etc/passwd")).toBeUndefined();
  });

  it("expires idle sessions and notifies", () => {
    const onExpire = vi.fn();
    const { instance, advance } = manager({ onExpire });
    const session = instance.create(makeSetup());
    advance(500);
    instance.touch(session);
    advance(900);
    expect(instance.get(session.id)).toBeDefined();
    advance(1001);
    expect(instance.get(session.id)).toBeUndefined();
    expect(onExpire).toHaveBeenCalledWith(session);
  });

  it("enforces the session cap, reclaiming expired sessions first", () => {
    const { instance, advance } = manager();
    instance.create(makeSetup());
    instance.create(makeSetup());
    expect(() => instance.create(makeSetup())).toThrow(SessionCapacityError);
    advance(2000);
    expect(() => instance.create(makeSetup())).not.toThrow();
    expect(instance.size).toBe(1);
  });
});
