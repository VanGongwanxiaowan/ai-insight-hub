import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { usePapers, useToggleFavorite } from "@/lib/api/hooks";

// Classic papers data (static, could be moved to API later)
const classicPapers = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: ["Vaswani et al."],
    year: 2017,
    citations: "120K+",
    icon: "🏆",
    descriptionKey: "transformer",
    arxivId: "1706.03762",
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin et al."],
    year: 2018,
    citations: "85K+",
    icon: "📚",
    descriptionKey: "bert",
    arxivId: "1810.04805",
  },
  {
    id: "3",
    title: "GPT-3: Language Models are Few-Shot Learners",
    authors: ["Brown et al."],
    year: 2020,
    citations: "45K+",
    icon: "🚀",
    descriptionKey: "gpt3",
    arxivId: "2005.14165",
  },
  {
    id: "4",
    title: "Denoising Diffusion Probabilistic Models",
    authors: ["Ho et al."],
    year: 2020,
    citations: "12K+",
    icon: "🎨",
    descriptionKey: "diffusion",
    arxivId: "2006.11239",
  },
  {
    id: "5",
    title: "Playing Atari with Deep Reinforcement Learning",
    authors: ["Mnih et al."],
    year: 2013,
    citations: "25K+",
    icon: "🎮",
    descriptionKey: "dqn",
    arxivId: "1312.5602",
  },
  {
    id: "6",
    title: "Proximal Policy Optimization Algorithms",
    authors: ["Schulman et al."],
    year: 2017,
    citations: "18K+",
    icon: "⚡",
    descriptionKey: "ppo",
    arxivId: "1707.06347",
  },
  {
    id: "7",
    title: "ResNet: Deep Residual Learning",
    authors: ["He et al."],
    year: 2015,
    citations: "180K+",
    icon: "🏗️",
    descriptionKey: "resnet",
    arxivId: "1512.03385",
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

const categories = [
  { key: "llm", color: "bg-neon-blue/20 text-neon-blue border-neon-blue/30 hover:bg-neon-blue/30" },
  { key: "rl", color: "bg-neon-green/20 text-neon-green border-neon-green/30 hover:bg-neon-green/30" },
  { key: "agents", color: "bg-neon-purple/20 text-neon-purple border-neon-purple/30 hover:bg-neon-purple/30" },
  { key: "imageGen", color: "bg-neon-pink/20 text-neon-pink border-neon-pink/30 hover:bg-neon-pink/30" },
  { key: "videoGen", color: "bg-neon-orange/20 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/30" },
  { key: "reasoning", color: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30" },
];

export default function Discovery() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch papers from API
  const { data: papersData, isLoading: isLoadingPapers } = usePapers({
    search: searchQuery || undefined,
    sort_by: "published_date",
    sort_order: "desc",
    page,
    page_size: 10,
  });

  const papers = papersData?.items || [];
  const totalPages = papersData?.total_pages || 1;

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

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Search Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-neon-purple/5 border border-border p-8 md:p-12">
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
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 h-12 bg-secondary/50 border-border focus:border-primary text-base"
              />
            </div>

            <Button onClick={handleSearch} className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-blue">
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

      {/* Daily Feed - Papers from API */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-neon-green" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{t("discovery.dailyFeed.title")}</h2>
              <p className="text-sm text-muted-foreground">{papersData?.total || 0} papers found</p>
            </div>
          </div>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
            {t("common.viewAll")} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoadingPapers ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : papers.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">{t("discovery.noResults", "No papers found")}</p>
              </CardContent>
            </Card>
          ) : (
            papers.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                getCategoryStyle={getCategoryStyle}
                getCategoryName={getCategoryName}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
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

// Paper Card Component
interface PaperCardProps {
  paper: {
    id: string;
    title: string;
    abstract: string | null;
    arxiv_id: string | null;
    published_date: string | null;
  };
  getCategoryStyle: (key: string) => string;
  getCategoryName: (key: string) => string;
}

function PaperCard({ paper, getCategoryStyle, getCategoryName }: PaperCardProps) {
  const { mutate: toggleFavorite, isPending } = useToggleFavorite(paper.id, false);

  return (
    <Link to={`/read/${paper.id}`}>
      <Card className="bg-card border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {paper.published_date && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(paper.published_date).toLocaleDateString()}
                    </span>
                  )}
                  {paper.arxiv_id && (
                    <span className="text-xs text-muted-foreground font-mono">
                      arXiv:{paper.arxiv_id}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {paper.title}
              </h3>

              {paper.abstract && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {paper.abstract}
                </p>
              )}
            </div>

            <div className="flex lg:flex-col gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="bg-primary/10 text-primary hover:bg-primary/20 border-0"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite();
                }}
                disabled={isPending}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
              {paper.arxiv_id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`https://arxiv.org/abs/${paper.arxiv_id}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Open
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
