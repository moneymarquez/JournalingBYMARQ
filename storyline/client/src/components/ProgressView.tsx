import { Entry } from "@/types";
import { Progress } from "@/components/ui/progress";

interface ProgressViewProps {
  entries: Entry[];
}

const GOAL_WORD_COUNT = 80000;

export default function ProgressView({ entries }: ProgressViewProps) {
  const totalWordCount = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  const progressPercentage = Math.min((totalWordCount / GOAL_WORD_COUNT) * 100, 100);

  // Count entries per category
  const categoryStats = {
    Character: entries.filter((e) => e.category === "Character").length,
    Plot: entries.filter((e) => e.category === "Plot").length,
    Setting: entries.filter((e) => e.category === "Setting").length,
    Dialogue: entries.filter((e) => e.category === "Dialogue").length,
    Theme: entries.filter((e) => e.category === "Theme").length,
    Research: entries.filter((e) => e.category === "Research").length,
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
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">Track your writing journey toward 80,000 words</p>
        </div>

        {/* Word count section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <div className="flex items-end justify-between mb-2">
              <h2 className="text-lg font-semibold">Total Word Count</h2>
              <p className="text-2xl font-bold text-accent">{totalWordCount.toLocaleString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {totalWordCount >= GOAL_WORD_COUNT
                ? "🎉 Goal reached!"
                : `${(GOAL_WORD_COUNT - totalWordCount).toLocaleString()} words to go`}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress to 80,000 words</span>
              <span className="text-sm font-semibold text-accent">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Entries by Category</h2>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
                    <span className="font-medium">{category}</span>
                  </div>
                  <span className="text-sm font-semibold text-accent">{count}</span>
                </div>
                <Progress value={(count / Math.max(entries.length, 1)) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Entries</p>
            <p className="text-2xl font-bold text-accent">{entries.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm mb-1">Average Entry Length</p>
            <p className="text-2xl font-bold text-accent">
              {entries.length > 0 ? Math.round(totalWordCount / entries.length) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
