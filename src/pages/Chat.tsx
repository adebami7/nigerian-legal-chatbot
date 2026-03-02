import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { streamChat, type Message } from "@/lib/chat";
import { toast } from "sonner";

const WELCOME: Message = {
  role: "assistant",
  content:
    "Welcome. I'm your virtual legal assistant specializing in **Nigerian law** — particularly the **Constitution**, **VAPP Act 2015**, **Criminal Code**, and **Child Rights Act**.\n\nI can help with questions about:\n- 🔒 Sexual violence & rape laws\n- ⚖️ Evidence requirements for court\n- 📋 Steps to take after an assault\n- 🏛️ Your constitutional rights\n\nHow can I assist you today?",
};

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages.filter((m) => m !== WELCOME), userMsg];

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last !== WELCOME) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: allMessages,
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setIsLoading(false);
        toast.error(err);
      },
    });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <Scale className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Judicial Support AI</h1>
            <p className="text-xs text-muted-foreground">Nigerian Law Assistant</p>
          </div>
        </div>
        {isLoading && <Loader2 className="ml-auto mr-2 h-4 w-4 animate-spin text-muted-foreground" />}
        <div className={isLoading ? "" : "ml-auto"}>
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Disclaimer + Input */}
      <div className="border-t border-border bg-card px-4 pb-4 pt-2">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            ⚠️ This AI provides general legal information, not legal advice. Always consult a qualified Nigerian lawyer.
          </p>
        </div>
      </div>
    </div>
  );
}
