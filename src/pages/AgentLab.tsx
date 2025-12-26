import { FlaskConical, Bot, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const agents = [
  {
    name: "Paper Summarizer",
    description: "Get instant, comprehensive summaries of research papers",
    icon: MessageSquare,
    status: "active",
  },
  {
    name: "Citation Finder",
    description: "Discover related papers and build citation networks",
    icon: Zap,
    status: "active",
  },
  {
    name: "Research Assistant",
    description: "Ask questions about papers in natural language",
    icon: Bot,
    status: "coming",
  },
];

export default function AgentLab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Lab</h1>
        <p className="text-muted-foreground mt-1">AI-powered tools to accelerate your research</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <Card
            key={agent.name}
            className="bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <agent.icon className="h-5 w-5 text-primary" />
                </div>
                {agent.status === "coming" && (
                  <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                    Coming Soon
                  </span>
                )}
              </div>
              <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                {agent.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{agent.description}</p>
              {agent.status === "active" && (
                <Button
                  size="sm"
                  className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Launch Agent
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
