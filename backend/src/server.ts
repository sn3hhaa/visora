import { buildApp } from "./app";
import { loadConfig } from "./config/env";

async function main() {
  const config = loadConfig();
  const app = await buildApp(config);

  const shutdown = async (signal: string) => {
    app.log.info({ signal }, "shutting down");
    await app.close();
    process.exit(0);
  };
  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`Interview WebSocket: ws://localhost:${config.PORT}/ws/interview`);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EADDRINUSE") {
      app.log.error(`Port ${config.PORT} is already in use. Stop the other process or set PORT in backend/.env.`);
    } else {
      app.log.error(error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
