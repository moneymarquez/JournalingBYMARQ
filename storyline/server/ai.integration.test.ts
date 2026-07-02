import { describe, it, expect } from "vitest";
import { invokeLLM } from "./_core/llm";

describe("AI Integration - Claude API", () => {
  it(
    "should successfully call Claude API for text generation",
    async () => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Respond concisely.",
          },
          {
            role: "user",
            content: "Say 'Hello, Storyline!' and nothing else.",
          },
        ],
      });

      expect(response).toBeDefined();
      expect(response.choices).toBeDefined();
      expect(response.choices.length).toBeGreaterThan(0);
      expect(response.choices[0]?.message).toBeDefined();
      expect(response.choices[0]?.message.content).toBeDefined();
      expect(typeof response.choices[0]?.message.content).toBe("string");
      expect(response.choices[0]?.message.content.length).toBeGreaterThan(0);
    },
    { timeout: 30000 }
  );

  it(
    "should handle creative writing prompts",
    async () => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a creative writing assistant. Provide vivid, engaging responses.",
          },
          {
            role: "user",
            content:
              "In one sentence, describe a mysterious letter discovered in an attic.",
          },
        ],
      });

      expect(response.choices[0]?.message.content).toBeDefined();
      expect(response.choices[0]?.message.content.length).toBeGreaterThan(10);
    },
    { timeout: 30000 }
  );
});
