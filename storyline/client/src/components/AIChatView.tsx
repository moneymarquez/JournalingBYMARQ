import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send, Save } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatViewProps {
  onEntrySaved?: () => void;
}

export default function AIChatView({ onEntrySaved }: AIChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState("scene");
  const [entryTitle, setEntryTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Character");

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const createEntryMutation = trpc.entries.create.useMutation();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        messages: [...messages, userMessage],
      });

      const assistantContent =
        typeof response.message === "string" ? response.message : JSON.stringify(response.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (error) {
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsEntry = async () => {
    if (!messages.length || messages[messages.length - 1].role !== "assistant") {
      toast.error("No AI response to save");
      return;
    }

    if (!entryTitle.trim()) {
      toast.error("Please enter a title for the entry");
      return;
    }

    const lastMessage = messages[messages.length - 1].content;
    const wordCount = lastMessage.split(/\s+/).length;

    try {
      await createEntryMutation.mutateAsync({
        title: entryTitle,
        content: lastMessage,
        category: selectedCategory as any,
        section: undefined,
        tags: [contentType],
      });

      toast.success("Entry saved successfully!");
      setMessages([]);
      setEntryTitle("");
      setInputValue("");
      onEntrySaved?.();
    } catch (error) {
      toast.error("Failed to save entry");
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-4">
        <h2 className="text-lg font-semibold text-foreground">✨ AI Chat</h2>
        <p className="text-sm text-muted-foreground">Chat with Claude to generate content for your entries</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div className="mb-2 text-4xl">✨</div>
              <p className="text-foreground">Start a conversation to generate content</p>
              <p className="text-sm text-muted-foreground">Describe scenes, characters, dialogue, or plot ideas</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-md p-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-card text-foreground border border-border"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </Card>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-card p-3 border border-border">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Claude is thinking...</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Save Section */}
      {messages.length > 0 && messages[messages.length - 1].role === "assistant" && (
        <div className="border-t border-border bg-card p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Entry Title</label>
            <Input
              placeholder="Give this entry a title..."
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background">
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scene">Scene</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="dialogue">Dialogue</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSaveAsEntry}
            disabled={createEntryMutation.isPending || !entryTitle.trim()}
            className="w-full gap-2"
          >
            <Save className="h-4 w-4" />
            Save as Entry
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-card p-4 space-y-2">
        <div className="flex gap-2">
          <Textarea
            placeholder="Describe a scene, character, dialogue, or plot idea..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSendMessage();
              }
            }}
            className="min-h-20 resize-none bg-background"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="h-20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Press Ctrl+Enter to send</p>
      </div>
    </div>
  );
}
