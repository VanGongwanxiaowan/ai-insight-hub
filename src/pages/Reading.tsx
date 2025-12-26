import { useState, useCallback, createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PdfViewer } from "@/components/reading/PdfViewer";
import { KnowledgeAssistant } from "@/components/reading/KnowledgeAssistant";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

// Context for sharing selected text between panels
interface ReadingContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  sendToChat: (text: string, action: "explain" | "summarize") => void;
  addToNotes: (text: string) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  notes: string;
  setNotes: (notes: string) => void;
  highlights: Highlight[];
  addHighlight: (highlight: Highlight) => void;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  thinkingSteps?: string[];
}

export interface Highlight {
  id: string;
  text: string;
  color: string;
  note?: string;
  timestamp: Date;
}

const ReadingContext = createContext<ReadingContextType | null>(null);

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("useReading must be used within ReadingProvider");
  return context;
};

// Mock paper data
const mockPaper = {
  id: "2412.14523",
  title: "ReasonAgent: Enhancing Multi-Step Reasoning in Large Language Models via Hierarchical Thought Decomposition",
  authors: ["Sarah Chen", "Marcus Wei", "James Rodriguez", "Emily Park"],
  abstract: "We introduce ReasonAgent, a novel framework that decomposes complex reasoning tasks into hierarchical thought structures...",
};

export default function Reading() {
  const { id } = useParams();
  const [selectedText, setSelectedText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notes, setNotes] = useState("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeTab, setActiveTab] = useState("chat");

  const sendToChat = useCallback((text: string, action: "explain" | "summarize") => {
    const prompt = action === "explain" 
      ? `Please explain the following text from the paper:\n\n"${text}"`
      : `Please summarize the following text:\n\n"${text}"`;
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setActiveTab("chat");
    
    // Simulate AI thinking
    setTimeout(() => {
      const thinkingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isThinking: true,
        thinkingSteps: [
          "Analyzing selected text...",
          "Searching paper context...",
          "Cross-referencing with abstract...",
          "Generating explanation...",
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
            content: action === "explain"
              ? `This passage describes the core mechanism of the paper. The key concept here is the "hierarchical thought decomposition" approach, which breaks down complex reasoning into manageable sub-problems.\n\nIn simpler terms: Instead of trying to solve a hard problem all at once, the model creates a tree-like structure where each branch represents a smaller, more focused task. This is similar to how humans naturally break down complex problems.`
              : `**Summary:** The selected text introduces the main contribution—a hierarchical approach to reasoning that improves LLM performance on multi-step problems by ~23% over baseline methods.`,
            timestamp: new Date(),
          };
          return [...filtered, response];
        });
      }, 2000);
    }, 500);
  }, []);

  const addToNotes = useCallback((text: string) => {
    const highlight: Highlight = {
      id: crypto.randomUUID(),
      text,
      color: "#22d3ee",
      timestamp: new Date(),
    };
    setHighlights((prev) => [...prev, highlight]);
    setNotes((prev) => prev + `\n\n> ${text}\n\n`);
    setActiveTab("notes");
  }, []);

  const addHighlight = useCallback((highlight: Highlight) => {
    setHighlights((prev) => [...prev, highlight]);
  }, []);

  return (
    <ReadingContext.Provider
      value={{
        selectedText,
        setSelectedText,
        sendToChat,
        addToNotes,
        chatMessages,
        setChatMessages,
        notes,
        setNotes,
        highlights,
        addHighlight,
      }}
    >
      <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm font-medium text-foreground truncate max-w-xl">
                {mockPaper.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                arXiv:{id} • {mockPaper.authors.slice(0, 3).join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Resizable Split Pane */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={55} minSize={30}>
            <PdfViewer />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-border hover:bg-primary/20 transition-colors" />
          <ResizablePanel defaultSize={45} minSize={25}>
            <KnowledgeAssistant activeTab={activeTab} onTabChange={setActiveTab} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ReadingContext.Provider>
  );
}
