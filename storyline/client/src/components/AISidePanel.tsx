import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AISidePanelProps {
  entryContent: string;
  onClose: () => void;
}

type ToolType = "spiceItUp" | "sharpenDialogue" | "suggestTwist" | "expandThis" | "addConflict" | "deepenCharacter";

interface Tool {
  id: ToolType;
  label: string;
  emoji: string;
  description: string;
}

const tools: Tool[] = [
  {
    id: "spiceItUp",
    label: "Spice It Up",
    emoji: "✨",
    description: "Rewrite with more tension and sensory detail",
  },
  {
    id: "sharpenDialogue",
    label: "Sharpen Dialogue",
    emoji: "💬",
    description: "Make dialogue snappier and more natural",
  },
  {
    id: "suggestTwist",
    label: "Suggest a Twist",
    emoji: "🌀",
    description: "3 unexpected plot turns",
  },
  {
    id: "expandThis",
    label: "Expand This",
    emoji: "📖",
    description: "Turn note into full scene draft",
  },
  {
    id: "addConflict",
    label: "Add Conflict",
    emoji: "⚡",
    description: "Ways to raise the stakes",
  },
  {
    id: "deepenCharacter",
    label: "Deepen Character",
    emoji: "🎭",
    description: "Uncover a new character layer",
  },
];

export default function AISidePanel({ entryContent, onClose }: AISidePanelProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(null);
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const spiceItUpMutation = trpc.ai.spiceItUp.useMutation();
  const sharpenDialogueMutation = trpc.ai.sharpenDialogue.useMutation();
  const suggestTwistMutation = trpc.ai.suggestTwist.useMutation();
  const expandThisMutation = trpc.ai.expandThis.useMutation();
  const addConflictMutation = trpc.ai.addConflict.useMutation();
  const deepenCharacterMutation = trpc.ai.deepenCharacter.useMutation();

  const mutations: Record<ToolType, any> = {
    spiceItUp: spiceItUpMutation,
    sharpenDialogue: sharpenDialogueMutation,
    suggestTwist: suggestTwistMutation,
    expandThis: expandThisMutation,
    addConflict: addConflictMutation,
    deepenCharacter: deepenCharacterMutation,
  };

  const handleToolClick = async (toolId: ToolType) => {
    setSelectedTool(toolId);
    setResult("");
    setIsLoading(true);

    try {
      const mutation = mutations[toolId];
      const response = await mutation.mutateAsync({ content: entryContent });
      setResult(response);
    } catch (error) {
      toast.error("Failed to generate content");
      setSelectedTool(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-bold">✨ Spice It Up</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {!selectedTool ? (
          // Tool selection
          <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Choose a writing enhancement tool:
            </p>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{tool.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{tool.label}</p>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : isLoading ? (
          // Loading state
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground">Generating content...</p>
            </div>
          </div>
        ) : (
          // Result display
          <div className="flex-1 flex flex-col p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                {tools.find((t) => t.id === selectedTool)?.emoji}{" "}
                {tools.find((t) => t.id === selectedTool)?.label}
              </p>
              <div className="bg-background p-3 rounded-lg border border-border max-h-64 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleCopyToClipboard} className="flex-1">
                Copy to Clipboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedTool(null);
                  setResult("");
                }}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
