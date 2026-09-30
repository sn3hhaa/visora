import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  await app.register(cors, {
    origin: "http://localhost:3000",
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "visora-backend",
      timestamp: new Date().toISOString(),
    };
  });

  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Visora backend running on http://localhost:${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();