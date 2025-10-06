import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listExternalArticles = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;

        const externalArticles = await ctx.db
            .query("externalArticles")
            .order("desc")
            .take(limit);

        // Get creator information and image for each external article
        const externalArticlesWithDetails = await Promise.all(
            externalArticles.map(async (article) => {
                const creator = await ctx.db.get(article.createdBy);
                const image = article.imageId ? await ctx.db.get(article.imageId) : null;

                return {
                    ...article,
                    creator: creator ? {
                        id: creator._id,
                        email: creator.email,
                        name: creator.name ?? creator.email
                    } : null,
                    image: image ? {
                        id: image._id,
                        fileName: image.fileName,
                        storageId: image.storageId,
                        altText: image.altText,
                    } : null,
                };
            })
        );

        return externalArticlesWithDetails;
    },
});

export const getExternalArticle = query({
    args: { id: v.id("externalArticles") },
    handler: async (ctx, args) => {
        const externalArticle = await ctx.db.get(args.id);
        if (!externalArticle) {
            return null;
        }

        const creator = await ctx.db.get(externalArticle.createdBy);
        const image = externalArticle.imageId ? await ctx.db.get(externalArticle.imageId) : null;

        return {
            ...externalArticle,
            creator: creator ? {
                id: creator._id,
                email: creator.email,
                name: creator.name ?? creator.email
            } : null,
            image: image ? {
                id: image._id,
                fileName: image.fileName,
                storageId: image.storageId,
                altText: image.altText,
            } : null,
        };
    },
});

export const createExternalArticle = mutation({
    args: {
        link: v.string(),
        title: v.string(),
        imageId: v.optional(v.id("images")),
        blurb: v.string(),
        organization: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create external articles");
        }

        // Check if user has any role (authorized, admin, or dev)
        const user = await ctx.db.get(userId);
        if (!user || !user.role) {
            throw new Error("User must have a role to create external articles");
        }

        const now = Date.now();

        const externalArticleId = await ctx.db.insert("externalArticles", {
            link: args.link,
            title: args.title,
            imageId: args.imageId,
            blurb: args.blurb,
            organization: args.organization,
            createdBy: userId,
            createdAt: now,
        });

        return externalArticleId;
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
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update external articles");
        }

        // Check if user has any role (authorized, admin, or dev)
        const user = await ctx.db.get(userId);
        if (!user || !user.role) {
            throw new Error("User must have a role to update external articles");
        }

        const existingArticle = await ctx.db.get(args.id);
        if (!existingArticle) {
            throw new Error("External article not found");
        }

        const updateData: any = {};
        if (args.link !== undefined) updateData.link = args.link;
        if (args.title !== undefined) updateData.title = args.title;
        if (args.imageId !== undefined) updateData.imageId = args.imageId;
        if (args.blurb !== undefined) updateData.blurb = args.blurb;
        if (args.organization !== undefined) updateData.organization = args.organization;

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deleteExternalArticle = mutation({
    args: {
        id: v.id("externalArticles"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete external articles");
        }

        // Check if user has any role (authorized, admin, or dev)
        const user = await ctx.db.get(userId);
        if (!user || !user.role) {
            throw new Error("User must have a role to delete external articles");
        }

        const externalArticle = await ctx.db.get(args.id);
        if (!externalArticle) {
            throw new Error("External article not found");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const listUserExternalArticles = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const limit = args.limit ?? 50;

        const externalArticles = await ctx.db
            .query("externalArticles")
            .withIndex("by_created_by", (q) => q.eq("createdBy", userId))
            .order("desc")
            .take(limit);

        return externalArticles;
    },
});