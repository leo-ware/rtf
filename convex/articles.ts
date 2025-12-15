import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import ArticleManager from "./models/articleManager";


export const getArticle = query({
    args: { id: v.id("articles") },
    handler: async (ctx, args) => {
        const manager = new ArticleManager(args.id);
        return await manager.get(ctx);
    },
});

export const getArticleWithRelations = query({
    args: { id: v.id("articles") },
    handler: async (ctx, args) => {
        const manager = new ArticleManager(args.id);
        return await manager.getWithRelations(ctx);
    },
});

export const getArticleBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ArticleManager.getBySlug(ctx, args.slug);
    },
});

export const createArticle = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.optional(v.string()),
        date: v.number(),
        imageId: v.id("images"),
        authorCredit: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const manager = await ArticleManager.create(ctx, args);
        return manager.id;
    },
});

export const updateArticle = mutation({
    args: {
        id: v.id("articles"),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        authorCredit: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const manager = new ArticleManager(args.id);
        await manager.update(ctx, {
            slug: args.slug,
            content: args.content,
            imageId: args.imageId,
            authorCredit: args.authorCredit,
        });
        return manager.id;
    }
});

export const deleteArticle = mutation({
    args: {
        id: v.id("articles"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const manager = new ArticleManager(args.id);
        await manager.delete(ctx);
        return manager.id;
    },
});
