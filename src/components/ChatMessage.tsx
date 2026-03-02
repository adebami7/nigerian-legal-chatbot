import ReactMarkdown from "react-markdown";
import { Scale, User } from "lucide-react";
import type { Message } from "@/lib/chat";

export function ChatMessage({ message }: { message: Message }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={`flex gap-4 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isAssistant
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isAssistant ? <Scale className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0 max-w-[85%]">
        <p className={`mb-1.5 text-[11px] font-semibold uppercase tracking-wider ${
          isAssistant ? "text-muted-foreground" : "text-muted-foreground text-right"
        }`}>
          {isAssistant ? "Judicial AI" : "You"}
        </p>
        <div
          className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
            isAssistant
              ? "bg-card text-card-foreground border border-border"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isAssistant ? (
            <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1.5 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_strong]:font-semibold">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            message.content
          )}
        </div>
      </div>
    </div>
  );
}
