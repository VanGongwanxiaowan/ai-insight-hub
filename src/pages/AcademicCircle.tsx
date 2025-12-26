import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  FileText,
  TrendingUp,
  Flame,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock activity data
const mockActivities = [
  {
    id: "1",
    user: {
      name: "Dr. Sarah Chen",
      avatar: "",
      title: "Stanford AI Lab",
    },
    action: "posted a note on",
    content: "The attention mechanism in this paper is revolutionary. The way they handle multi-head attention scaling could significantly improve inference speed for large context windows.",
    paper: {
      title: "FlashAttention-2: Faster Attention with Better Parallelism",
      tags: ["LLM", "Optimization"],
    },
    likes: 42,
    comments: 8,
    timestamp: "2h ago",
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Prof. Michael Zhang",
      avatar: "",
      title: "MIT CSAIL",
    },
    action: "shared insights about",
    content: "Interesting comparison between RLHF and DPO. The simplicity of DPO makes it much more practical for smaller research labs. No need for a separate reward model!",
    paper: {
      title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
      tags: ["RLHF", "Alignment"],
    },
    likes: 128,
    comments: 23,
    timestamp: "4h ago",
    liked: true,
  },
  {
    id: "3",
    user: {
      name: "Dr. Emily Wang",
      avatar: "",
      title: "DeepMind Research",
    },
    action: "commented on",
    content: "The scaling laws presented here align with our internal findings. However, I wonder if these hold for multimodal architectures as well.",
    paper: {
      title: "Scaling Laws for Neural Language Models",
      tags: ["Scaling", "LLM"],
    },
    likes: 89,
    comments: 15,
    timestamp: "6h ago",
    liked: false,
  },
  {
    id: "4",
    user: {
      name: "Alex Liu",
      avatar: "",
      title: "PhD Candidate, Berkeley",
    },
    action: "posted a note on",
    content: "Finally got Chain-of-Thought working on my custom dataset! The key was to include more diverse reasoning examples in the prompts.",
    paper: {
      title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
      tags: ["Reasoning", "Prompting"],
    },
    likes: 56,
    comments: 12,
    timestamp: "8h ago",
    liked: false,
  },
];

const trendingScholars = [
  { name: "Dr. Sarah Chen", institution: "Stanford", notes: 24, avatar: "" },
  { name: "Prof. Michael Zhang", institution: "MIT", notes: 18, avatar: "" },
  { name: "Dr. Emily Wang", institution: "DeepMind", notes: 15, avatar: "" },
  { name: "Alex Liu", institution: "Berkeley", notes: 12, avatar: "" },
  { name: "Dr. James Park", institution: "Google", notes: 10, avatar: "" },
];

const hotDiscussions = [
  { title: "GPT-4 Technical Report", comments: 156, tags: ["LLM"] },
  { title: "Constitutional AI: Harmlessness from AI Feedback", comments: 89, tags: ["Alignment"] },
  { title: "LLaMA: Open and Efficient Foundation Language Models", comments: 72, tags: ["LLM"] },
  { title: "Diffusion Models Beat GANs on Image Synthesis", comments: 64, tags: ["Diffusion"] },
];

export default function AcademicCircle() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState(mockActivities);

  const toggleLike = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, liked: !activity.liked, likes: activity.liked ? activity.likes - 1 : activity.likes + 1 }
        : activity
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">{t("academicCircle.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("academicCircle.subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-card border-border hover:border-primary/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {activity.user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{activity.user.name}</span>
                          <span className="text-muted-foreground text-sm">{t(`academicCircle.actions.${activity.action.replace(/\s+/g, "")}`, activity.action)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.user.title} · {activity.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  {/* Note Content */}
                  <p className="text-foreground leading-relaxed">{activity.content}</p>

                  {/* Paper Card */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border hover:bg-muted/70 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {activity.paper.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          {activity.paper.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs h-5 px-2 bg-primary/10 text-primary border-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "gap-2 text-muted-foreground hover:text-rose-500",
                        activity.liked && "text-rose-500"
                      )}
                      onClick={() => toggleLike(activity.id)}
                    >
                      <Heart className={cn("h-4 w-4", activity.liked && "fill-current")} />
                      <span className="text-sm">{activity.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{activity.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Sidebar Widgets */}
          <div className="space-y-6">
            {/* Trending Scholars */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{t("academicCircle.trendingScholars")}</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {trendingScholars.map((scholar, index) => (
                    <div key={scholar.name} className="flex items-center gap-3 group cursor-pointer">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={scholar.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {scholar.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {scholar.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{scholar.institution}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-muted">
                        {scholar.notes} {t("academicCircle.notes")}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  {t("common.viewAll")}
                </Button>
              </CardContent>
            </Card>

            {/* Hot Discussions */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-foreground">{t("academicCircle.hotDiscussions")}</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {hotDiscussions.map((paper, index) => (
                    <div key={paper.title} className="group cursor-pointer">
                      <div className="flex items-start gap-3">
                        <span className="text-lg font-bold text-muted-foreground/50 w-5">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {paper.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {paper.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs h-5 px-1.5 bg-primary/10 text-primary border-0">
                                {tag}
                              </Badge>
                            ))}
                            <span className="text-xs text-muted-foreground">
                              {paper.comments} {t("academicCircle.comments")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/10">
                  {t("common.viewAll")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
