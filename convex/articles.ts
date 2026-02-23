import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import ArticleManager from "./models/articleManager";
import { extractTopicsList } from "./models/articleMetadataManager";


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
        const objWithRelations = await manager.getWithRelations(ctx);
        return objWithRelations
            ? {
                ...objWithRelations,
                articleMetadata: {
                    ...objWithRelations.articleMetadata,
                    topics: extractTopicsList(objWithRelations.articleMetadata),
                },
            } : null
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

export const listPublicSlugs = query({
    args: {},
    returns: v.array(v.string()),
    handler: async (ctx) => {
        // Get all public article metadata
        const publicMetadata = await ctx.db
            .query("articleMetadata")
            .filter((q) => q.eq(q.field("public"), true))
            .filter((q) => q.eq(q.field("isExternal"), false))
            .collect()

        // Get the article IDs from metadata
        const articleIds = publicMetadata
            .map((m) => m.articleId)
            .filter((id): id is NonNullable<typeof id> => id !== undefined)

        // Fetch the articles and return their slugs
        const articles = await Promise.all(
            articleIds.map((id) => ctx.db.get(id))
        )

        return articles
            .filter((a): a is NonNullable<typeof a> => a !== null)
            .map((a) => a.slug)
    },
});

export const checkSlugExists = query({
    args: { slug: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const article = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first()

        if (!article) return false

        // Check if the article is public
        const metadata = await ctx.db.get(article.articleMetadataId)
        return metadata?.public === true
    },
});
