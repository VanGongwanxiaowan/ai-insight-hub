import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart,
  Search,
  FileText,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface FavoriteItem {
  id: string;
  type: "paper" | "note";
  title: string;
  subtitle?: string;
  tags: string[];
  createdAt: Date;
}

interface FavoritesManagerProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onItemClick?: (item: FavoriteItem) => void;
  trigger?: React.ReactNode;
}

export function FavoritesManager({
  favorites,
  onRemoveFavorite,
  onItemClick,
  trigger,
}: FavoritesManagerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorites = favorites.filter(
    (item) =>
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paperFavorites = filteredFavorites.filter((f) => f.type === "paper");
  const noteFavorites = filteredFavorites.filter((f) => f.type === "note");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Heart className="h-4 w-4" />
            {t("favorites.manage")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            {t("favorites.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("favorites.searchPlaceholder")}
              className="pl-10"
            />
          </div>

          {/* Papers */}
          {paperFavorites.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t("favorites.papers")} ({paperFavorites.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {paperFavorites.map((item) => (
                  <FavoriteCard
                    key={item.id}
                    item={item}
                    onRemove={() => onRemoveFavorite(item.id)}
                    onClick={() => onItemClick?.(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {noteFavorites.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {t("favorites.notes")} ({noteFavorites.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {noteFavorites.map((item) => (
                  <FavoriteCard
                    key={item.id}
                    item={item}
                    onRemove={() => onRemoveFavorite(item.id)}
                    onClick={() => onItemClick?.(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredFavorites.length === 0 && (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? t("favorites.noResults") : t("favorites.empty")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FavoriteCard({
  item,
  onRemove,
  onClick,
}: {
  item: FavoriteItem;
  onRemove: () => void;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors group",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {item.title}
        </h4>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {item.subtitle}
          </p>
        )}
        {item.tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs h-5 px-1.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        {onClick && (
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// 收藏按钮组件
interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: () => void;
  size?: "sm" | "default";
}

export function FavoriteButton({ isFavorited, onToggle, size = "default" }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "transition-colors",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        isFavorited ? "text-rose-500 hover:text-rose-600" : "text-muted-foreground hover:text-rose-500"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <Heart className={cn(
        size === "sm" ? "h-4 w-4" : "h-5 w-5",
        isFavorited && "fill-current"
      )} />
    </Button>
  );
}
