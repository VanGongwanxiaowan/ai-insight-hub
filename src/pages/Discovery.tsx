import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
  ArrowRight,
  Star,
} from "lucide-react";

const trendingTopics = [
  { name: "RL", color: "bg-neon-green/20 text-neon-green border-neon-green/30" },
  { name: "GenAI", color: "bg-neon-purple/20 text-neon-purple border-neon-purple/30" },
  { name: "LLM", color: "bg-neon-blue/20 text-neon-blue border-neon-blue/30" },
  { name: "Diffusion", color: "bg-neon-pink/20 text-neon-pink border-neon-pink/30" },
  { name: "Transformers", color: "bg-neon-orange/20 text-neon-orange border-neon-orange/30" },
];

const featuredPapers = [
  {
    title: "Attention Is All You Need: Revisiting Transformer Architectures for 2024",
    authors: "A. Smith, B. Johnson, C. Williams",
    date: "Dec 2024",
    citations: 1234,
    tags: ["Transformers", "LLM"],
  },
  {
    title: "Scaling Laws for Neural Language Models: New Frontiers",
    authors: "D. Brown, E. Davis",
    date: "Dec 2024",
    citations: 892,
    tags: ["GenAI", "LLM"],
  },
  {
    title: "Reinforcement Learning from Human Feedback: A Comprehensive Survey",
    authors: "F. Miller, G. Wilson",
    date: "Nov 2024",
    citations: 567,
    tags: ["RL", "GenAI"],
  },
];

export default function Discovery() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-neon-purple/5 border border-border p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Research</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Discover Breakthrough Research
          </h1>
          <p className="text-muted-foreground max-w-xl mb-6">
            Explore the latest AI and ML papers, powered by intelligent summarization
            and personalized recommendations.
          </p>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Badge
                key={topic.name}
                variant="outline"
                className={`${topic.color} border cursor-pointer hover:scale-105 transition-transform`}
              >
                {topic.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: "Papers Read", value: "247" },
          { icon: Clock, label: "Hours Saved", value: "89" },
          { icon: TrendingUp, label: "Trending Topics", value: "12" },
          { icon: Star, label: "Saved Papers", value: "56" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Papers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Featured Papers</h2>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-4">
          {featuredPapers.map((paper, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/30 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paper.authors}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-muted-foreground">{paper.date}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{paper.citations} citations</span>
                      <div className="flex gap-1.5 ml-2">
                        {paper.tags.map((tag) => {
                          const topicStyle = trendingTopics.find(t => t.name === tag);
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`text-xs ${topicStyle?.color || 'bg-secondary text-secondary-foreground'}`}
                            >
                              {tag}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Summarize
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
