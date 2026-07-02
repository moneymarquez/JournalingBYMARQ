import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getUserEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
  getUserClips,
  createClip,
  deleteClip,
} from "./db";
import { aiRouter } from "./aiRouter";
import { chatRouter } from "./chatRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  entries: router({
    list: protectedProcedure.query(({ ctx }) => getUserEntries(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ ctx, input }) => getEntryById(input.id, ctx.user.id)),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          content: z.string(),
          category: z.enum(["Character", "Plot", "Setting", "Dialogue", "Theme", "Research"]),
          section: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const wordCount = input.content.split(/\s+/).filter((w) => w.length > 0).length;
        return createEntry({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          category: input.category,
          section: input.section,
          tags: input.tags ? JSON.stringify(input.tags) : null,
          wordCount,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          category: z.enum(["Character", "Plot", "Setting", "Dialogue", "Theme", "Research"]).optional(),
          section: z.string().optional(),
          tags: z.array(z.string()).optional(),
          isPinned: z.boolean().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const { id, ...data } = input;
        const wordCount = data.content
          ? data.content.split(/\s+/).filter((w) => w.length > 0).length
          : undefined;
        return updateEntry(id, ctx.user.id, {
          ...data,
          tags: data.tags ? JSON.stringify(data.tags) : undefined,
          wordCount,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteEntry(input.id, ctx.user.id)),
  }),

  clips: router({
    list: protectedProcedure.query(({ ctx }) => getUserClips(ctx.user.id)),
    create: protectedProcedure
      .input(
        z.object({
          entryId: z.number(),
          snippet: z.string().max(120),
        })
      )
      .mutation(({ ctx, input }) =>
        createClip({
          userId: ctx.user.id,
          entryId: input.entryId,
          snippet: input.snippet,
        })
      ),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ ctx, input }) => deleteClip(input.id, ctx.user.id)),
  }),

  ai: aiRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
