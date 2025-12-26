import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
              {t("reading.chat.title")}
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="flex-1 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
            >
              <StickyNote className="h-4 w-4 mr-2" />
              {t("reading.notes.title")}
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="flex-1 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple"
            >
              <Brain className="h-4 w-4 mr-2" />
              {t("reading.analysis.title")}
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
  const { t, i18n } = useTranslation();
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

    const isZh = i18n.language === 'zh';

    setTimeout(() => {
      const thinkingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isThinking: true,
        thinkingSteps: isZh
          ? ["理解问题...", "搜索论文上下文...", "分析相关章节...", "生成回答..."]
          : ["Understanding question...", "Searching paper context...", "Analyzing relevant sections...", "Formulating response..."],
      };
      setChatMessages((prev) => [...prev, thinkingMessage]);

      setTimeout(() => {
        setChatMessages((prev) => {
          const filtered = prev.filter((m) => !m.isThinking);
          const response: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: isZh
              ? `基于我对这篇论文的分析，我可以帮助您理解这个概念。\n\nReasonAgent 框架引入了一种新颖的多步推理方法，与传统的思维链有几个关键区别：\n\n1. **层次结构**：不是线性推理，而是使用基于树的方法\n2. **动态扩展**：推理深度根据问题复杂度自适应调整\n3. **基于置信度的剪枝**：低置信度的路径会被自动修剪\n\n您想让我详细解释其中的任何方面吗？`
              : `Based on my analysis of the paper, I can help you understand this concept.\n\nThe ReasonAgent framework introduces a novel approach to multi-step reasoning that differs from traditional chain-of-thought in several key ways:\n\n1. **Hierarchical Structure**: Instead of linear reasoning, it uses a tree-based approach\n2. **Dynamic Expansion**: The reasoning depth adapts to problem complexity\n3. **Confidence-based Pruning**: Low-confidence paths are automatically trimmed\n\nWould you like me to elaborate on any of these aspects?`,
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
              {t("reading.chat.assistantTitle")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("reading.chat.assistantDescription")}
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
            placeholder={t("reading.chat.placeholder")}
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
  const { t } = useTranslation();
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
                    {t("reading.thinking.title")}
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
  const { t } = useTranslation();
  const { notes, setNotes, highlights } = useReading();

  return (
    <div className="flex-1 flex flex-col p-4 gap-4">
      {highlights.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {t("reading.notes.highlights")} ({highlights.length})
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
          {t("reading.notes.notesLabel")}
        </h3>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("reading.notes.placeholder")}
          className="flex-1 resize-none bg-secondary/50 border-border focus:border-neon-green font-mono text-sm"
        />
      </div>
    </div>
  );
}

function DeepAnalysisTab() {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === 'zh';

  const analyses = [
    {
      title: isZh ? "核心贡献" : "Key Contributions",
      content: isZh
        ? "1. 层次化思维分解框架\n2. 基于问题复杂度的动态扩展\n3. 相比 CoT 提示提升 23%"
        : "1. Hierarchical thought decomposition framework\n2. Dynamic expansion based on problem complexity\n3. 23% improvement over CoT prompting",
      status: "complete",
    },
    {
      title: isZh ? "方法论" : "Methodology",
      content: isZh
        ? "基于树的推理结合置信度剪枝。结合监督微调和强化学习来学习分解策略。"
        : "Tree-based reasoning with confidence-based pruning. Combines supervised fine-tuning with RL for learning decomposition.",
      status: "complete",
    },
    {
      title: isZh ? "局限性" : "Limitations",
      content: isZh
        ? "• 树构建增加了计算成本\n• 需要训练数据来学习分解\n• 可能无法泛化到所有推理领域"
        : "• Increased computational cost for tree construction\n• Requires training data for decomposition learning\n• May not generalize to all reasoning domains",
      status: "pending",
    },
  ];

  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          {t("reading.analysis.automatedAnalysis")}
        </h3>
        <Button size="sm" className="bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 border-0">
          <Brain className="h-4 w-4 mr-1" />
          {t("reading.analysis.runAnalysis")}
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
