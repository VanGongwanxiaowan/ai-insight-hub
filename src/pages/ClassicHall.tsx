import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Trophy, Sparkles, ExternalLink, Quote } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Era = "all" | "pre2017" | "2017-2020" | "2021-present";

interface ClassicPaper {
  id: string;
  title: string;
  year: number;
  citations: number;
  domain: string;
  authors: string[];
  abstract: string;
}

const classicPapers: ClassicPaper[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    year: 2017,
    citations: 95000,
    domain: "LLM",
    authors: ["Vaswani et al."],
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder."
  },
  {
    id: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    year: 2018,
    citations: 75000,
    domain: "NLP",
    authors: ["Devlin et al."],
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers."
  },
  {
    id: "gpt-3",
    title: "Language Models are Few-Shot Learners",
    year: 2020,
    citations: 28000,
    domain: "LLM",
    authors: ["Brown et al."],
    abstract: "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task."
  },
  {
    id: "resnet",
    title: "Deep Residual Learning for Image Recognition",
    year: 2015,
    citations: 180000,
    domain: "Vision",
    authors: ["He et al."],
    abstract: "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper."
  },
  {
    id: "gan",
    title: "Generative Adversarial Networks",
    year: 2014,
    citations: 65000,
    domain: "Image Gen",
    authors: ["Goodfellow et al."],
    abstract: "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models."
  },
  {
    id: "alphago",
    title: "Mastering the Game of Go with Deep Neural Networks",
    year: 2016,
    citations: 22000,
    domain: "RL",
    authors: ["Silver et al."],
    abstract: "The game of Go has long been viewed as the most challenging of classic games for artificial intelligence owing to its enormous search space."
  },
  {
    id: "vae",
    title: "Auto-Encoding Variational Bayes",
    year: 2013,
    citations: 32000,
    domain: "Generative",
    authors: ["Kingma & Welling"],
    abstract: "We introduce a stochastic variational inference and learning algorithm that scales to large datasets and can be used for directed probabilistic models."
  },
  {
    id: "diffusion",
    title: "Denoising Diffusion Probabilistic Models",
    year: 2020,
    citations: 15000,
    domain: "Image Gen",
    authors: ["Ho et al."],
    abstract: "We present high quality image synthesis results using diffusion probabilistic models, a class of latent variable models inspired by nonequilibrium thermodynamics."
  },
  {
    id: "word2vec",
    title: "Efficient Estimation of Word Representations in Vector Space",
    year: 2013,
    citations: 45000,
    domain: "NLP",
    authors: ["Mikolov et al."],
    abstract: "We propose two novel model architectures for computing continuous vector representations of words from very large data sets."
  },
  {
    id: "llama",
    title: "LLaMA: Open and Efficient Foundation Language Models",
    year: 2023,
    citations: 8000,
    domain: "LLM",
    authors: ["Touvron et al."],
    abstract: "We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters trained on publicly available datasets."
  },
  {
    id: "clip",
    title: "Learning Transferable Visual Models From Natural Language Supervision",
    year: 2021,
    citations: 18000,
    domain: "Multimodal",
    authors: ["Radford et al."],
    abstract: "We demonstrate that the simple pre-training task of predicting which caption goes with which image is an efficient and scalable way to learn SOTA image representations."
  },
  {
    id: "gpt-4",
    title: "GPT-4 Technical Report",
    year: 2023,
    citations: 5000,
    domain: "LLM",
    authors: ["OpenAI"],
    abstract: "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs."
  }
];

export default function ClassicHall() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEra, setSelectedEra] = useState<Era>("all");

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

  const filteredPapers = classicPapers
    .filter(filterByEra)
    .filter(paper => 
      searchQuery === "" || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatCitations = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return count.toString();
  };

  const isLegendary = (citations: number) => citations >= 10000;

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-background to-orange-500/5 border-b border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-orange-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
                  selectedEra === era.key && "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
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

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPapers.map((paper, index) => (
            <Link
              key={paper.id}
              to={`/read/${paper.id}`}
              className="block break-inside-avoid"
            >
              <div
                className={cn(
                  "group relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  isLegendary(paper.citations) 
                    ? "border-amber-500/50 shadow-[0_0_30px_-5px] shadow-amber-500/20 hover:shadow-amber-500/30" 
                    : "border-border/50 hover:border-border"
                )}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Legendary Glow Effect */}
                {isLegendary(paper.citations) && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs font-medium bg-primary/10 text-primary border-primary/20"
                        >
                          {paper.domain}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{paper.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {paper.title}
                      </h3>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>

                  {/* Authors */}
                  <p className="text-sm text-muted-foreground mb-3">
                    {paper.authors.join(", ")}
                  </p>

                  {/* Citation Badge */}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                      isLegendary(paper.citations)
                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      {isLegendary(paper.citations) && (
                        <Trophy className="h-3.5 w-3.5" />
                      )}
                      <Quote className="h-3 w-3" />
                      <span>{t("classicHall.citedBy").replace("{{count}}", formatCitations(paper.citations))}</span>
                    </div>
                    {isLegendary(paper.citations) && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                        {t("classicHall.legendary")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
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
