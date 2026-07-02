import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const chatRouter = router({
  sendMessage: protectedProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `You are a creative writing assistant helping an author develop their novel. Your role is to:
1. Listen to the author's ideas, scenes, character descriptions, or plot points
2. Ask clarifying questions to better understand their vision
3. Generate detailed, vivid prose based on their input
4. Help develop characters, scenes, dialogue, and plot elements
5. Provide suggestions for improvement and deeper exploration

When the author asks you to write a scene, character description, or other content, provide well-crafted literary prose suitable for a novel. Keep responses engaging, detailed, and true to the author's vision.`;

      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          { role: "system", content: systemPrompt },
          ...input.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ],
      });

      const content = response.choices[0]?.message.content;
      if (!content) {
        throw new Error("No response from Claude");
      }

      return {
        message: content,
      };
    }),
});
