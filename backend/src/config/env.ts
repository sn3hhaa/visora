import "dotenv/config";
import { z } from "zod";

const csv = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().min(0).max(65535).default(4000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGINS: csv.default(["http://localhost:3000"]),

  LLM_PROVIDER: z.enum(["demo"]).default("demo"),
  LLM_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),

  SESSION_IDLE_TTL_MS: z.coerce.number().int().positive().default(30 * 60 * 1000),
  SESSION_SWEEP_INTERVAL_MS: z.coerce.number().int().positive().default(60 * 1000),
  MAX_SESSIONS: z.coerce.number().int().positive().default(200),
  WS_MAX_PAYLOAD_BYTES: z.coerce.number().int().positive().default(64 * 1024),
});

export type AppConfig = z.infer<typeof envSchema>;

export function loadConfig(source: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return parsed.data;
}
