import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";

describe("AI Router - Claude Integration", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    // Create a mock context with authenticated user
    const mockContext = {
      user: {
        id: 1,
        openId: "test-user",
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

    caller = appRouter.createCaller(mockContext as any);
  });

  it("should call spiceItUp and return non-empty response", async () => {
    const testContent = "She walked into the room. He looked at her.";
    const result = await caller.ai.spiceItUp({ content: testContent });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toBe(testContent); // Should be different from input
  });

  it("should call sharpenDialogue and return non-empty response", async () => {
    const testDialogue = '"Hello," she said. "Hi," he replied.';
    const result = await caller.ai.sharpenDialogue({ content: testDialogue });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should call suggestTwist and return non-empty response", async () => {
    const testPlot = "The detective finds the missing letter in the attic.";
    const result = await caller.ai.suggestTwist({ content: testPlot });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should call expandThis and return non-empty response", async () => {
    const testNote = "Margaret discovers a secret about her past.";
    const result = await caller.ai.expandThis({ content: testNote });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should call addConflict and return non-empty response", async () => {
    const testScene = "The two characters meet for the first time.";
    const result = await caller.ai.addConflict({ content: testScene });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should call deepenCharacter and return non-empty response", async () => {
    const testCharacter = "Margaret is a writer who values independence.";
    const result = await caller.ai.deepenCharacter({ content: testCharacter });
    
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
