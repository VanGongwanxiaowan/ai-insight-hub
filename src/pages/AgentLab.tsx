import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type AgentStatus = "idle" | "working" | "complete" | "error";

interface AgentState {
  id: string;
  name: string;
  status: AgentStatus;
  progress?: number;
}

export default function AgentLab() {
  const { t, i18n } = useTranslation();

  const getInitialAgents = (): AgentState[] => [
    { id: "input", name: t("agentLab.agents.taskInput"), status: "idle" },
    { id: "search", name: t("agentLab.agents.searchAgent"), status: "idle" },
    { id: "reading", name: t("agentLab.agents.readingAgent"), status: "idle" },
    { id: "analysis", name: t("agentLab.agents.analysisAgent"), status: "idle" },
    { id: "synthesis", name: t("agentLab.agents.synthesisAgent"), status: "idle" },
    { id: "output", name: t("agentLab.agents.reportOutput"), status: "idle" },
  ];

  const [taskInput, setTaskInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<AgentState[]>(getInitialAgents());
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
    const isZh = i18n.language === 'zh';
    setIsRunning(true);
    setLogs([]);
    setResult(null);
    setAgents(getInitialAgents());

    const agentNames = {
      input: isZh ? "任务输入" : "Task Input",
      search: isZh ? "搜索智能体" : "Search Agent",
      reading: isZh ? "阅读智能体" : "Reading Agent",
      analysis: isZh ? "分析智能体" : "Analysis Agent",
      synthesis: isZh ? "综合智能体" : "Synthesis Agent",
      output: isZh ? "报告输出" : "Report Output",
      system: isZh ? "系统" : "System",
    };

    // Task Input
    updateAgentStatus("input", "working");
    addLog(agentNames.input, isZh ? `收到研究任务: ${taskInput.slice(0, 50)}...` : `Received research task: ${taskInput.slice(0, 50)}...`, "info");
    await new Promise((r) => setTimeout(r, 800));
    updateAgentStatus("input", "complete");
    addLog(agentNames.input, isZh ? "任务解析完成，准备处理" : "Task parsed and ready for processing", "success");

    // Search Agent
    updateAgentStatus("search", "working");
    addLog(agentNames.search, isZh ? "正在初始化学术数据库搜索..." : "Initializing search across academic databases...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog(agentNames.search, isZh ? "正在查询 arXiv 相关论文..." : "Querying arXiv for relevant papers...", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog(agentNames.search, isZh ? "找到 12 篇潜在相关论文" : "Found 12 potentially relevant papers", "success");
    await new Promise((r) => setTimeout(r, 800));
    addLog(agentNames.search, isZh ? "按相关性评分 > 0.8 过滤..." : "Filtering by relevance score > 0.8...", "info");
    await new Promise((r) => setTimeout(r, 600));
    addLog(agentNames.search, isZh ? "筛选出 5 篇高度相关论文进行分析" : "Selected 5 highly relevant papers for analysis", "success");
    updateAgentStatus("search", "complete");

    // Reading Agent
    updateAgentStatus("reading", "working");
    addLog(agentNames.reading, isZh ? "开始论文分析..." : "Beginning paper analysis...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog(agentNames.reading, isZh ? "处理中: 《大型语言模型的高效微调》" : "Processing: 'Efficient Fine-Tuning of Large Language Models'", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog(agentNames.reading, isZh ? "处理中: 《LoRA: 大型语言模型的低秩适应》" : "Processing: 'LoRA: Low-Rank Adaptation of LLMs'", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog(agentNames.reading, isZh ? "处理中: 《QLoRA: 量化大型语言模型的高效微调》" : "Processing: 'QLoRA: Efficient Finetuning of Quantized LLMs'", "info");
    await new Promise((r) => setTimeout(r, 800));
    addLog(agentNames.reading, isZh ? "从 5 篇论文中提取了关键发现" : "Extracted key findings from 5 papers", "success");
    updateAgentStatus("reading", "complete");

    // Analysis Agent
    updateAgentStatus("analysis", "working");
    addLog(agentNames.analysis, isZh ? "正在比较各论文的方法论..." : "Comparing methodologies across papers...", "info");
    await new Promise((r) => setTimeout(r, 1500));
    addLog(agentNames.analysis, isZh ? "识别微调方法的共同模式" : "Identifying common patterns in fine-tuning approaches", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog(agentNames.analysis, isZh ? "构建比较矩阵..." : "Building comparison matrix...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog(agentNames.analysis, isZh ? "分析完成: 识别出 8 个关键差异点" : "Analysis complete: 8 key differentiators identified", "success");
    updateAgentStatus("analysis", "complete");

    // Synthesis Agent
    updateAgentStatus("synthesis", "working");
    addLog(agentNames.synthesis, isZh ? "正在将发现综合为连贯报告..." : "Synthesizing findings into coherent report...", "info");
    await new Promise((r) => setTimeout(r, 1500));
    addLog(agentNames.synthesis, isZh ? "生成执行摘要..." : "Generating executive summary...", "info");
    await new Promise((r) => setTimeout(r, 1200));
    addLog(agentNames.synthesis, isZh ? "添加方法论比较表格..." : "Adding methodology comparison table...", "info");
    await new Promise((r) => setTimeout(r, 1000));
    addLog(agentNames.synthesis, isZh ? "格式化引用和参考文献..." : "Formatting citations and references...", "info");
    await new Promise((r) => setTimeout(r, 800));
    addLog(agentNames.synthesis, isZh ? "报告综合完成" : "Report synthesis complete", "success");
    updateAgentStatus("synthesis", "complete");

    // Output
    updateAgentStatus("output", "working");
    addLog(agentNames.output, isZh ? "正在完成研究报告..." : "Finalizing research report...", "info");
    await new Promise((r) => setTimeout(r, 800));
    updateAgentStatus("output", "complete");
    addLog(agentNames.output, isZh ? "研究报告已准备好供审阅" : "Research report ready for review", "success");

    // Set result based on language
    if (isZh) {
      setResult(`# 微调方法对比: Llama 3 vs Mistral

## 执行摘要

本研究报告比较了 Llama 3 和 Mistral 大型语言模型的微调方法，分析了它们的方法、效率和实际应用。

## 主要发现

### 1. 架构差异

**Llama 3:**
- 使用分组查询注意力 (GQA) 以提高效率
- 支持最高 8K tokens 的上下文长度
- 针对指令遵循任务进行优化

**Mistral:**
- 实现滑动窗口注意力 (SWA)
- 原生支持 32K 上下文长度
- 在推理任务上表现出色

### 2. 微调方法

| 方法 | Llama 3 支持 | Mistral 支持 | 内存效率 |
|------|-------------|-------------|---------|
| 全量微调 | ✓ | ✓ | 低 |
| LoRA | ✓ | ✓ | 高 |
| QLoRA | ✓ | ✓ | 很高 |
| 适配器微调 | ✓ | 有限 | 高 |

### 3. 推荐方法

**对于 Llama 3:**
- 在内存受限环境中使用 QLoRA
- 全量微调在领域特定任务上效果最佳
- LoRA 推荐秩: 16-64

**对于 Mistral:**
- 使用较低秩 (8-16) 的 LoRA 即可获得优秀效果
- 滑动窗口注意力在微调时需要特殊处理
- 对于长上下文考虑使用梯度检查点

## 结论

两个模型都提供了强大的微调能力，但选择取决于您的具体用例。Llama 3 在指令遵循场景中表现出色，而 Mistral 开箱即用提供更好的长上下文性能。

---
*报告由 AI 研究智能体生成 • 分析了 5 篇论文 • 搜索了 3 个数据库*`);
    } else {
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
    }

    setActiveTab("result");
    setIsRunning(false);
  }, [taskInput, addLog, updateAgentStatus, i18n.language, t]);

  const handleRun = () => {
    if (!taskInput.trim()) return;
    simulateExecution();
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog(i18n.language === 'zh' ? "系统" : "System", i18n.language === 'zh' ? "用户停止了执行" : "Execution stopped by user", "warning");
  };

  const handleReset = () => {
    setIsRunning(false);
    setAgents(getInitialAgents());
    setLogs([]);
    setResult(null);
    setTaskInput("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("agentLab.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("agentLab.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button
              onClick={handleRun}
              disabled={!taskInput.trim()}
              className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30"
            >
              <Play className="h-4 w-4 mr-2" />
              {t("agentLab.runAgents")}
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              className="bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30"
            >
              <Square className="h-4 w-4 mr-2" />
              {t("agentLab.stop")}
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("agentLab.reset")}
          </Button>
        </div>
      </div>

      {/* Task Input */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("agentLab.task.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder={t("agentLab.task.placeholder")}
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
              {t("agentLab.pipeline.title")}
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
                  {t("agentLab.tabs.executionLog")}
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="flex-1 data-[state=active]:bg-neon-green/20 data-[state=active]:text-neon-green"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {t("agentLab.tabs.result")}
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
