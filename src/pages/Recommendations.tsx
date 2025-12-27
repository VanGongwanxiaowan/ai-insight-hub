import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Bot,
  Sparkles,
  Image,
  Video,
  Brain,
  Cpu,
  TrendingUp,
  ExternalLink,
  Star,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/FavoritesManager";

interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  abstract: string;
  category: string;
  trending?: boolean;
  favorited: boolean;
}

const categories = [
  { id: "all", label: "all", icon: Sparkles },
  { id: "agent", label: "agent", icon: Bot },
  { id: "aigc", label: "aigc", icon: Sparkles },
  { id: "imageGen", label: "imageGen", icon: Image },
  { id: "videoGen", label: "videoGen", icon: Video },
  { id: "llm", label: "llm", icon: Cpu },
  { id: "ai", label: "ai", icon: Brain },
];

const initialPapers: RecommendedPaper[] = [
  // Agent
  {
    id: "react-agent",
    title: "ReAct: Synergizing Reasoning and Acting in Language Models",
    authors: ["Yao et al."],
    year: 2023,
    citations: 2500,
    abstract: "A paradigm for synergizing reasoning and acting in language models for solving diverse language reasoning and decision making tasks.",
    category: "agent",
    trending: true,
    favorited: false,
  },
  {
    id: "toolformer",
    title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
    authors: ["Schick et al."],
    year: 2023,
    citations: 1800,
    abstract: "We introduce Toolformer, a model trained to decide which APIs to call, when to call them, what arguments to pass.",
    category: "agent",
    favorited: false,
  },
  {
    id: "autogpt",
    title: "Auto-GPT: An Autonomous GPT-4 Experiment",
    authors: ["Richards et al."],
    year: 2023,
    citations: 3200,
    abstract: "An experimental open-source application showcasing the capabilities of the GPT-4 language model.",
    category: "agent",
    trending: true,
    favorited: true,
  },
  // AIGC
  {
    id: "chatgpt",
    title: "Training language models to follow instructions with human feedback",
    authors: ["Ouyang et al."],
    year: 2022,
    citations: 8500,
    abstract: "Making language models bigger does not inherently make them better at following a user's intent.",
    category: "aigc",
    trending: true,
    favorited: false,
  },
  {
    id: "constitutional-ai",
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Bai et al."],
    year: 2022,
    citations: 1200,
    abstract: "A method for training a harmless AI assistant through self-improvement.",
    category: "aigc",
    favorited: false,
  },
  // Image Gen
  {
    id: "stable-diffusion",
    title: "High-Resolution Image Synthesis with Latent Diffusion Models",
    authors: ["Rombach et al."],
    year: 2022,
    citations: 12000,
    abstract: "By decomposing the image formation process into a sequential application of denoising autoencoders.",
    category: "imageGen",
    trending: true,
    favorited: true,
  },
  {
    id: "dalle2",
    title: "Hierarchical Text-Conditional Image Generation with CLIP Latents",
    authors: ["Ramesh et al."],
    year: 2022,
    citations: 4500,
    abstract: "DALL·E 2 is a new AI system that can create realistic images and art from a description in natural language.",
    category: "imageGen",
    favorited: false,
  },
  {
    id: "midjourney-style",
    title: "Scaling Autoregressive Models for Content-Rich Text-to-Image Generation",
    authors: ["Yu et al."],
    year: 2022,
    citations: 890,
    abstract: "We present Parti, an autoregressive text-to-image generation model.",
    category: "imageGen",
    favorited: false,
  },
  // Video Gen
  {
    id: "sora",
    title: "Video generation models as world simulators",
    authors: ["OpenAI"],
    year: 2024,
    citations: 500,
    abstract: "We explore large-scale training of generative models on video data.",
    category: "videoGen",
    trending: true,
    favorited: false,
  },
  {
    id: "gen2",
    title: "Structure and Content-Guided Video Synthesis with Diffusion Models",
    authors: ["Esser et al."],
    year: 2023,
    citations: 650,
    abstract: "A method for generating videos with temporal consistency and content control.",
    category: "videoGen",
    favorited: false,
  },
  // LLM
  {
    id: "gpt4",
    title: "GPT-4 Technical Report",
    authors: ["OpenAI"],
    year: 2023,
    citations: 9500,
    abstract: "We report the development of GPT-4, a large-scale, multimodal model.",
    category: "llm",
    trending: true,
    favorited: true,
  },
  {
    id: "llama2",
    title: "Llama 2: Open Foundation and Fine-Tuned Chat Models",
    authors: ["Touvron et al."],
    year: 2023,
    citations: 6800,
    abstract: "We develop and release Llama 2, a collection of pretrained and fine-tuned LLMs.",
    category: "llm",
    trending: true,
    favorited: false,
  },
  {
    id: "claude",
    title: "Model Card and Evaluations for Claude Models",
    authors: ["Anthropic"],
    year: 2023,
    citations: 450,
    abstract: "Documentation for Claude, a series of AI assistants trained by Anthropic.",
    category: "llm",
    favorited: false,
  },
  // AI General
  {
    id: "transformer",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    citations: 95000,
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.",
    category: "ai",
    trending: true,
    favorited: true,
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
    citations: 75000,
    abstract: "We introduce a new language representation model called BERT.",
    category: "ai",
    favorited: false,
  },
  {
    id: "alphafold",
    title: "Highly accurate protein structure prediction with AlphaFold",
    authors: ["Jumper et al."],
    year: 2021,
    citations: 18000,
    abstract: "We demonstrate an AI-based protein structure prediction achieving accuracy competitive with experiment.",
    category: "ai",
    favorited: false,
  },
];

