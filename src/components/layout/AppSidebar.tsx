import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Compass,
  Trophy,
  BookOpen,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  Settings2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// Mock tags data
const topTags = [
  { id: "1", name: "LLM", count: 24 },
  { id: "2", name: "Transformer", count: 18 },
  { id: "3", name: "RL", count: 12 },
  { id: "4", name: "Diffusion", count: 9 },
  { id: "5", name: "Multimodal", count: 7 },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { title: t("nav.discovery"), url: "/", icon: Compass },
    { title: t("nav.academicCircle"), url: "/academic-circle", icon: Users },
    { title: t("nav.classicHall"), url: "/classic-hall", icon: Trophy },
    { title: t("nav.notebook"), url: "/notebook", icon: BookOpen },
    { title: t("nav.agentLab"), url: "/agent-lab", icon: FlaskConical },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg text-foreground">
              PaperAI
            </span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          const NavItem = (
            <Link
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
                item.url === "/classic-hall" && isActive && "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive && "text-primary",
                  item.url === "/classic-hall" && isActive && "text-amber-500"
                )}
              />
              {!collapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                <TooltipContent side="right" className="bg-popover border-border">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          }

          return NavItem;
        })}

        {/* Tags Section */}
        {!collapsed && (
          <div className="pt-6 mt-6 border-t border-sidebar-border">
            <div className="flex items-center justify-between px-3 mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("nav.tags")}
              </span>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {t("nav.manageTags")}
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-1">
              {topTags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/?tag=${tag.name}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors group"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Tag className="h-3.5 w-3.5" />
                    {tag.name}
                  </span>
                  <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-muted">
                    {tag.count}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {collapsed && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="mt-6 pt-6 border-t border-sidebar-border">
                <div className="flex items-center justify-center px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg cursor-pointer">
                  <Tag className="h-5 w-5" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover border-border">
              {t("nav.tags")}
            </TooltipContent>
          </Tooltip>
        )}
      </nav>

      {/* User Profile Widget */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {t("user.name").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {t("user.name")}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {t("user.email")}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
