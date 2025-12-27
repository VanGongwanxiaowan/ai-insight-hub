import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  BookOpen,
  ExternalLink,
  Bookmark,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

// Mock data for today's papers
const todaysPapers = [
  {
    id: 1,
    title: "ReasonAgent: Enhancing Multi-Step Reasoning in Large Language Models via Hierarchical Thought Decomposition",
    authors: ["Sarah Chen", "Marcus Wei", "James Rodriguez", "Emily Park"],
    abstract: "We introduce ReasonAgent, a novel framework that decomposes complex reasoning tasks into hierarchical thought structures. Our approach leverages a tree-based decomposition strategy that enables LLMs to tackle multi-step problems by breaking them into manageable sub-tasks. Experiments on GSM8K, MATH, and custom benchmarks show a 23% improvement over chain-of-thought prompting.",
    categories: ["reasoning", "llm", "agents"],
    arxivId: "2412.14523",
    publishedToday: true,
  },
  {
    id: 2,
    title: "DiffusionRL: Unifying Diffusion Models and Reinforcement Learning for Continuous Control",
    authors: ["David Kim", "Lisa Zhang", "Robert Chen"],
    abstract: "This paper presents DiffusionRL, a unified framework that combines the generative capabilities of diffusion models with reinforcement learning objectives. By treating policy optimization as a conditional generation problem, we achieve state-of-the-art performance on MuJoCo locomotion tasks while maintaining stable training dynamics and improved sample efficiency.",
    categories: ["rl", "imageGen"],
    arxivId: "2412.14489",
    publishedToday: true,
  },
  {
    id: 3,
    title: "VideoGen-X: Temporally Consistent Video Generation with Cross-Frame Attention Mechanisms",
    authors: ["Anna Liu", "Michael Brown", "Jennifer Wu", "Alex Thompson"],
    abstract: "We present VideoGen-X, a transformer-based architecture for generating high-quality, temporally consistent videos. Our key innovation is a cross-frame attention mechanism that maintains object coherence across frames while allowing for dynamic scene changes. The model achieves 94.3 FVD on UCF-101 and demonstrates unprecedented consistency in human evaluations.",
    categories: ["videoGen", "imageGen"],
    arxivId: "2412.14456",
    publishedToday: true,
  },
  {
    id: 4,
    title: "AgentBench 2.0: A Comprehensive Benchmark for Evaluating Autonomous AI Agents in Real-World Tasks",
    authors: ["Kevin Wang", "Sophie Martin", "Chris Lee"],
    abstract: "AgentBench 2.0 extends the original benchmark with 15 new task categories spanning web navigation, code generation, scientific research, and multi-agent collaboration. We evaluate 20+ state-of-the-art agents and find that while performance has improved significantly, agents still struggle with long-horizon planning and error recovery in complex environments.",
    categories: ["agents", "llm"],
    arxivId: "2412.14412",
    publishedToday: true,
  },
  {
    id: 5,
    title: "LoRA-XL: Scalable Low-Rank Adaptation for Trillion-Parameter Models",
    authors: ["Thomas Anderson", "Maria Garcia", "Paul Wilson"],
    abstract: "We introduce LoRA-XL, an extension of Low-Rank Adaptation that scales efficiently to trillion-parameter models. Our method introduces a hierarchical rank allocation strategy that dynamically adjusts adaptation capacity based on layer importance. Results show 40% reduction in memory usage while maintaining 99.1% of full fine-tuning performance.",
    categories: ["llm"],
    arxivId: "2412.14398",
    publishedToday: true,
  },
];

// Classic papers data
const classicPapers = [
  {
    id: 1,
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    citations: "120K+",
    icon: "🏆",
    descriptionKey: "transformer",
  },
  {
    id: 2,
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
    citations: "85K+",
    icon: "📚",
    descriptionKey: "bert",
  },
  {
    id: 3,
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    year: 2020,
    citations: "45K+",
    icon: "🚀",
    descriptionKey: "gpt3",
  },
  {
    id: 4,
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Ho et al."],
    year: 2020,
    citations: "12K+",
    icon: "🎨",
    descriptionKey: "diffusion",
  },
  {
    id: 5,
    title: "Playing Atari with Deep Reinforcement Learning",
    authors: ["Mnih et al."],
    year: 2013,
    citations: "25K+",
    icon: "🎮",
    descriptionKey: "dqn",
  },
  {
    id: 6,
    title: "Proximal Policy Optimization Algorithms",
    authors: ["Schulman et al."],
    year: 2017,
    citations: "18K+",
    icon: "⚡",
    descriptionKey: "ppo",
  },
  {
    id: 7,
    title: "ResNet: Deep Residual Learning",
    authors: ["He et al."],
    year: 2015,
    citations: "180K+",
    icon: "🏗️",
    descriptionKey: "resnet",
  },
];

