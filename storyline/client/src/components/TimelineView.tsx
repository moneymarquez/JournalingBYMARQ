import { Entry } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TimelineViewProps {
  entries: Entry[];
}

export default function TimelineView({ entries }: TimelineViewProps) {
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

  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Timeline</h1>

        {sortedEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No entries yet</p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-border" />

            {/* Timeline items */}
            <div className="space-y-8">
              {sortedEntries.map((entry, index) => (
                <div key={entry.id} className="relative pl-20">
                  {/* Dot */}
                  <div
                    className={`absolute left-0 top-2 w-4 h-4 rounded-full border-4 border-background ${getCategoryColor(
                      entry.category
                    )}`}
                  />

                  {/* Content */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {entry.isPinned && <span className="text-lg">📌</span>}
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{entry.category}</p>
                        <p className="text-sm leading-relaxed line-clamp-3">{entry.content}</p>
                        {entry.tags && JSON.parse(entry.tags).length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {JSON.parse(entry.tags).map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{entry.wordCount} words</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
