import { Settings as SettingsIcon, User, Bell, Palette, Shield, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const settingsSections = [
  { icon: User, title: "Profile", description: "Manage your account details" },
  { icon: Bell, title: "Notifications", description: "Configure alert preferences" },
  { icon: Palette, title: "Appearance", description: "Customize your experience" },
  { icon: Shield, title: "Privacy", description: "Control your data and privacy" },
  { icon: CreditCard, title: "Billing", description: "Manage subscription and credits" },
];

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {settingsSections.map((section) => (
          <Card
            key={section.title}
            className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <section.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="bg-border" />

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Quick Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-summarize" className="text-foreground">Auto-summarize papers</Label>
              <p className="text-sm text-muted-foreground">Automatically generate summaries when opening papers</p>
            </div>
            <Switch id="auto-summarize" />
          </div>
          <Separator className="bg-border" />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-digest" className="text-foreground">Weekly email digest</Label>
              <p className="text-sm text-muted-foreground">Receive curated paper recommendations</p>
            </div>
            <Switch id="email-digest" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
