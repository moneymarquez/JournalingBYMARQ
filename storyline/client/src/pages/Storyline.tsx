import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import EntryList from "@/components/EntryList";
import DetailPanel from "@/components/DetailPanel";
import TimelineView from "@/components/TimelineView";
import ClipsBoardView from "@/components/ClipsBoardView";
import ProgressView from "@/components/ProgressView";
import AIChatView from "@/components/AIChatView";
import BookView from "@/components/BookView";
import { Entry } from "@/types";

type ViewType = "all" | "timeline" | "clips" | "progress" | "chat" | "book";

export default function Storyline() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("all");
  const handleViewChange = (view: string) => setCurrentView(view as ViewType);
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Fetch entries - only when authenticated
  const { data: entries = [], isLoading: entriesLoading } = trpc.entries.list.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  });
  const { data: clips = [] } = trpc.clips.list.useQuery(undefined, {
    enabled: isAuthenticated && !authLoading,
  });
  const utils = trpc.useUtils();

  const handleRefresh = () => {
    utils.entries.list.invalidate();
    utils.clips.list.invalidate();
  };

  // Get selected entry
  const selectedEntry = useMemo(
    () => entries.find((e) => e.id === selectedEntryId),
    [entries, selectedEntryId]
  );

  // Filter entries based on search, tags, category, and section
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query) ||
          (entry.tags && JSON.parse(entry.tags).some((tag: string) => tag.toLowerCase().includes(query)));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && entry.category !== selectedCategory) return false;

      // Section filter
      if (selectedSection && entry.section !== selectedSection) return false;

      // Tags filter
      if (selectedTags.length > 0 && entry.tags) {
        const entryTags = JSON.parse(entry.tags);
        const hasAllTags = selectedTags.every((tag) => entryTags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [entries, searchQuery, selectedCategory, selectedSection, selectedTags]);

  // Sort entries: pinned first, then by date
  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredEntries]);

  // Get all unique tags and sections
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach((entry) => {
      if (entry.tags) {
        JSON.parse(entry.tags).forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [entries]);

  const allSections = useMemo(() => {
    const sections = new Set<string>();
    entries.forEach((entry) => {
      if (entry.section) sections.add(entry.section);
    });
    return Array.from(sections).sort();
  }, [entries]);

  // Calculate total word count
  const totalWordCount = useMemo(() => {
    return entries.reduce((sum, entry) => sum + entry.wordCount, 0);
  }, [entries]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        allSections={allSections}
        totalWordCount={totalWordCount}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Middle panel - Entry list */}
        {currentView === "all" && (
          <>
            <EntryList
              entries={sortedEntries}
              selectedEntryId={selectedEntryId}
              onSelectEntry={setSelectedEntryId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              allTags={allTags}
              isLoading={entriesLoading}
              onEntryCreated={handleRefresh}
            />

            {/* Right panel - Detail view */}
            {selectedEntry && (
              <DetailPanel
                entry={selectedEntry}
                onEntryUpdate={handleRefresh}
                allEntries={entries}
              />
            )}
          </>
        )}

        {/* Timeline view */}
        {currentView === "timeline" && <TimelineView entries={sortedEntries} />}

        {/* Clips Board view */}
        {currentView === "clips" && (
          <ClipsBoardView clips={clips} entries={entries} onClipDeleted={handleRefresh} />
        )}

        {/* Progress view */}
        {currentView === "progress" && <ProgressView entries={entries} />}

        {/* AI Chat view */}
        {currentView === "chat" && (
          <AIChatView onEntrySaved={handleRefresh} />
        )}

        {/* Book view */}
        {currentView === "book" && (
          <BookView entries={sortedEntries} />
        )}
      </div>
    </div>
  );
}
