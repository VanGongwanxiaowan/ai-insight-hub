import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  MoreHorizontal,
  Trash2,
  Edit3,
  Star,
  StarOff
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  paperId?: string;
  paperTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  tags: string[];
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Transformer架构要点",
    content: "## 核心概念\n\n- Self-attention机制\n- Multi-head attention\n- Positional encoding\n\n> \"Attention is all you need\" - 这篇论文彻底改变了NLP领域",
    paperId: "attention-is-all-you-need",
    paperTitle: "Attention Is All You Need",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-16"),
    starred: true,
    tags: ["LLM", "Architecture"]
  },
  {
    id: "2",
    title: "BERT预训练策略分析",
    content: "## MLM vs CLM\n\n- Masked Language Model的优势\n- 双向上下文理解\n\n## 实验记录\n\n需要进一步研究fine-tuning策略",
    paperId: "bert",
    paperTitle: "BERT: Pre-training of Deep Bidirectional Transformers",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    starred: false,
    tags: ["NLP", "Pre-training"]
  },
  {
    id: "3",
    title: "Diffusion模型数学原理",
    content: "## 前向过程\n\n添加噪声的马尔可夫链\n\n## 逆向过程\n\n学习去噪的神经网络\n\n## 关键公式\n\n待整理...",
    paperId: "diffusion",
    paperTitle: "Denoising Diffusion Probabilistic Models",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
    starred: true,
    tags: ["Image Gen", "Math"]
  },
  {
    id: "4",
    title: "研究思路整理",
    content: "## 待读论文\n\n- [ ] GPT-4技术报告\n- [ ] LLaMA系列\n- [x] CLIP\n\n## 研究方向\n\n多模态学习与推理能力的结合",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-12"),
    starred: false,
    tags: ["Research", "Todo"]
  }
];

export default function Notebook() {
  const { t } = useTranslation();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const filteredNotes = notes.filter(note =>
    searchQuery === "" ||
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const starredNotes = filteredNotes.filter(n => n.starred);
  const recentNotes = filteredNotes.filter(n => !n.starred);

  const toggleStar = (noteId: string) => {
    setNotes(prev => prev.map(n => 
      n.id === noteId ? { ...n, starred: !n.starred } : n
    ));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <div
      className={cn(
        "group p-4 rounded-lg border bg-card/50 hover:bg-card transition-all cursor-pointer",
        selectedNote?.id === note.id && "border-primary/50 bg-primary/5"
      )}
      onClick={() => {
        setSelectedNote(note);
        setIsEditing(false);
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-foreground line-clamp-1">{note.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleStar(note.id); }}>
              {note.starred ? <StarOff className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
              {note.starred ? t("notebook.unstar") : t("notebook.star")}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {note.paperTitle && (
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span className="line-clamp-1">{note.paperTitle}</span>
        </p>
      )}

      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {note.content.replace(/[#*>\[\]`-]/g, '').slice(0, 100)}...
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {note.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{t("notebook.title")}</h1>
                <p className="text-sm text-muted-foreground">{t("notebook.subtitle")}</p>
              </div>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("notebook.newNote")}
            </Button>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("notebook.searchPlaceholder")}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notes List */}
          <div className="lg:col-span-1 space-y-6">
            {starredNotes.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  {t("notebook.starred")}
                </h2>
                <div className="space-y-3">
                  {starredNotes.map(note => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                {t("notebook.allNotes")} ({recentNotes.length})
              </h2>
              <div className="space-y-3">
                {recentNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">{t("notebook.noNotes")}</p>
              </div>
            )}
          </div>

          {/* Note Detail / Editor */}
          <div className="lg:col-span-2">
            {selectedNote ? (
              <div className="border border-border rounded-xl bg-card/50 p-6 sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{selectedNote.title}</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStar(selectedNote.id)}
                    >
                      <Star className={cn(
                        "h-4 w-4",
                        selectedNote.starred && "fill-amber-500 text-amber-500"
                      )} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setEditContent(selectedNote.content);
                      }}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      {isEditing ? t("common.cancel") : t("common.edit")}
                    </Button>
                  </div>
                </div>

                {selectedNote.paperTitle && (
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{t("notebook.linkedPaper")}:</span>
                    <span className="text-sm text-primary">{selectedNote.paperTitle}</span>
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  {selectedNote.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        {t("common.cancel")}
                      </Button>
                      <Button onClick={() => {
                        setNotes(prev => prev.map(n => 
                          n.id === selectedNote.id 
                            ? { ...n, content: editContent, updatedAt: new Date() } 
                            : n
                        ));
                        setSelectedNote({ ...selectedNote, content: editContent });
                        setIsEditing(false);
                      }}>
                        {t("common.save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/80 leading-relaxed">
                      {selectedNote.content}
                    </pre>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                  {t("notebook.lastUpdated")}: {formatDate(selectedNote.updatedAt)}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded-xl p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">{t("notebook.selectNote")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
