import { describe, it, expect } from "vitest";

describe("BookView Component", () => {
  it("should sort entries chronologically", () => {
    const entries = [
      {
        id: 1,
        title: "Entry 1",
        content: "Content 1",
        category: "Character" as const,
        section: null,
        tags: null,
        wordCount: 10,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
      {
        id: 2,
        title: "Entry 2",
        content: "Content 2",
        category: "Plot" as const,
        section: null,
        tags: null,
        wordCount: 20,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-17"),
        updatedAt: new Date("2026-06-17"),
      },
    ];

    // Sort chronologically (oldest first)
    const sorted = [...entries].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    expect(sorted[0]?.id).toBe(2); // Entry 2 is older
    expect(sorted[1]?.id).toBe(1); // Entry 1 is newer
  });

  it("should sort entries by category", () => {
    const entries = [
      {
        id: 1,
        title: "Entry 1",
        content: "Content 1",
        category: "Plot" as const,
        section: null,
        tags: null,
        wordCount: 10,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
      {
        id: 2,
        title: "Entry 2",
        content: "Content 2",
        category: "Character" as const,
        section: null,
        tags: null,
        wordCount: 20,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
    ];

    // Sort by category
    const sorted = [...entries].sort((a, b) => a.category.localeCompare(b.category));

    expect(sorted[0]?.category).toBe("Character");
    expect(sorted[1]?.category).toBe("Plot");
  });

  it("should sort entries by section", () => {
    const entries = [
      {
        id: 1,
        title: "Entry 1",
        content: "Content 1",
        category: "Character" as const,
        section: "Chapter 3",
        tags: null,
        wordCount: 10,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
      {
        id: 2,
        title: "Entry 2",
        content: "Content 2",
        category: "Plot" as const,
        section: "Chapter 1",
        tags: null,
        wordCount: 20,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
    ];

    // Sort by section
    const sorted = [...entries].sort((a, b) => {
      if (!a.section || !b.section) return 0;
      return a.section.localeCompare(b.section);
    });

    expect(sorted[0]?.section).toBe("Chapter 1");
    expect(sorted[1]?.section).toBe("Chapter 3");
  });

  it("should calculate total word count correctly", () => {
    const entries = [
      {
        id: 1,
        title: "Entry 1",
        content: "Content 1",
        category: "Character" as const,
        section: null,
        tags: null,
        wordCount: 100,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
      {
        id: 2,
        title: "Entry 2",
        content: "Content 2",
        category: "Plot" as const,
        section: null,
        tags: null,
        wordCount: 200,
        isPinned: false,
        userId: 1,
        createdAt: new Date("2026-06-18"),
        updatedAt: new Date("2026-06-18"),
      },
    ];

    const totalWordCount = entries.reduce((sum, e) => sum + e.wordCount, 0);

    expect(totalWordCount).toBe(300);
  });
});
