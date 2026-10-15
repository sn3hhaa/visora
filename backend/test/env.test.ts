import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/env";

describe("loadConfig", () => {
  it("applies development defaults", () => {
    const config = loadConfig({});
    expect(config.PORT).toBe(4000);
    expect(config.CORS_ORIGINS).toEqual(["http://localhost:3000"]);
    expect(config.LLM_PROVIDER).toBe("demo");
  });

  it("parses comma-separated CORS origins", () => {
    expect(loadConfig({ CORS_ORIGINS: "https://a.example, https://b.example" }).CORS_ORIGINS).toEqual([
      "https://a.example",
      "https://b.example",
    ]);
  });

  it("reports invalid values clearly", () => {
    expect(() => loadConfig({ PORT: "abc" })).toThrow(/PORT/);
    expect(() => loadConfig({ LLM_PROVIDER: "gemini" })).toThrow(/LLM_PROVIDER/);
  });
});
