import { Category, CATEGORY_COLORS, CATEGORY_ICONS } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedSection: string | null;
  onSectionChange: (section: string | null) => void;
  allSections: string[];
  totalWordCount: number;
}

const categories: Category[] = ["Character", "Plot", "Setting", "Dialogue", "Theme", "Research"];

export default function Sidebar({
  currentView,
  onViewChange,
  selectedCategory,
  onCategoryChange,
  selectedSection,
  onSectionChange,
  allSections,
  totalWordCount,
}: SidebarProps) {
  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, string> = {
      Character: "bg-purple-600",
      Plot: "bg-orange-600",
      Setting: "bg-green-600",
      Dialogue: "bg-yellow-600",
      Theme: "bg-pink-600",
      Research: "bg-blue-600",
    };
    return colors[category];
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <img src="/manus-storage/IMG_0336_bc6ab658.PNG" alt="Storyline Logo" className="w-full h-auto" style={{minHeight: '140px'}} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={currentView === "all" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("all")}
        >
          📚 All Entries
        </Button>
        <Button
          variant={currentView === "timeline" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("timeline")}
        >
          📅 Timeline
        </Button>
        <Button
          variant={currentView === "clips" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("clips")}
        >
          📌 Clips Board
        </Button>
        <Button
          variant={currentView === "progress" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("progress")}
        >
          📊 Progress
        </Button>
        <Button
          variant={currentView === "chat" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("chat")}
        >
          ✨ AI Chat
        </Button>
        <Button
          variant={currentView === "book" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("book")}
        >
          📖 Your Book
        </Button>
      </nav>

      <Separator />

      {/* Section Filter */}
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3">Sections</h3>
        <div className="space-y-2">
          <Button
            variant={selectedSection === null ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => onSectionChange(null)}
          >
            All Sections
          </Button>
          {allSections.map((section) => (
            <Button
              key={section}
              variant={selectedSection === section ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onSectionChange(section === selectedSection ? null : section)}
            >
              {section}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category === selectedCategory ? null : category)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`} />
              <span>{CATEGORY_ICONS[category]} {category}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Word Count */}
      <div className="p-4 border-t border-border">
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Total Words</p>
          <p className="text-2xl font-bold text-accent">{totalWordCount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
