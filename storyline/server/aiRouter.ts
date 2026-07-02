import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const aiRouter = router({
  spiceItUp: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a literary fiction writing assistant. Help writers enhance their work with vivid sensory details, emotional depth, and compelling tension. Keep responses concise and actionable.",
          },
          {
            role: "user",
            content: `Rewrite this passage with more tension and sensory detail. Keep it under 200 words:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),

  sharpenDialogue: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a dialogue expert for literary fiction. Help writers make dialogue snappier, more authentic, and more revealing of character.",
          },
          {
            role: "user",
            content: `Make this dialogue snappier and more natural. Remove exposition and let subtext shine. Keep under 200 words:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),

  suggestTwist: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a plot development expert for literary fiction. Generate unexpected but believable plot turns that deepen character and theme.",
          },
          {
            role: "user",
            content: `Based on this plot note, suggest 3 unexpected plot turns that would complicate the story and deepen character development:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),

  expandThis: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a scene-writing expert for literary fiction. Transform notes into vivid, immersive scene drafts with dialogue, action, and internal monologue.",
          },
          {
            role: "user",
            content: `Turn this note into a full scene draft (300-400 words) with dialogue, action, and sensory details:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),

  addConflict: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a tension and conflict expert for literary fiction. Help writers identify and raise the stakes in their scenes.",
          },
          {
            role: "user",
            content: `Suggest 3-4 ways to add conflict and raise the stakes in this scene or moment:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),

  deepenCharacter: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input }) => {
      const response = await invokeLLM({
        model: "claude-sonnet-4-6",
        messages: [
          {
            role: "system",
            content:
              "You are a character development expert for literary fiction. Help writers uncover hidden layers, contradictions, and growth in their characters.",
          },
          {
            role: "user",
            content: `Based on this character note, suggest 2-3 new layers or contradictions that would deepen this character and make them more compelling:\n\n${input.content}`,
          },
        ],
      });
      return response.choices[0]?.message.content || "";
    }),
});
