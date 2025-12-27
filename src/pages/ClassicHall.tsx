import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Trophy, Sparkles, ExternalLink, Quote, Tag, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TagManager, TagItem, TagSelector } from "@/components/TagManager";
import { FavoriteButton } from "@/components/FavoritesManager";

type Era = "all" | "pre2017" | "2017-2020" | "2021-present";

interface ClassicPaper {
  id: string;
  title: string;
  year: number;
  citations: number;
  domain: string;
  authors: string[];
  abstract: string;
  tagIds: string[];
  favorited: boolean;
}

const initialPapers: ClassicPaper[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    year: 2017,
    citations: 95000,
    domain: "LLM",
    authors: ["Vaswani et al."],
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.",
    tagIds: ["tag-1", "tag-2"],
    favorited: true,
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    year: 2018,
    citations: 75000,
    domain: "NLP",
    authors: ["Devlin et al."],
    abstract: "We introduce a new language representation model called BERT.",
    tagIds: ["tag-3"],
    favorited: false,
  },
  {
    id: "gpt-3",
    title: "Language Models are Few-Shot Learners",
    year: 2020,
    citations: 28000,
    domain: "LLM",
    authors: ["Brown et al."],
    abstract: "Recent work has demonstrated substantial gains on many NLP tasks.",
    tagIds: ["tag-1"],
    favorited: true,
  },
  {
    id: "resnet",
    title: "Deep Residual Learning for Image Recognition",
    year: 2015,
    citations: 180000,
    domain: "Vision",
    authors: ["He et al."],
    abstract: "Deeper neural networks are more difficult to train.",
    tagIds: ["tag-4"],
    favorited: false,
  },
  {
    id: "gan",
    title: "Generative Adversarial Networks",
    year: 2014,
    citations: 65000,
    domain: "Image Gen",
    authors: ["Goodfellow et al."],
    abstract: "We propose a new framework for estimating generative models.",
    tagIds: ["tag-5"],
    favorited: false,
  },
  {
    id: "alphago",
    title: "Mastering the Game of Go with Deep Neural Networks",
    year: 2016,
    citations: 22000,
    domain: "RL",
    authors: ["Silver et al."],
    abstract: "The game of Go has long been viewed as the most challenging.",
    tagIds: ["tag-6"],
    favorited: false,
  },
  {
    id: "vae",
    title: "Auto-Encoding Variational Bayes",
    year: 2013,
    citations: 32000,
    domain: "Generative",
    authors: ["Kingma & Welling"],
    abstract: "We introduce a stochastic variational inference algorithm.",
    tagIds: [],
    favorited: false,
  },
  {
    id: "diffusion",
    title: "Denoising Diffusion Probabilistic Models",
    year: 2020,
    citations: 15000,
    domain: "Image Gen",
    authors: ["Ho et al."],
    abstract: "We present high quality image synthesis using diffusion models.",
    tagIds: ["tag-5"],
    favorited: true,
  },
  {
    id: "word2vec",
    title: "Efficient Estimation of Word Representations",
    year: 2013,
    citations: 45000,
    domain: "NLP",
    authors: ["Mikolov et al."],
    abstract: "We propose two novel model architectures.",
    tagIds: ["tag-3"],
    favorited: false,
  },
  {
    id: "llama",
    title: "LLaMA: Open and Efficient Foundation Language Models",
    year: 2023,
    citations: 8000,
    domain: "LLM",
    authors: ["Touvron et al."],
    abstract: "We introduce LLaMA, a collection of foundation language models.",
    tagIds: ["tag-1"],
    favorited: false,
  },
  {
    id: "clip",
    title: "Learning Transferable Visual Models",
    year: 2021,
    citations: 18000,
    domain: "Multimodal",
    authors: ["Radford et al."],
    abstract: "We demonstrate that the simple pre-training task is efficient.",
    tagIds: ["tag-7"],
    favorited: false,
  },
  {
    id: "gpt-4",
    title: "GPT-4 Technical Report",
    year: 2023,
    citations: 5000,
    domain: "LLM",
    authors: ["OpenAI"],
    abstract: "We report the development of GPT-4.",
    tagIds: ["tag-1", "tag-7"],
    favorited: false,
  },
];

const initialTags: TagItem[] = [
  { id: "tag-1", name: "LLM", color: "bg-blue-500", count: 5 },
  { id: "tag-2", name: "Transformer", color: "bg-green-500", count: 2 },
  { id: "tag-3", name: "NLP", color: "bg-amber-500", count: 3 },
  { id: "tag-4", name: "Vision", color: "bg-purple-500", count: 1 },
  { id: "tag-5", name: "Diffusion", color: "bg-rose-500", count: 2 },
  { id: "tag-6", name: "RL", color: "bg-cyan-500", count: 1 },
  { id: "tag-7", name: "Multimodal", color: "bg-orange-500", count: 2 },
];