const classicDescriptions: Record<string, { zh: string; en: string }> = {
  transformer: { zh: "引入 Transformer 架构的开创性论文", en: "The paper that introduced the Transformer architecture" },
  bert: { zh: "革新 NLP 领域的双向编码器表示", en: "Bidirectional encoder representations that revolutionized NLP" },
  gpt3: { zh: "将语言模型扩展到 1750 亿参数", en: "Scaling language models to 175B parameters" },
  diffusion: { zh: "现代图像生成模型的基础", en: "Foundation of modern image generation models" },
  dqn: { zh: "开启深度强化学习革命的 DQN", en: "Deep Q-Networks that started the deep RL revolution" },
  ppo: { zh: "策略梯度方法的首选算法", en: "The go-to algorithm for policy gradient methods" },
  resnet: { zh: "使超深网络训练成为可能的跳跃连接", en: "Skip connections that enabled training very deep networks" },
};

export default function Discovery() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { key: "llm", color: "bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30" },
    { key: "rl", color: "bg-neon-green/20 text-neon-green border-neon-green/30 hover:bg-neon-green/30" },
    { key: "agents", color: "bg-neon-purple/20 text-neon-purple border-neon-purple/30 hover:bg-neon-purple/30" },
    { key: "imageGen", color: "bg-neon-pink/20 text-neon-pink border-neon-pink/30 hover:bg-neon-pink/30" },
    { key: "videoGen", color: "bg-neon-orange/20 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/30" },
    { key: "reasoning", color: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30" },
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const scrollClassicPapers = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getCategoryStyle = (categoryKey: string) => {
    return categories.find((c) => c.key === categoryKey)?.color || "bg-secondary text-secondary-foreground";
  };

  const getCategoryName = (key: string) => {
    const keyMap: Record<string, string> = {
      llm: "categories.llm",
      rl: "categories.rl",
      agents: "categories.agents",
      imageGen: "categories.imageGen",
      videoGen: "categories.videoGen",
      reasoning: "categories.reasoning",
    };
    return t(`discovery.${keyMap[key] || key}`);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Search Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-neon-purple/5 border border-border p-8 md:p-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--neon-purple)/0.08),transparent_40%)]" />
        <div className="absolute top-4 right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t("discovery.hero.badge")}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {t("discovery.hero.title")}
            <span className="text-primary text-glow"> {t("discovery.hero.titleHighlight")}</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            {t("discovery.hero.description")}
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <Select value={searchFilter} onValueChange={setSearchFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-secondary/50 border-border focus:border-primary">
                <SelectValue placeholder={t("discovery.search.filterAll")} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">{t("discovery.search.filterAll")}</SelectItem>
                <SelectItem value="title">{t("discovery.search.filterTitle")}</SelectItem>
                <SelectItem value="author">{t("discovery.search.filterAuthor")}</SelectItem>
                <SelectItem value="institution">{t("discovery.search.filterInstitution")}</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t("discovery.search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-secondary/50 border-border focus:border-primary text-base"
              />
            </div>
            
            <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue">
              <Search className="h-5 w-5 mr-2" />
              {t("discovery.search.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Tag Cloud */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t("discovery.categories.title")}</h2>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategories([])}
              className="text-muted-foreground hover:text-foreground"
            >
              {t("discovery.categories.clearFilters")}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.key}
              variant="outline"
              onClick={() => toggleCategory(category.key)}
              className={cn(
                "cursor-pointer transition-all duration-200 text-sm px-4 py-2 border",
                category.color,
                selectedCategories.includes(category.key) && "ring-2 ring-offset-2 ring-offset-background ring-primary scale-105"
              )}
            >
              {getCategoryName(category.key)}
            </Badge>
          ))}
        </div>
      </section>

      {/* Daily Feed - The Crawler Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t("discovery.dailyFeed.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("discovery.dailyFeed.subtitle")}</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
            {t("common.viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          {todaysPapers.map((paper, index) => (
            <Link key={paper.id} to={`/read/${paper.arxivId}`}>
              <Card
                className="bg-card border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {paper.publishedToday && (
                            <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 text-xs">
                              {t("discovery.dailyFeed.publishedToday")}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground font-mono">
                            arXiv:{paper.arxivId}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {paper.title}
                      </h3>

                      {/* Authors */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Users className="h-4 w-4" />
                        <span>
                          {paper.authors.slice(0, 3).join(", ")}
                          {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                        </span>
                      </div>

                      {/* Abstract */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5">
                        {paper.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="outline"
                            className={cn("text-xs", getCategoryStyle(cat))}
                          >
                            {getCategoryName(cat)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {t("discovery.dailyFeed.summarize")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        {t("common.save")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t("discovery.dailyFeed.open")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Classic Papers Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neon-orange/10 border border-neon-orange/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-neon-orange" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t("discovery.classicPapers.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("discovery.classicPapers.subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollClassicPapers("left")}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollClassicPapers("right")}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link to="/classic-hall">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                {t("common.viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {classicPapers.map((paper) => (
            <Card
              key={paper.id}
              className="flex-shrink-0 w-80 bg-gradient-to-br from-card to-accent/30 border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group snap-start"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{paper.icon}</span>
                  <Badge variant="outline" className="bg-secondary/50 text-muted-foreground border-border">
                    {paper.year}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {paper.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {classicDescriptions[paper.descriptionKey]?.[i18n.language as 'zh' | 'en'] || classicDescriptions[paper.descriptionKey]?.en}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {paper.authors[0]}
                  </span>
                  <div className="flex items-center gap-1 text-neon-orange">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{paper.citations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
