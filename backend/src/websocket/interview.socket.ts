import type { WebSocket } from "ws";
import type { ClientMessage, ServerMessage } from "./protocol";

export function handleInterviewSocket(socket: WebSocket) {
  socket.on("message", (rawMessage) => {
    try {
      const message = JSON.parse(rawMessage.toString()) as ClientMessage;

      switch (message.type) {
        case "session_start":
          send(socket, {
            type: "session_started",
            sessionId: message.sessionId,
          });
          break;

        case "answer_submit":
          send(socket, {
            type: "agent_processing",
          });

          send(socket, {
            type: "next_question",
            question: "What specifically attracted you to this program?",
          });
          break;

        case "session_end":
          send(socket, {
            type: "interview_completed",
          });
          break;

        default:
          send(socket, {
            type: "error",
            message: "Unsupported message type.",
          });
      }
    } catch {
      send(socket, {
        type: "error",
        message: "Invalid WebSocket message.",
      });
    }
  });
}

function send(socket: WebSocket, message: ServerMessage) {
  socket.send(JSON.stringify(message));
}
