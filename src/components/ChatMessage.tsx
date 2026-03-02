import ReactMarkdown from "react-markdown";
import { Scale, User } from "lucide-react";
import type { Message } from "@/lib/chat";

export function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          isAssistant
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isAssistant ? <Scale className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAssistant
            ? "bg-card text-card-foreground border border-border"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_strong]:text-accent-foreground">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
