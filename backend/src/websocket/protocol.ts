export type ClientMessage =
  | {
      type: "session_start";
      sessionId: string;
    }
  | {
      type: "answer_submit";
      transcript: string;
    }
  | {
      type: "session_end";
    };

export type ServerMessage =
  | {
      type: "session_started";
      sessionId: string;
    }
  | {
      type: "agent_processing";
    }
  | {
      type: "next_question";
      question: string;
    }
  | {
      type: "interview_completed";
    }
  | {
      type: "error";
      message: string;
    };
