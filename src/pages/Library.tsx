import { useTranslation } from "react-i18next";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Library() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("library.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("library.subtitle")}</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {t("library.newCollection")}
        </Button>
      </div>

      <Card className="bg-card border-border border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">{t("library.empty.title")}</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-4">
            {t("library.empty.description")}
          </p>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            {t("library.empty.button")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
