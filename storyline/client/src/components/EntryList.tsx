import { Entry, CATEGORY_COLORS } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EntryListProps {
  entries: Entry[];
  selectedEntryId: number | null;
  onSelectEntry: (id: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[];
  isLoading: boolean;
  onEntryCreated?: () => void;
}

export default function EntryList({
  entries,
  selectedEntryId,
  onSelectEntry,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  allTags,
  isLoading,
  onEntryCreated,
}: EntryListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const createEntryMutation = trpc.entries.create.useMutation();

  const handleCreateEntry = async () => {
    try {
      await createEntryMutation.mutateAsync({
        title: "New Entry",
        content: "",
        category: "Character",
        tags: [],
      });
      toast.success("Entry created");
      onEntryCreated?.();
    } catch (error) {
      toast.error("Failed to create entry");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Character: "bg-purple-600",
      Plot: "bg-orange-600",
      Setting: "bg-green-600",
      Dialogue: "bg-yellow-600",
      Theme: "bg-pink-600",
      Research: "bg-blue-600",
    };
    return colors[category] || "bg-gray-600";
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreateEntry} disabled={isCreating}>
            +
          </Button>
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    onTagsChange(selectedTags.filter((t) => t !== tag));
                  } else {
                    onTagsChange([...selectedTags, tag]);
                  }
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No entries found</div>
        ) : (
          <div className="space-y-2 p-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedEntryId === entry.id
                    ? "bg-yellow-100 text-gray-950 border-yellow-400"
                    : "bg-white text-gray-950 border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Category dot */}
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getCategoryColor(entry.category)}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {entry.isPinned && <span className="text-lg">📌</span>}
                      <h3 className="font-semibold text-sm truncate text-gray-950 font-bold">{entry.title}</h3>
                    </div>
                    <p className="text-xs text-gray-800 line-clamp-2 mt-1">
                      {entry.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-700 font-medium">
                      <span>{entry.wordCount} words</span>
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
