import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  BookOpen,
  Brain,
  Sparkles,
  FileOutput,
  MessageSquare,
} from "lucide-react";

type AgentStatus = "idle" | "working" | "complete" | "error";

interface AgentState {
  id: string;
  name: string;
  status: AgentStatus;
}

interface AgentGraphProps {
  agents: AgentState[];
  isRunning: boolean;
}

const agentIcons: Record<string, typeof Search> = {
  input: MessageSquare,
  search: Search,
  reading: BookOpen,
  analysis: Brain,
  synthesis: Sparkles,
  output: FileOutput,
};

const agentPositions = [
  { x: 50, y: 40 },
  { x: 150, y: 80 },
  { x: 250, y: 40 },
  { x: 350, y: 80 },
  { x: 450, y: 40 },
  { x: 550, y: 80 },
];

const edges = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
];

export function AgentGraph({ agents, isRunning }: AgentGraphProps) {
  const { t } = useTranslation();

  const statusColors = useMemo(() => ({
    idle: {
      bg: "bg-secondary",
      border: "border-border",
      text: "text-muted-foreground",
      glow: "",
    },
    working: {
      bg: "bg-neon-green/20",
      border: "border-neon-green",
      text: "text-neon-green",
      glow: "shadow-[0_0_20px_hsl(var(--neon-green)/0.4)]",
    },
    complete: {
      bg: "bg-primary/20",
      border: "border-primary",
      text: "text-primary",
      glow: "",
    },
    error: {
      bg: "bg-destructive/20",
      border: "border-destructive",
      text: "text-destructive",
      glow: "",
    },
  }), []);

  return (
    <div className="relative h-[280px] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.03),transparent_70%)]" />
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* SVG for Edges */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 160">
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--neon-green))" stopOpacity="0.5" />
            <stop offset="50%" stopColor="hsl(var(--neon-green))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--neon-green))" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {edges.map((edge, i) => {
          const from = agentPositions[edge.from];
          const to = agentPositions[edge.to];
          const fromAgent = agents[edge.from];
          const toAgent = agents[edge.to];
          const isActive = fromAgent?.status === "complete" || toAgent?.status === "working";
          
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 + 15;
          
          return (
            <g key={i}>
              <path
                d={`M ${from.x + 30} ${from.y + 25} Q ${midX} ${midY} ${to.x - 10} ${to.y + 25}`}
                fill="none"
                stroke={isActive ? "url(#active-gradient)" : "url(#edge-gradient)"}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? "none" : "5,5"}
                className={cn(
                  "transition-all duration-500",
                  isActive && "animate-pulse"
                )}
              />
              {isActive && (
                <circle r="4" fill="hsl(var(--neon-green))">
                  <animateMotion
                    dur="1s"
                    repeatCount="indefinite"
                    path={`M ${from.x + 30} ${from.y + 25} Q ${midX} ${midY} ${to.x - 10} ${to.y + 25}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Agent Nodes */}
      <div className="absolute inset-0">
        {agents.map((agent, i) => {
          const pos = agentPositions[i];
          const Icon = agentIcons[agent.id] || Brain;
          const colors = statusColors[agent.status];

          return (
            <div
              key={agent.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(pos.x / 600) * 100}%`, top: `${(pos.y / 160) * 100 + 20}%` }}
            >
              <div
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
                  colors.bg,
                  colors.border,
                  colors.glow,
                  agent.status === "working" && "animate-pulse"
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    colors.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                <span className={cn("text-xs font-medium whitespace-nowrap", colors.text)}>
                  {agent.name}
                </span>
                
                <div
                  className={cn(
                    "absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-card",
                    agent.status === "idle" && "bg-muted-foreground",
                    agent.status === "working" && "bg-neon-green animate-ping",
                    agent.status === "complete" && "bg-primary",
                    agent.status === "error" && "bg-destructive"
                  )}
                />
                {agent.status === "working" && (
                  <div
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-neon-green"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">{t("agentLab.status.idle")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-muted-foreground">{t("agentLab.status.working")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-muted-foreground">{t("agentLab.status.complete")}</span>
        </div>
      </div>
    </div>
  );
}
