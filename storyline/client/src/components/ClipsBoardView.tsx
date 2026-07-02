import { Clip, Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ClipsBoardViewProps {
  clips: Clip[];
  entries: Entry[];
  onClipDeleted: () => void;
}

export default function ClipsBoardView({ clips, entries, onClipDeleted }: ClipsBoardViewProps) {
  const deleteMutation = trpc.clips.delete.useMutation();

  const handleDeleteClip = async (clipId: number) => {
    try {
      await deleteMutation.mutateAsync({ id: clipId });
      onClipDeleted();
      toast.success("Clip removed");
    } catch (error) {
      toast.error("Failed to remove clip");
    }
  };

  const getEntryTitle = (entryId: number) => {
    return entries.find((e) => e.id === entryId)?.title || "Unknown Entry";
  };

  return (
    <div className="flex-1 bg-background p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Clips Board</h1>
        <p className="text-muted-foreground mb-8">Saved snippets from your entries</p>

        {clips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No clips yet</p>
            <p className="text-sm text-muted-foreground">
              Save 120-character snippets from your entries to build a collection of memorable passages.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clips.map((clip) => (
              <div key={clip.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">From: {getEntryTitle(clip.entryId)}</p>
                    <p className="text-base leading-relaxed mb-4">{clip.snippet}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(clip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClip(clip.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
