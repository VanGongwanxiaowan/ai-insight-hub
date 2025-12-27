import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Tag,
  Plus,
  X,
  Edit3,
  Trash2,
  Check,
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

export interface TagItem {
  id: string;
  name: string;
  color: string;
  count?: number;
}

interface TagManagerProps {
  tags: TagItem[];
  onTagsChange: (tags: TagItem[]) => void;
  selectedTags?: string[];
  onSelectedTagsChange?: (tagIds: string[]) => void;
  mode?: "manage" | "select";
  trigger?: React.ReactNode;
}

const defaultColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-indigo-500",
];

export function TagManager({
  tags,
  onTagsChange,
  selectedTags = [],
  onSelectedTagsChange,
  mode = "manage",
  trigger,
}: TagManagerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: TagItem = {
        id: `tag-${Date.now()}`,
        name: newTagName.trim(),
        color: defaultColors[tags.length % defaultColors.length],
        count: 0,
      };
      onTagsChange([...tags, newTag]);
      setNewTagName("");
    }
  };

  const handleDeleteTag = (tagId: string) => {
    onTagsChange(tags.filter((t) => t.id !== tagId));
  };

  const handleEditTag = (tag: TagItem) => {
    setEditingTag(tag);
    setEditName(tag.name);
  };

  const handleSaveEdit = () => {
    if (editingTag && editName.trim()) {
      onTagsChange(
        tags.map((t) =>
          t.id === editingTag.id ? { ...t, name: editName.trim() } : t
        )
      );
      setEditingTag(null);
      setEditName("");
    }
  };

  const handleToggleTag = (tagId: string) => {
    if (onSelectedTagsChange) {
      if (selectedTags.includes(tagId)) {
        onSelectedTagsChange(selectedTags.filter((id) => id !== tagId));
      } else {
        onSelectedTagsChange([...selectedTags, tagId]);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Tag className="h-4 w-4" />
            {t("tagManager.manageTags")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {mode === "manage" ? t("tagManager.manageTags") : t("tagManager.selectTags")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new tag */}
          <div className="flex gap-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={t("tagManager.newTagPlaceholder")}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag();
              }}
            />
            <Button onClick={handleAddTag} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Tags list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tags.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("tagManager.noTags")}
              </p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-colors",
                    mode === "select" && selectedTags.includes(tag.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  {editingTag?.id === tag.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit();
                          if (e.key === "Escape") setEditingTag(null);
                        }}
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingTag(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div
                        className={cn(
                          "flex items-center gap-2 flex-1",
                          mode === "select" && "cursor-pointer"
                        )}
                        onClick={() => mode === "select" && handleToggleTag(tag.id)}
                      >
                        <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                        <span className="text-sm font-medium">{tag.name}</span>
                        {tag.count !== undefined && (
                          <Badge variant="secondary" className="text-xs h-5 px-1.5">
                            {tag.count}
                          </Badge>
                        )}
                      </div>
                      {mode === "manage" && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleEditTag(tag)}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      {mode === "select" && selectedTags.includes(tag.id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 用于在卡片上显示和添加标签的简化组件
interface TagSelectorProps {
  allTags: TagItem[];
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  onAddNewTag?: (tag: TagItem) => void;
}

export function TagSelector({ allTags, selectedTagIds, onTagsChange, onAddNewTag }: TagSelectorProps) {
  const { t } = useTranslation();
  const [showSelector, setShowSelector] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  const handleToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleAddNew = () => {
    if (newTagName.trim() && onAddNewTag) {
      const newTag: TagItem = {
        id: `tag-${Date.now()}`,
        name: newTagName.trim(),
        color: defaultColors[allTags.length % defaultColors.length],
        count: 0,
      };
      onAddNewTag(newTag);
      onTagsChange([...selectedTagIds, newTag.id]);
      setNewTagName("");
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 items-center">
        {selectedTags.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="text-xs gap-1 pr-1"
          >
            <div className={cn("w-2 h-2 rounded-full", tag.color)} />
            {tag.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(tag.id);
              }}
              className="hover:bg-muted rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            setShowSelector(!showSelector);
          }}
        >
          <Plus className="h-3 w-3 mr-1" />
          {t("tagManager.addTag")}
        </Button>
      </div>

      {showSelector && (
        <div className="absolute top-full left-0 mt-2 z-50 w-64 p-3 rounded-lg border border-border bg-popover shadow-lg">
          <div className="flex gap-2 mb-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={t("tagManager.newTagPlaceholder")}
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNew();
              }}
            />
            <Button size="sm" className="h-8" onClick={handleAddNew}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {allTags.map((tag) => (
              <div
                key={tag.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedTagIds.includes(tag.id) && "bg-primary/10"
                )}
                onClick={() => handleToggle(tag.id)}
              >
                <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                <span className="text-sm flex-1">{tag.name}</span>
                {selectedTagIds.includes(tag.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 h-7 text-xs"
            onClick={() => setShowSelector(false)}
          >
            {t("common.close")}
          </Button>
        </div>
      )}
    </div>
  );
}
