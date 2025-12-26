import { useState, useRef, useEffect } from "react";
import { useReading, ChatMessage } from "@/pages/Reading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MessageSquare,
  StickyNote,
  Brain,
  Send,
  ChevronDown,
  Loader2,
  Sparkles,
  User,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KnowledgeAssistantProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function KnowledgeAssistant({ activeTab, onTabChange }: KnowledgeAssistantProps) {
  return (
    <div className="h-full flex flex-col bg-card/30 border-l border-border">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col">
        <div className="px-4 pt-3 border-b border-border">
          <TabsList className="w-full bg-secondary/50 p-1">
            <TabsTrigger
              value="chat"
              className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
            >
              <StickyNote className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="flex-1 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple"
            >
              <Brain className="h-4 w-4 mr-2" />
              Deep Analysis
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
          <ChatTab />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
          <NotesTab />
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
          <DeepAnalysisTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChatTab() {
  const { chatMessages, setChatMessages } = useReading();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate thinking
    setTimeout(() => {
      const thinkingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isThinking: true,
        thinkingSteps: [
          "Understanding question...",
          "Searching paper context...",
          "Analyzing relevant sections...",
          "Formulating response...",
        ],
      };
      setChatMessages((prev) => [...prev, thinkingMessage]);

      // Simulate response
      setTimeout(() => {
        setChatMessages((prev) => {
          const filtered = prev.filter((m) => !m.isThinking);
          const response: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Based on my analysis of the paper, I can help you understand this concept.\n\nThe ReasonAgent framework introduces a novel approach to multi-step reasoning that differs from traditional chain-of-thought in several key ways:\n\n1. **Hierarchical Structure**: Instead of linear reasoning, it uses a tree-based approach\n2. **Dynamic Expansion**: The reasoning depth adapts to problem complexity\n3. **Confidence-based Pruning**: Low-confidence paths are automatically trimmed\n\nWould you like me to elaborate on any of these aspects?`,
            timestamp: new Date(),
          };
          return [...filtered, response];
        });
        setIsLoading(false);
      }, 2500);
    }, 500);
  };

  return (
    <>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Knowledge Assistant
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask questions about the paper, or select text in the PDF and click
              "Explain" to get instant insights.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about the paper..."
            className="min-h-[44px] max-h-32 resize-none bg-secondary/50 border-border focus:border-primary"
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="h-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const [thinkingOpen, setThinkingOpen] = useState(true);
  const isUser = message.role === "user";

  if (message.isThinking) {
    return (
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <Collapsible open={thinkingOpen} onOpenChange={setThinkingOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto bg-secondary/50 border border-border hover:bg-secondary/80"
              >
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    thinkingOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-3 bg-secondary/30 rounded-lg border border-border space-y-2">
                {message.thinkingSteps?.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {i < (message.thinkingSteps?.length || 0) - 1 ? (
                      <CheckCircle2 className="h-4 w-4 text-neon-green" />
                    ) : (
                      <Circle className="h-4 w-4 text-primary animate-pulse" />
                    )}
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-secondary border border-border"
            : "bg-primary/10 border border-primary/20"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 p-3 rounded-lg text-sm",
          isUser
            ? "bg-primary/10 border border-primary/20 text-foreground"
            : "bg-secondary/50 border border-border text-foreground"
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}

function NotesTab() {
  const { notes, setNotes, highlights } = useReading();

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      {highlights.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Highlights ({highlights.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-auto">
            {highlights.map((h) => (
              <div
                key={h.id}
                className="p-2 rounded bg-primary/10 border border-primary/20 text-xs text-foreground/80 line-clamp-2"
              >
                "{h.text}"
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Notes
        </h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start taking notes... Markdown supported.&#10;&#10;Use > for quotes from the paper."
          className="flex-1 resize-none bg-secondary/50 border-border focus:border-neon-green font-mono text-sm"
        />
      </div>
    </div>
  );
}

function DeepAnalysisTab() {
  const analyses = [
    {
      title: "Key Contributions",
      content: "1. Hierarchical thought decomposition framework\n2. Dynamic expansion based on problem complexity\n3. 23% improvement over CoT prompting",
      status: "complete",
    },
    {
      title: "Methodology",
      content: "Tree-based reasoning with confidence-based pruning. Combines supervised fine-tuning with RL for learning decomposition.",
      status: "complete",
    },
    {
      title: "Limitations",
      content: "• Increased computational cost for tree construction\n• Requires training data for decomposition learning\n• May not generalize to all reasoning domains",
      status: "pending",
    },
  ];

  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Automated Analysis
        </h3>
        <Button size="sm" className="bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 border-0">
          <Brain className="h-4 w-4 mr-1" />
          Run Analysis
        </Button>
      </div>

      <div className="space-y-3">
        {analyses.map((analysis, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-secondary/50 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-foreground">
                {analysis.title}
              </h4>
              {analysis.status === "complete" ? (
                <CheckCircle2 className="h-4 w-4 text-neon-green" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
              {analysis.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
