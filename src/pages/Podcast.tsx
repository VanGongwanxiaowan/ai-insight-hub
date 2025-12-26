import { Podcast as PodcastIcon, Play, Headphones, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Podcast() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Digital Podcast</h1>
        <p className="text-muted-foreground mt-1">Transform papers into engaging audio content</p>
      </div>

      <Card className="bg-gradient-to-br from-neon-purple/10 via-card to-primary/5 border-border overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Headphones className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AI-Generated Audio Summaries
              </h3>
              <p className="text-muted-foreground">
                Listen to paper summaries on the go. Perfect for commutes and multitasking.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="h-4 w-4 mr-2" />
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                <AudioLines className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">No podcasts generated yet</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
