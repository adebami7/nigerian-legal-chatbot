import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scale, Loader2, Plus, Trash2, MessageSquare } from "lucide-react";
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

type Consultation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

export default function Chat() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewConsultation = () => {
    // Save current if it has user messages
    if (messages.some((m) => m.role === "user") && activeId) {
      setConsultations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
      );
    }
    setMessages([WELCOME]);
    setActiveId(null);
  };

  const loadConsultation = (id: string) => {
    // Save current first
    if (activeId && messages.some((m) => m.role === "user")) {
      setConsultations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
      );
    }
    const consultation = consultations.find((c) => c.id === id);
    if (consultation) {
      setMessages(consultation.messages);
      setActiveId(id);
    }
  };

  const deleteConsultation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConsultations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setMessages([WELCOME]);
      setActiveId(null);
    }
  };

  const handleSend = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Create consultation if new
    if (!activeId) {
      const newId = crypto.randomUUID();
      const newConsultation: Consultation = {
        id: newId,
        title: input.slice(0, 60),
        messages: newMessages,
        createdAt: new Date(),
      };
      setConsultations((prev) => [newConsultation, ...prev]);
      setActiveId(newId);
    } else {
      setConsultations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages: newMessages } : c))
      );
    }

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

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } flex-shrink-0 transition-all duration-300 overflow-hidden border-r border-border bg-card`}
      >
        <div className="flex h-full w-72 flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Scale className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">Judicial Support AI</h1>
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Nigerian Law AI</p>
            </div>
          </div>

          {/* New Consultation */}
          <div className="px-4 py-4">
            <Button
              onClick={startNewConsultation}
              className="w-full gap-2 rounded-xl"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              New Consultation
            </Button>
          </div>

          {/* Consultations List */}
          <div className="px-4 pb-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Recent Consultations
            </p>
          </div>
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 pb-4">
              {consultations.length === 0 && (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No consultations yet
                </p>
              )}
              {consultations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadConsultation(c.id)}
                  className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted ${
                    activeId === c.id ? "bg-muted" : ""
                  }`}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm text-foreground">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{timeAgo(c.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => deleteConsultation(c.id, e)}
                    className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="border-t border-border px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-xs text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="shrink-0">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Judicial Support AI</span>
          </div>
          {isLoading && <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />}
        </header>

        {/* Desktop loading indicator */}
        {isLoading && (
          <div className="hidden md:flex items-center gap-2 border-b border-border bg-card px-6 py-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Generating response…</span>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border bg-card px-4 pb-4 pt-3">
          <div className="mx-auto max-w-3xl">
            <ChatInput onSend={handleSend} disabled={isLoading} />
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              ⚠️ This AI provides general legal information, not legal advice. Always consult a qualified Nigerian lawyer.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
