import { useTranslation } from "react-i18next";
import { User, Bell, Palette, Shield, CreditCard, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { t, i18n } = useTranslation();

  const settingsSections = [
    { icon: User, titleKey: "profile" },
    { icon: Bell, titleKey: "notifications" },
    { icon: Palette, titleKey: "appearance" },
    { icon: Shield, titleKey: "privacy" },
    { icon: CreditCard, titleKey: "billing" },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("settings.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.subtitle")}</p>
      </div>

      <div className="space-y-4">
        {settingsSections.map((section) => (
          <Card
            key={section.titleKey}
            className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <section.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {t(`settings.sections.${section.titleKey}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`settings.sections.${section.titleKey}.description`)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-border" />

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">{t("settings.quickSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-summarize" className="text-foreground">
                {t("settings.autoSummarize.title")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.autoSummarize.description")}
              </p>
            </div>
            <Switch id="auto-summarize" />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-digest" className="text-foreground">
                {t("settings.emailDigest.title")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.emailDigest.description")}
              </p>
            </div>
            <Switch id="email-digest" defaultChecked />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("settings.language.title")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("settings.language.description")}
              </p>
            </div>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="zh">🇨🇳 中文</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