export default function ClassicHall() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<Era>("all");
  const [papers, setPapers] = useState<ClassicPaper[]>(initialPapers);
  const [tags, setTags] = useState<TagItem[]>(initialTags);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  const eras: { key: Era; label: string }[] = [
    { key: "all", label: t("classicHall.eras.all") },
    { key: "pre2017", label: t("classicHall.eras.pre2017") },
    { key: "2017-2020", label: t("classicHall.eras.2017to2020") },
    { key: "2021-present", label: t("classicHall.eras.2021present") },
  ];

  const filterByEra = (paper: ClassicPaper) => {
    if (selectedEra === "all") return true;
    if (selectedEra === "pre2017") return paper.year < 2017;
    if (selectedEra === "2017-2020") return paper.year >= 2017 && paper.year <= 2020;
    if (selectedEra === "2021-present") return paper.year >= 2021;
    return true;
  };

  const filteredPapers = papers
    .filter(filterByEra)
    .filter(
      (paper) =>
        searchQuery === "" ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (paper) => !selectedTagFilter || paper.tagIds.includes(selectedTagFilter)
    );

  const formatCitations = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return count.toString();
  };

  const isLegendary = (citations: number) => citations >= 10000;

  const toggleFavorite = (paperId: string) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, favorited: !p.favorited } : p))
    );
  };

  const updatePaperTags = (paperId: string, tagIds: string[]) => {
    setPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, tagIds } : p))
    );
  };

  const handleAddNewTag = (newTag: TagItem) => {
    setTags((prev) => [...prev, newTag]);
  };

  const getTagById = (tagId: string) => tags.find((t) => t.id === tagId);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t("classicHall.badge")}
                </Badge>
              </div>
            </div>
            {/* Tag Manager Button */}
            <TagManager
              tags={tags}
              onTagsChange={setTags}
              mode="manage"
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  {t("tagManager.manageTags")}
                </Button>
              }
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("classicHall.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t("classicHall.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & Search */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Era Filter */}
            <div className="flex gap-2 flex-wrap">
              {eras.map((era) => (
                <Button
                  key={era.key}
                  variant={selectedEra === era.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEra(era.key)}
                  className={cn(
                    "transition-all",
                    selectedEra === era.key &&
                      "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                  )}
                >
                  {era.label}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("classicHall.searchPlaceholder")}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={selectedTagFilter === null ? "secondary" : "ghost"}
              size="sm"
              className="h-7"
              onClick={() => setSelectedTagFilter(null)}
            >
              {t("classicHall.eras.all")}
            </Button>
            {tags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTagFilter === tag.id ? "secondary" : "ghost"}
                size="sm"
                className="h-7 gap-1.5"
                onClick={() => setSelectedTagFilter(tag.id)}
              >
                <div className={cn("w-2 h-2 rounded-full", tag.color)} />
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPapers.map((paper, index) => (
            <div key={paper.id} className="break-inside-avoid">
              <div
                className={cn(
                  "group relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
                  isLegendary(paper.citations)
                    ? "border-amber-500/50 shadow-[0_0_30px_-5px] shadow-amber-500/20 hover:shadow-amber-500/30"
                    : "border-border/50 hover:border-border"
                )}
              >
                {/* Legendary Glow Effect */}
                {isLegendary(paper.citations) && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                        >
                          {paper.domain}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {paper.year}
                        </span>
                      </div>
                      <Link
                        to={`/read/${paper.id}`}
                        className="text-lg font-semibold text-foreground hover:text-primary transition-colors leading-tight block"
                      >
                        {paper.title}
                      </Link>
                    </div>
                    <FavoriteButton
                      isFavorited={paper.favorited}
                      onToggle={() => toggleFavorite(paper.id)}
                      size="sm"
                    />
                  </div>

                  {/* Authors */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {paper.authors.join(", ")}
                  </p>

                  {/* Tags */}
                  <div className="mb-3">
                    <TagSelector
                      allTags={tags}
                      selectedTagIds={paper.tagIds}
                      onTagsChange={(tagIds) => updatePaperTags(paper.id, tagIds)}
                      onAddNewTag={handleAddNewTag}
                    />
                  </div>

                  {/* Citation Badge */}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                        isLegendary(paper.citations)
                          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {isLegendary(paper.citations) && (
                        <Trophy className="h-3.5 w-3.5" />
                      )}
                      <Quote className="h-3 w-3" />
                      <span>
                        {t("classicHall.citedBy").replace(
                          "{{count}}",
                          formatCitations(paper.citations)
                        )}
                      </span>
                    </div>
                    {isLegendary(paper.citations) && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                        {t("classicHall.legendary")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">{t("classicHall.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
