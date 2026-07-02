import { useState, useMemo } from "react";
import { Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AISidePanel from "./AISidePanel";

interface DetailPanelProps {
  entry: Entry;
  onEntryUpdate: () => void;
  allEntries?: Entry[];
}

export default function DetailPanel({ entry, onEntryUpdate, allEntries = [] }: DetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [editData, setEditData] = useState({
    title: entry.title,
    content: entry.content,
    category: entry.category,
    section: entry.section || "",
    tags: entry.tags ? JSON.parse(entry.tags) : [],
  });
  const [newTag, setNewTag] = useState("");

  const updateMutation = trpc.entries.update.useMutation();
  const deleteMutation = trpc.entries.delete.useMutation();
  const clipMutation = trpc.clips.create.useMutation();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: entry.id,
        ...editData,
      });
      setIsEditing(false);
      onEntryUpdate();
      toast.success("Entry saved");
    } catch (error) {
      toast.error("Failed to save entry");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
      onEntryUpdate();
      toast.success("Entry deleted");
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const handlePin = async () => {
    try {
      await updateMutation.mutateAsync({
        id: entry.id,
        isPinned: !entry.isPinned,
      });
      onEntryUpdate();
      toast.success(entry.isPinned ? "Entry unpinned" : "Entry pinned");
    } catch (error) {
      toast.error("Failed to update entry");
    }
  };

  const handleClip = async () => {
    const snippet = editData.content.substring(0, 120);
    try {
      await clipMutation.mutateAsync({
        entryId: entry.id,
        snippet,
      });
      toast.success("Clipped to Clips Board");
    } catch (error) {
      toast.error("Failed to clip entry");
    }
  };

  const handleAddTag = () => {
    if (newTag && !editData.tags.includes(newTag)) {
      setEditData({
        ...editData,
        tags: [...editData.tags, newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditData({
      ...editData,
      tags: editData.tags.filter((t: string) => t !== tag),
    });
  };

  // Find related entries (same tags)
  const relatedEntries = useMemo(() => {
    const entryTags = entry.tags ? JSON.parse(entry.tags) : [];
    if (entryTags.length === 0) return [];
    return allEntries.filter(
      (e) =>
        e.id !== entry.id &&
        e.tags &&
        JSON.parse(e.tags).some((tag: string) => entryTags.includes(tag))
    );
  }, [entry, allEntries]);

  return (
    <div className="flex-1 bg-background border-l border-border flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">{isEditing ? "Edit Entry" : "Entry Details"}</h2>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button variant="outline" size="sm" onClick={handlePin}>
                  {entry.isPinned ? "📌 Unpin" : "📌 Pin"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClip}>
                  Clip to Clips Board
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowAIPanel(true)}>
                  ✨ Spice It Up
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isEditing ? (
            <>
              {/* Edit mode */}
              <div>
                <label className="text-sm font-semibold block mb-2">Title</label>
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Category</label>
                <Select
                  value={editData.category}
                  onValueChange={(value) => setEditData({ ...editData, category: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Character">Character</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Setting">Setting</SelectItem>
                    <SelectItem value="Dialogue">Dialogue</SelectItem>
                    <SelectItem value="Theme">Theme</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Section</label>
                <Input
                  value={editData.section}
                  onChange={(e) => setEditData({ ...editData, section: e.target.value })}
                  placeholder="e.g., Chapter 1"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Content</label>
                <Textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  className="min-h-64"
                />
              </div>
            </>
          ) : (
            <>
              {/* View mode */}
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Title</h3>
                <p className="text-lg font-semibold">{entry.title}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Category</h3>
                  <p className="font-medium">{entry.category}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Section</h3>
                  <p className="font-medium">{entry.section || "—"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags && JSON.parse(entry.tags).length > 0 ? (
                    JSON.parse(entry.tags).map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tags</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Word Count</h3>
                <p className="text-lg font-semibold">{entry.wordCount}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Created</h3>
                <p className="text-sm">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Content</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.content}</p>
              </div>

              {relatedEntries.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-2">Related Entries</h3>
                    <div className="space-y-2">
                      {relatedEntries.map((related) => (
                        <div key={related.id} className="p-2 rounded-lg bg-muted text-sm">
                          <p className="font-semibold">{related.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {related.content.substring(0, 60)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* AI Side Panel */}
      {showAIPanel && (
        <AISidePanel entryContent={editData.content || entry.content} onClose={() => setShowAIPanel(false)} />
      )}
    </div>
  );
}
