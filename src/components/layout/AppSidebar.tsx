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
  Heart,
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

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

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

  const managementItems = [
    { title: t("nav.tagManagement"), url: "/tags", icon: Tag },
    { title: t("nav.favorites"), url: "/favorites", icon: Heart },
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

        {/* Management Section */}
        {!collapsed && (
          <div className="pt-6 mt-6 border-t border-sidebar-border">
            <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("nav.management")}
            </span>
            <div className="mt-3 space-y-1">
              {managementItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mt-6 pt-6 border-t border-sidebar-border space-y-1">
            {managementItems.map((item) => (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.url}
                    className="flex items-center justify-center px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover border-border">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
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
