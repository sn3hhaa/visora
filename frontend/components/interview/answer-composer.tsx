"use client";

import * as React from "react";
import { CornerDownLeft } from "lucide-react";
import { MAX_ANSWER_CHARS } from "@/lib/realtime/protocol";

interface AnswerComposerProps {
  enabled: boolean;
  placeholder: string;
  /** Returns false if the answer could not be sent (e.g. connection dropped); the draft is kept. */
  onSubmit: (text: string) => boolean;
}

export function AnswerComposer({ enabled, placeholder, onSubmit }: AnswerComposerProps) {
  const [draft, setDraft] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const trimmed = draft.trim();
  const canSend = enabled && trimmed.length > 0 && trimmed.length <= MAX_ANSWER_CHARS;

  React.useEffect(() => {
    if (enabled) textareaRef.current?.focus();
  }, [enabled]);

  const submit = () => {
    if (!canSend) return;
    if (onSubmit(trimmed)) setDraft("");
  };

  return (
    <form
      className="flex flex-col gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <div
        className={`flex items-end gap-2 rounded-2xl border bg-[#FAF8F5] px-3 py-2 transition-colors ${
          enabled ? "border-[#DCD5C9] focus-within:border-[#141414]" : "border-[#EAE4DA] opacity-70"
        }`}
      >
        <label htmlFor="answer-input" className="sr-only">
          Your answer
        </label>
        <textarea
          id="answer-input"
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          disabled={!enabled}
          rows={2}
          maxLength={MAX_ANSWER_CHARS}
          placeholder={placeholder}
          className="flex-1 resize-none bg-transparent text-xs leading-relaxed text-[#141414] placeholder:text-[#A8A29E] focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#141414] px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-[#2C332A] disabled:cursor-not-allowed disabled:bg-[#D6D0C5]"
        >
          <span>Send</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </div>
      <div className="flex justify-between text-[10.5px] text-[#A09A90] px-1">
        <span>Enter to send · Shift+Enter for a new line</span>
        {draft.length > MAX_ANSWER_CHARS * 0.85 && (
          <span>
            {draft.length}/{MAX_ANSWER_CHARS}
          </span>
        )}
      </div>
    </form>
  );
}
