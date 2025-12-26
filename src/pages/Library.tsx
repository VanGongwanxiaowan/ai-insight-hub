import { Library as LibraryIcon, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Library() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Library</h1>
          <p className="text-muted-foreground mt-1">Organize and manage your saved papers</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <Card className="bg-card border-border border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No papers yet</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            Start building your research library by saving papers from the Discovery page.
          </p>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            Explore Papers
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
