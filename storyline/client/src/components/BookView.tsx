import { useState, useMemo } from "react";
import { Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, Download } from "lucide-react";
import { toast } from "sonner";

interface BookViewProps {
  entries: Entry[];
}

type SortOrder = "chronological" | "section" | "category" | "custom";

const CATEGORY_COLORS: Record<string, string> = {
  Character: "text-purple-600",
  Plot: "text-orange-600",
  Setting: "text-green-600",
  Dialogue: "text-yellow-600",
  Theme: "text-pink-600",
  Research: "text-blue-600",
};

export default function BookView({ entries }: BookViewProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("chronological");
  const [showMetadata, setShowMetadata] = useState(true);

  // Sort entries based on selected order
  const sortedEntries = useMemo(() => {
    const sorted = [...entries];

    switch (sortOrder) {
      case "chronological":
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      case "section":
        return sorted.sort((a, b) => {
          if (!a.section || !b.section) return 0;
          return a.section.localeCompare(b.section);
        });

      case "category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));

      case "custom":
        // For custom, we'd need to implement drag-and-drop or manual ordering
        // For now, return in creation order
        return sorted.sort((a, b) => a.id - b.id);

      default:
        return sorted;
    }
  }, [entries, sortOrder]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Create a markdown version of the book
    let markdown = "# Complete Book\n\n";

    sortedEntries.forEach((entry) => {
      markdown += `## ${entry.title}\n\n`;
      if (showMetadata) {
        markdown += `**Category:** ${entry.category} | **Date:** ${new Date(entry.createdAt).toLocaleDateString()}\n\n`;
      }
      markdown += `${entry.content}\n\n---\n\n`;
    });

    // Create download link
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown));
    element.setAttribute("download", "storyline-book.md");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Book exported as Markdown");
  };

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 text-4xl">📖</div>
          <p className="text-foreground">No entries yet. Create some entries to view your book.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Header with controls */}
      <div className="border-b border-border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">📖 Your Book</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm" variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleExport} size="sm" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sort By</label>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chronological">Chronological (Date Created)</SelectItem>
                <SelectItem value="section">By Section/Chapter</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
                <SelectItem value="custom">Custom Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMetadata}
                onChange={(e) => setShowMetadata(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">Show metadata</span>
            </label>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {sortedEntries.length} entries • {sortedEntries.reduce((sum, e) => sum + e.wordCount, 0).toLocaleString()} words
        </div>
      </div>

      {/* Book content */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#FAF7F2]">
        <div className="max-w-3xl mx-auto space-y-8 print:space-y-12">
          {/* Title page */}
          <div className="text-center py-12 print:py-20">
            <h1 className="text-4xl font-bold font-georgia text-accent mb-4">Your Novel</h1>
            <p className="text-lg text-muted-foreground">A collection of your story entries</p>
          </div>

          <div className="print:page-break-after"></div>

          {/* Table of contents */}
          <div className="space-y-4 print:page-break-after">
            <h2 className="text-2xl font-bold font-georgia text-accent">Table of Contents</h2>
            <div className="space-y-2">
              {sortedEntries.map((entry, idx) => (
                <div key={entry.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{entry.title}</span>
                  <span className="text-muted-foreground">{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="print:page-break-after"></div>

          {/* Content */}
          {sortedEntries.map((entry, idx) => (
            <div key={entry.id} className="space-y-4 print:page-break-after">
              <div>
                <h2 className="text-2xl font-bold font-georgia text-accent mb-2">{entry.title}</h2>
                {showMetadata && (
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className={`font-medium ${CATEGORY_COLORS[entry.category]}`}>{entry.category}</span>
                    {entry.section && <span>{entry.section}</span>}
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    <span>{entry.wordCount} words</span>
                  </div>
                )}
              </div>
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
