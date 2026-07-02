import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";

describe("Entries CRUD Operations", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let createdEntryId: number;

  const mockContext = {
    user: {
      id: 1,
      openId: "test-user-crud",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    },
    res: {
      clearCookie: () => {},
    },
  };

  beforeAll(() => {
    caller = appRouter.createCaller(mockContext as any);
  });

  it("should create a new entry", async () => {
    const result = await caller.entries.create({
      title: "Test Entry",
      content: "This is a test entry content",
      category: "Character",
      section: "Chapter 1",
      tags: ["test", "character"],
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe("number");
    expect(result.title).toBe("Test Entry");
    expect(result.content).toBe("This is a test entry content");
    expect(result.category).toBe("Character");
    expect(result.wordCount).toBeGreaterThan(0);

    createdEntryId = result.id as number;
  });

  it("should retrieve the created entry", async () => {
    const result = await caller.entries.get({ id: createdEntryId });

    expect(result).toBeDefined();
    expect(result?.id).toBe(createdEntryId);
    expect(result?.title).toBe("Test Entry");
  });

  it("should list entries for the user", async () => {
    const result = await caller.entries.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((e) => e.id === createdEntryId)).toBe(true);
  });

  it("should update an entry", async () => {
    const result = await caller.entries.update({
      id: createdEntryId,
      title: "Updated Entry Title",
      content: "Updated content with more words added here",
      category: "Plot",
      section: "Chapter 2",
      tags: ["updated", "plot"],
    });

    expect(result.title).toBe("Updated Entry Title");
    expect(result.category).toBe("Plot");
    expect(result.section).toBe("Chapter 2");
  });

  it("should pin an entry", async () => {
    const result = await caller.entries.update({
      id: createdEntryId,
      isPinned: true,
    });

    expect(result.isPinned).toBe(true);
  });

  it("should unpin an entry", async () => {
    const result = await caller.entries.update({
      id: createdEntryId,
      isPinned: false,
    });

    expect(result.isPinned).toBe(false);
  });

  it("should delete an entry", async () => {
    await caller.entries.delete({ id: createdEntryId });

    const result = await caller.entries.get({ id: createdEntryId });
    expect(result).toBeUndefined();
  });
});

describe("Clips CRUD Operations", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let entryId: number;
  let clipId: number;

  const mockContext = {
    user: {
      id: 1,
      openId: "test-user-clips",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "user" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    },
    res: {
      clearCookie: () => {},
    },
  };

  beforeAll(async () => {
    caller = appRouter.createCaller(mockContext as any);

    // Create an entry first
    const entry = await caller.entries.create({
      title: "Entry for Clipping",
      content: "This is a test entry for creating clips",
      category: "Character",
      tags: [],
    });
    entryId = entry.id as number;
  });

  it("should create a clip", async () => {
    const result = await caller.clips.create({
      entryId,
      snippet: "This is a test entry for creating clips",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe("number");
    expect(result.entryId).toBe(entryId);
    expect(result.snippet).toBe("This is a test entry for creating clips");

    clipId = result.id as number;
  });

  it("should list clips for the user", async () => {
    const result = await caller.clips.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.some((c) => c.id === clipId)).toBe(true);
  });

  it("should delete a clip", async () => {
    if (!clipId) {
      expect.fail("clipId not set from previous test");
    }
    await caller.clips.delete({ id: clipId });

    const result = await caller.clips.list();
    expect(result.some((c) => c.id === clipId)).toBe(false);
  });
});
