import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface LogEntry {
  id: string;
  timestamp: Date;
  agent: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface ExecutionLogProps {
  logs: LogEntry[];
}

const agentColors: Record<string, string> = {
  "Task Input": "text-primary",
  "Search Agent": "text-neon-blue",
  "Reading Agent": "text-neon-purple",
  "Analysis Agent": "text-neon-orange",
  "Synthesis Agent": "text-neon-pink",
  "Report Output": "text-neon-green",
  "System": "text-muted-foreground",
};

export function ExecutionLog({ logs }: ExecutionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="h-[300px] bg-background/50 border-t border-border">
      <ScrollArea ref={scrollRef} className="h-full">
        <div className="p-4 font-mono text-sm space-y-1">
          {logs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground py-20">
              <div className="text-center">
                <p className="text-sm">Waiting for execution...</p>
                <p className="text-xs mt-1 opacity-60">Run agents to see logs here</p>
              </div>
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={log.id}
                className="flex gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="text-muted-foreground/60 flex-shrink-0">
                  {formatTime(log.timestamp)}
                </span>
                <span
                  className={cn(
                    "flex-shrink-0 min-w-[120px]",
                    agentColors[log.agent] || "text-foreground"
                  )}
                >
                  [{log.agent}]
                </span>
                <span
                  className={cn(
                    "flex-1",
                    log.type === "success" && "text-neon-green",
                    log.type === "warning" && "text-neon-orange",
                    log.type === "error" && "text-destructive",
                    log.type === "info" && "text-foreground/80"
                  )}
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
          {logs.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground/60 pt-2">
              <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
              <span className="text-xs">Ready for input</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