export default function Recommendations() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [papers, setPapers] = useState(initialPapers);

  const filteredPapers = activeCategory === "all" 
    ? papers 
    : papers.filter(p => p.category === activeCategory);

  const trendingPapers = papers.filter(p => p.trending);

  const toggleFavorite = (paperId: string) => {
    setPapers(prev => prev.map(p => 
      p.id === paperId ? { ...p, favorited: !p.favorited } : p
    ));
  };

  const formatCitations = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || Sparkles;
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 via-background to-fuchsia-500/5 border-b border-violet-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/10 via-transparent to-transparent" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <Lightbulb className="h-7 w-7 text-white" />
            </div>
            <div>
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 mb-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                {t("recommendations.badge")}
              </Badge>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("recommendations.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t("recommendations.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Trending Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-semibold">{t("recommendations.trending")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingPapers.slice(0, 4).map((paper) => {
              const CategoryIcon = getCategoryIcon(paper.category);
              return (
                <Card key={paper.id} className="group bg-card/50 border-border hover:border-primary/30 transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs gap-1">
                        <CategoryIcon className="h-3 w-3" />
                        {t(`recommendations.categories.${paper.category}`)}
                      </Badge>
                      <FavoriteButton
                        isFavorited={paper.favorited}
                        onToggle={() => toggleFavorite(paper.id)}
                        size="sm"
                      />
                    </div>
                    <Link 
                      to={`/read/${paper.id}`}
                      className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2 block mb-2"
                    >
                      {paper.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mb-2">
                      {paper.authors.join(", ")} · {paper.year}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-amber-500" />
                      {formatCitations(paper.citations)} {t("recommendations.citations")}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <TabsList className="bg-muted/50 h-auto p-1 flex-wrap">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <category.icon className="h-4 w-4" />
                  {t(`recommendations.categories.${category.label}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => {
                const CategoryIcon = getCategoryIcon(paper.category);
                return (
                  <Card 
                    key={paper.id} 
                    className={cn(
                      "group bg-card/50 border-border hover:border-primary/30 transition-all hover:shadow-lg",
                      paper.trending && "ring-1 ring-rose-500/20"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs gap-1 bg-primary/10 text-primary">
                            <CategoryIcon className="h-3 w-3" />
                            {t(`recommendations.categories.${paper.category}`)}
                          </Badge>
                          {paper.trending && (
                            <Badge className="text-xs bg-rose-500/20 text-rose-400 border-rose-500/30">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {t("recommendations.hot")}
                            </Badge>
                          )}
                        </div>
                        <FavoriteButton
                          isFavorited={paper.favorited}
                          onToggle={() => toggleFavorite(paper.id)}
                          size="sm"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Link 
                        to={`/read/${paper.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 block mb-2 group-hover:text-primary"
                      >
                        {paper.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        {paper.authors.join(", ")} · {paper.year}
                      </p>
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span>{formatCitations(paper.citations)}</span>
                          <span className="text-xs">{t("recommendations.citations")}</span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {filteredPapers.length === 0 && (
          <div className="text-center py-16">
            <Lightbulb className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("recommendations.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
