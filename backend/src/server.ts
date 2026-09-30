import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { handleInterviewSocket } from "./websocket/interview.socket";

const app = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
  await app.register(cors, {
    origin: "http://localhost:3000",
  });

  await app.register(websocket);

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "visora-backend",
      timestamp: new Date().toISOString(),
    };
  });

  app.get("/ws/interview", { websocket: true }, (socket) => {
    handleInterviewSocket(socket);
  });

  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Visora backend running on http://localhost:${PORT}`);
    console.log(`Visora interview WebSocket: ws://localhost:${PORT}/ws/interview`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

startServer();
