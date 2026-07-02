export type Category = "Character" | "Plot" | "Setting" | "Dialogue" | "Theme" | "Research";

export interface Entry {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: Category;
  section?: string | null;
  tags: string | null;
  wordCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clip {
  id: number;
  userId: number;
  entryId: number;
  snippet: string;
  createdAt: Date;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Character: "purple",
  Plot: "orange",
  Setting: "green",
  Dialogue: "yellow",
  Theme: "pink",
  Research: "blue",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Character: "👤",
  Plot: "📖",
  Setting: "🏞️",
  Dialogue: "💬",
  Theme: "✨",
  Research: "🔍",
};
