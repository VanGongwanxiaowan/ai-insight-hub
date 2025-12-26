import { useState, useRef, useEffect } from "react";
import { useReading } from "@/pages/Reading";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Lightbulb,
  FileText,
  StickyNote,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock PDF content (simulated pages)
const mockPdfContent = [
  {
    page: 1,
    content: `
# ReasonAgent: Enhancing Multi-Step Reasoning in Large Language Models via Hierarchical Thought Decomposition

**Sarah Chen¹, Marcus Wei², James Rodriguez¹, Emily Park³**

¹Stanford University, ²MIT, ³Google DeepMind

## Abstract

We introduce ReasonAgent, a novel framework that decomposes complex reasoning tasks into hierarchical thought structures. Our approach leverages a tree-based decomposition strategy that enables LLMs to tackle multi-step problems by breaking them into manageable sub-tasks. Experiments on GSM8K, MATH, and custom benchmarks show a 23% improvement over chain-of-thought prompting.

The key insight is that human reasoning naturally follows a hierarchical pattern, where high-level goals are recursively decomposed into subgoals until atomic actions are reached. ReasonAgent mimics this process by constructing a dynamic thought tree during inference.

## 1. Introduction

Large Language Models (LLMs) have demonstrated remarkable capabilities across diverse tasks, from text generation to code synthesis. However, complex multi-step reasoning remains challenging, particularly for problems requiring:

1. **Compositional reasoning** - combining multiple inference steps
2. **Backtracking** - revising earlier conclusions based on new information
3. **Abstraction** - operating at multiple levels of granularity

Chain-of-thought (CoT) prompting has emerged as a powerful technique, but it operates sequentially and lacks mechanisms for structured exploration of the solution space.
    `,
  },
  {
    page: 2,
    content: `
## 2. Related Work

### 2.1 Chain-of-Thought Prompting

Wei et al. (2022) introduced chain-of-thought prompting, demonstrating that LLMs can perform complex reasoning when prompted to generate intermediate steps. Subsequent work has explored variations including:

- **Zero-shot CoT** (Kojima et al., 2022): Using "Let's think step by step"
- **Self-Consistency** (Wang et al., 2023): Sampling multiple reasoning paths
- **Tree of Thoughts** (Yao et al., 2023): Structured exploration with backtracking

### 2.2 Hierarchical Planning

Our work builds on classical AI planning techniques, particularly Hierarchical Task Networks (HTNs). The key difference is that ReasonAgent learns to decompose dynamically rather than relying on predefined task hierarchies.

## 3. Method

### 3.1 Thought Tree Construction

Given a problem P, ReasonAgent constructs a thought tree T where:
- The root node represents the original problem
- Internal nodes represent subproblems
- Leaf nodes represent atomic reasoning steps

The decomposition function D: P → {P₁, P₂, ..., Pₖ} is learned through a combination of supervised fine-tuning and reinforcement learning.

### 3.2 Dynamic Expansion

Unlike static approaches, our tree expands dynamically based on:
1. Problem complexity estimation
2. Confidence scores from intermediate results
3. Resource constraints (compute budget)
    `,
  },
  {
    page: 3,
    content: `
## 4. Experiments

### 4.1 Datasets

We evaluate on three benchmark datasets:

| Dataset | Size | Task Type | Difficulty |
|---------|------|-----------|------------|
| GSM8K | 8,500 | Math Word Problems | Medium |
| MATH | 12,500 | Competition Math | Hard |
| ReasonBench | 5,000 | Multi-domain | Variable |

### 4.2 Results

Our main results demonstrate consistent improvements across all benchmarks:

**Table 1: Accuracy comparison (%)**

| Method | GSM8K | MATH | ReasonBench |
|--------|-------|------|-------------|
| Zero-shot | 45.2 | 12.3 | 38.7 |
| CoT | 67.8 | 28.5 | 52.4 |
| Self-Consistency | 72.1 | 31.2 | 58.9 |
| Tree of Thoughts | 74.5 | 33.8 | 61.2 |
| **ReasonAgent** | **83.4** | **41.6** | **75.3** |

ReasonAgent achieves state-of-the-art results, with particularly strong improvements on complex multi-step problems.

### 4.3 Ablation Studies

We analyze the contribution of each component:
- Hierarchical decomposition: +12.3%
- Dynamic expansion: +5.8%
- Confidence-based pruning: +4.9%
    `,
  },
];

export function PdfViewer() {
  const { sendToChat, addToNotes } = useReading();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [selectedText, setSelectedText] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalPages = mockPdfContent.length;

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      setSelectedText(text);
      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = contentRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        setMenuPosition({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 10,
        });
        setShowMenu(true);
      }
    }
  };

  const handleAction = (action: "explain" | "summarize" | "save") => {
    if (action === "explain" || action === "summarize") {
      sendToChat(selectedText, action);
    } else if (action === "save") {
      addToNotes(selectedText);
    }
    setShowMenu(false);
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[80px] text-center">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-[50px] text-center">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-8 relative"
        onMouseUp={handleTextSelection}
      >
        <div
          className="max-w-3xl mx-auto bg-card rounded-lg border border-border p-8 shadow-lg"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          <div className="prose prose-invert prose-sm max-w-none">
            <div
              className="whitespace-pre-wrap font-serif leading-relaxed text-foreground/90 selection:bg-primary/30"
              dangerouslySetInnerHTML={{
                __html: mockPdfContent[currentPage - 1].content
                  .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4 text-foreground">$1</h1>')
                  .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-foreground">$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mt-4 mb-2 text-foreground">$1</h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                  .replace(/^\d\. \*\*(.+?)\*\*/gm, '<li class="mb-1"><strong>$1</strong></li>')
                  .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
                  .replace(/\|(.+)\|/g, '<span class="font-mono text-sm">$1</span>')
              }}
            />
          </div>
        </div>

        {/* Floating Context Menu */}
        {showMenu && menuPosition && (
          <div
            className="absolute z-50 animate-fade-in"
            style={{
              left: menuPosition.x,
              top: menuPosition.y,
              transform: "translate(-50%, -100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1 bg-popover border border-border rounded-lg shadow-xl p-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("explain")}
                className="h-8 px-3 text-xs hover:bg-primary/20 hover:text-primary"
              >
                <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                Explain
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("summarize")}
                className="h-8 px-3 text-xs hover:bg-neon-purple/20 hover:text-neon-purple"
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Summarize
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("save")}
                className="h-8 px-3 text-xs hover:bg-neon-green/20 hover:text-neon-green"
              >
                <StickyNote className="h-3.5 w-3.5 mr-1.5" />
                Save to Notes
              </Button>
            </div>
            <div className="w-3 h-3 bg-popover border-b border-r border-border rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5" />
          </div>
        )}
      </div>
    </div>
  );
}
