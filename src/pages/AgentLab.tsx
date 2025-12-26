import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Square,
  RotateCcw,
  Sparkles,
  FileText,
  Terminal,
  Network,
} from "lucide-react";
import { AgentGraph } from "@/components/agent-lab/AgentGraph";
import { ExecutionLog, LogEntry } from "@/components/agent-lab/ExecutionLog";
import { ResultView } from "@/components/agent-lab/ResultView";
import { cn } from "@/lib/utils";

type AgentStatus = "idle" | "working" | "complete" | "error";

interface AgentState {
  id: string;
  name: string;
  status: AgentStatus;
  progress?: number;
}

const initialAgents: AgentState[] = [
  { id: "input", name: "Task Input", status: "idle" },
  { id: "search", name: "Search Agent", status: "idle" },
  { id: "reading", name: "Reading Agent", status: "idle" },
  { id: "analysis", name: "Analysis Agent", status: "idle" },
  { id: "synthesis", name: "Synthesis Agent", status: "idle" },
  { id: "output", name: "Report Output", status: "idle" },
];

export default function AgentLab() {
  const [taskInput, setTaskInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("graph");

  const addLog = useCallback((agent: string, message: string, type: LogEntry["type"] = "info") => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      agent,
      message,
      type,
    };
    setLogs((prev) => [...prev, entry]);
  }, []);

  const updateAgentStatus = useCallback((id: string, status: AgentStatus) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, status } : agent))
    );
  }, []);

  const simulateExecution = useCallback(async () => {
    setIsRunning(true);
    setLogs([]);
    setResult(null);
    setAgents(initialAgents);

    // Task Input
    updateAgentStatus("input", "working");
    addLog("Task Input", "Received research task: " + taskInput.slice(0, 50) + "...", "info");
    await new Promise((r) => setTimeout(r, 800));
    updateAgentStatus("input", "complete");
    addLog("Task Input", "Task parsed and ready for processing", "success");

    // Search Agent
    updateAgentStatus("search", "working");
    addLog("Search Agent", "Initializing search across academic databases...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Search Agent", "Querying arXiv for relevant papers...", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog("Search Agent", "Found 12 potentially relevant papers", "success");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Search Agent", "Filtering by relevance score > 0.8...", "info");
    await new Promise((r) => setTimeout(r, 600));
    addLog("Search Agent", "Selected 5 highly relevant papers for analysis", "success");
    updateAgentStatus("search", "complete");

    // Reading Agent
    updateAgentStatus("reading", "working");
    addLog("Reading Agent", "Beginning paper analysis...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Reading Agent", "Processing: 'Efficient Fine-Tuning of Large Language Models'", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog("Reading Agent", "Processing: 'LoRA: Low-Rank Adaptation of LLMs'", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Reading Agent", "Processing: 'QLoRA: Efficient Finetuning of Quantized LLMs'", "info");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Reading Agent", "Extracted key findings from 5 papers", "success");
    updateAgentStatus("reading", "complete");

    // Analysis Agent
    updateAgentStatus("analysis", "working");
    addLog("Analysis Agent", "Comparing methodologies across papers...", "info");
    await new Promise((r) => setTimeout(r, 1500));
    addLog("Analysis Agent", "Identifying common patterns in fine-tuning approaches", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog("Analysis Agent", "Building comparison matrix...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Analysis Agent", "Analysis complete: 8 key differentiators identified", "success");
    updateAgentStatus("analysis", "complete");

    // Synthesis Agent
    updateAgentStatus("synthesis", "working");
    addLog("Synthesis Agent", "Synthesizing findings into coherent report...", "info");
    await new Promise((r) => setTimeout(r, 1500));
    addLog("Synthesis Agent", "Generating executive summary...", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog("Synthesis Agent", "Adding methodology comparison table...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Synthesis Agent", "Formatting citations and references...", "info");
    await new Promise((r) => setTimeout(r, 800));
    addLog("Synthesis Agent", "Report synthesis complete", "success");
    updateAgentStatus("synthesis", "complete");

    // Output
    updateAgentStatus("output", "working");
    addLog("Report Output", "Finalizing research report...", "info");
    await new Promise((r) => setTimeout(r, 800));
    updateAgentStatus("output", "complete");
    addLog("Report Output", "Research report ready for review", "success");

    // Set result
    setResult(`# Fine-Tuning Methods Comparison: Llama 3 vs Mistral

## Executive Summary

This research report compares the fine-tuning methodologies for Llama 3 and Mistral large language models, analyzing their approaches, efficiency, and practical implications.

## Key Findings

### 1. Architecture Differences

**Llama 3:**
- Uses grouped-query attention (GQA) for improved efficiency
- Supports context lengths up to 8K tokens
- Optimized for instruction-following tasks

**Mistral:**
- Implements sliding window attention (SWA)
- Native support for 32K context length
- Strong performance on reasoning tasks

### 2. Fine-Tuning Approaches

| Method | Llama 3 Support | Mistral Support | Memory Efficiency |
|--------|-----------------|-----------------|-------------------|
| Full Fine-Tuning | ✓ | ✓ | Low |
| LoRA | ✓ | ✓ | High |
| QLoRA | ✓ | ✓ | Very High |
| Adapter Tuning | ✓ | Limited | High |

### 3. Recommended Approaches

**For Llama 3:**
- Use QLoRA for memory-constrained environments
- Full fine-tuning yields best results for domain-specific tasks
- Recommended rank: 16-64 for LoRA

**For Mistral:**
- Excellent results with LoRA at lower ranks (8-16)
- Sliding window attention requires special handling during fine-tuning
- Consider gradient checkpointing for longer contexts

## Conclusion

Both models offer robust fine-tuning capabilities, but the choice depends on your specific use case. Llama 3 excels in instruction-following scenarios, while Mistral provides better long-context performance out of the box.

---
*Report generated by AI Research Agents • 5 papers analyzed • 3 databases searched*`);

    setActiveTab("result");
    setIsRunning(false);
  }, [taskInput, addLog, updateAgentStatus]);

  const handleRun = () => {
    if (!taskInput.trim()) return;
    simulateExecution();
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog("System", "Execution stopped by user", "warning");
  };

  const handleReset = () => {
    setIsRunning(false);
    setAgents(initialAgents);
    setLogs([]);
    setResult(null);
    setTaskInput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agent Workbench</h1>
          <p className="text-muted-foreground mt-1">
            Assign complex research tasks to a team of AI agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button
              onClick={handleRun}
              disabled={!taskInput.trim()}
              className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Agents
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              className="bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Task Input */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Research Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="What do you want to research? (e.g., 'Compare the fine-tuning methods of Llama 3 and Mistral')"
            className="min-h-[100px] bg-secondary/50 border-border focus:border-primary resize-none"
            disabled={isRunning}
          />
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agent Visualization */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Network className="h-4 w-4 text-neon-purple" />
              Agent Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AgentGraph agents={agents} isRunning={isRunning} />
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Card className="bg-card border-border lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-0">
              <TabsList className="w-full bg-secondary/50 p-1">
                <TabsTrigger
                  value="graph"
                  className="flex-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Execution Log
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="flex-1 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Result
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0">
              <TabsContent value="graph" className="m-0">
                <ExecutionLog logs={logs} />
              </TabsContent>
              <TabsContent value="result" className="m-0">
                <ResultView result={result} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
