import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRecommendations, useRefreshRecommendations, useRecommendationStatus } from "@/lib/api/hooks";
import { toast } from "sonner";

export default function Recommendations() {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(20);

  // Fetch recommendations from API
  const { data, isLoading, error, refetch } = useRecommendations(limit);

  // Fetch recommendation status
  const { data: status } = useRecommendationStatus();

  // Refresh recommendations mutation
  const { mutate: refresh, isPending: isRefreshing } = useRefreshRecommendations();

  const recommendations = data?.recommendations || [];
  const lastUpdated = data?.last_updated || status?.last_updated;

  const handleRefresh = () => {
    refresh(undefined, {
      onSuccess: (result) => {
        toast.success(`Recommendations refresh started. Task ID: ${result.task_id}`);
        // Poll for updates after a delay
        setTimeout(() => refetch(), 5000);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to refresh recommendations");
      },
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-neon-green";
    if (score >= 0.8) return "text-primary";
    if (score >= 0.7) return "text-neon-blue";
    return "text-neon-orange";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t("recommendations.error", "Failed to load recommendations")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {error.message || t("recommendations.errorMessage", "Please try again later")}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.retry", "Retry")}
        </Button>
      </div>
    );
  }

  // No recommendations state
  if (recommendations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Lightbulb className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {t("recommendations.noRecommendations", "No recommendations yet")}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md text-center">
          {status?.favorite_count === 0
            ? t("recommendations.favoritePapersFirst", "Favorite some papers to get personalized recommendations!")
            : t("recommendations.generating", "Recommendations are being generated. Please check back later.")}
        </p>
        {status?.favorite_count === 0 && (
          <Button asChild>
            <Link to="/">{t("recommendations.browsePapers", "Browse Papers")}</Link>
          </Button>
        )}
        {status?.favorite_count > 0 && (
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing
              ? t("recommendations.refreshing", "Refreshing...")
              : t("recommendations.refresh", "Refresh Recommendations")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-neon-purple/5 border border-border p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.1),transparent_40%)]" />
        <div className="absolute top-4 right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Badge className="bg-primary/20 text-primary border-primary/30 mb-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {t("recommendations.title", "Recommended for You")}
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground">
              {t("recommendations.subtitle", "Personalized paper recommendations based on your reading history")}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">
                {t("recommendations.lastUpdated", "Last updated")}: {formatDate(lastUpdated)}
              </p>
            )}
          </div>

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="shrink-0"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            {isRefreshing
              ? t("recommendations.refreshing", "Refreshing...")
              : t("recommendations.refresh", "Refresh")}
          </Button>
        </div>
      </div>

      {/* Status info */}
      {status && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {t("recommendations.totalCount", "Total recommendations")}: <strong>{recommendations.length}</strong>
          </span>
          <span>•</span>
          <span>
            {t("recommendations.favoriteCount", "Favorite papers")}: <strong>{status.favorite_count}</strong>
          </span>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.paper_id}
            recommendation={rec}
            getScoreColor={getScoreColor}
          />
        ))}
      </div>

      {/* Load More */}
      {recommendations.length >= limit && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setLimit((prev) => prev + 20)}
            variant="outline"
            size="lg"
          >
            {t("recommendations.loadMore", "Load More")}
          </Button>
        </div>
      )}
    </div>
  );
}

// Recommendation Card Component
interface RecommendationCardProps {
  recommendation: {
    paper_id: string;
    title: string;
    abstract: string | null;
    arxiv_id: string | null;
    score: number;
    reason: string | null;
    created_at: string;
  };
  getScoreColor: (score: number) => string;
}

function RecommendationCard({ recommendation, getScoreColor }: RecommendationCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="group bg-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
      <CardContent className="p-6">
        {/* Score Badge */}
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="outline"
            className={cn(
              "gap-1 border-primary/30",
              getScoreColor(recommendation.score),
              "bg-primary/5"
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span className="font-medium">
              {Math.round(recommendation.score * 100)}% {t("recommendations.match", "match")}
            </span>
          </Badge>
        </div>

        {/* Title */}
        <Link
          to={`/read/${recommendation.paper_id}`}
          className="block mb-3"
        >
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {recommendation.title}
          </h3>
        </Link>

        {/* Abstract */}
        {recommendation.abstract && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {recommendation.abstract}
          </p>
        )}

        {/* Reason */}
        {recommendation.reason && (
          <div className="mb-4 p-2 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-xs text-primary/80">{recommendation.reason}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {recommendation.arxiv_id && (
              <span className="font-mono">arXiv:{recommendation.arxiv_id}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to={`/read/${recommendation.paper_id}`}>
                <Bookmark className="h-4 w-4 mr-1" />
                {t("common.read", "Read")}
              </Link>
            </Button>
            {recommendation.arxiv_id && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-muted-foreground hover:text-foreground"
                onClick={() => window.open(`https://arxiv.org/abs/${recommendation.arxiv_id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
