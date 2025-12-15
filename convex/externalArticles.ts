import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import ExternalArticleManager from "./models/externalArticleManager";
import { paginationOptsValidator } from "convex/server";

export const listExternalArticles = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await ExternalArticleManager.list(ctx, args);
    },
});

export const getExternalArticle = query({
    args: { id: v.id("externalArticles") },
    handler: async (ctx, args) => {
        const manager = new ExternalArticleManager(args.id);
        return await manager.get(ctx);
    },
});

export const getExternalArticleLink = query({
    args: { id: v.id("externalArticles") },
    handler: async (ctx, args) => {
        const externalArticle = await ctx.db.get(args.id);
        if (!externalArticle) {
            return null;
        }
        return externalArticle.link;
    },
});

export const createExternalArticle = mutation({
    args: {
        link: v.string(),
        title: v.string(),
        imageId: v.id("images"),
        blurb: v.string(),
        organization: v.string(),
        date: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const manager = await ExternalArticleManager.create(ctx, args);
        return manager.id;
    },
});

export const updateExternalArticle = mutation({
    args: {
        id: v.id("externalArticles"),
        link: v.optional(v.string()),
        title: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        blurb: v.optional(v.string()),
        organization: v.optional(v.string()),
        date: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const manager = new ExternalArticleManager(args.id);
        await manager.update(ctx, args);
        return manager.id;
    },
});

export const deleteExternalArticle = mutation({
    args: {
        id: v.id("externalArticles"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const manager = new ExternalArticleManager(args.id);
        await manager.delete(ctx);
        return manager.id;
    },
});