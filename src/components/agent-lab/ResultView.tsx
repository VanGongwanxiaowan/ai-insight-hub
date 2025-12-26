import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileText, Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ResultViewProps {
  result: string | null;
}

export function ResultView({ result }: ResultViewProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast({
      title: t("common.copied"),
      description: t("agentLab.result.title"),
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "research-report.md";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: t("common.download"),
      description: t("agentLab.result.title"),
    });
  };

  if (!result) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-background/50 border-t border-border">
        <FileText className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-sm">{t("agentLab.result.noResult")}</p>
        <p className="text-xs mt-1 opacity-60">
          {t("agentLab.result.noResultHint")}
        </p>
      </div>
    );
  }

  return (
    <div className="h-[300px] flex flex-col bg-background/50 border-t border-border">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-xs text-muted-foreground font-medium">
          {t("agentLab.result.title")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 prose prose-sm prose-invert max-w-none">
          <div
            className="text-foreground/90"
            dangerouslySetInnerHTML={{
              __html: result
                .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-foreground mt-0 mb-4">$1</h1>')
                .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-foreground mt-6 mb-3">$1</h2>')
                .replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-foreground mt-4 mb-2">$1</h3>')
                .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                .replace(/\n\n/g, '</p><p class="mb-3 text-muted-foreground">')
                .replace(/^\| (.+) \|$/gm, (match) => {
                  const cells = match.slice(1, -1).split('|').map(c => c.trim());
                  if (cells.every(c => c.match(/^[-:]+$/))) {
                    return '';
                  }
                  const isHeader = match.includes('Method') || match.includes('方法') || match.includes('---');
                  const tag = isHeader ? 'th' : 'td';
                  const className = isHeader 
                    ? 'px-3 py-2 text-left text-xs font-medium text-foreground bg-secondary/50'
                    : 'px-3 py-2 text-xs text-muted-foreground border-t border-border';
                  return `<tr>${cells.map(c => `<${tag} class="${className}">${c}</${tag}>`).join('')}</tr>`;
                })
                .replace(/(<tr>.*<\/tr>\s*)+/g, '<table class="w-full border border-border rounded-lg overflow-hidden mb-4"><tbody>$&</tbody></table>')
                .replace(/^- (.+)$/gm, '<li class="text-muted-foreground ml-4">$1</li>')
                .replace(/---/g, '<hr class="border-border my-4" />')
                .replace(/\*(.+?)\*/g, '<em class="text-muted-foreground">$1</em>')
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
