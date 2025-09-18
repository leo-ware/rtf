import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listArticles = query({
    args: {
        limit: v.optional(v.number()),
        publishedOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 50;
        const publishedOnly = args.publishedOnly ?? true;

        const articles = publishedOnly
            ? await ctx.db
                .query("articles")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .take(limit)
            : await ctx.db
                .query("articles")
                .order("desc")
                .take(limit);

        // Get author information for each article
        const articlesWithAuthors = await Promise.all(
            articles.map(async (article) => {
                const author = await ctx.db.get(article.authorId);
                return {
                    ...article,
                    author: author ? {
                        id: author._id,
                        email: author.email,
                        name: author.name ?? author.email
                    } : null,
                };
            })
        );

        return articlesWithAuthors;
    },
});

export const getArticle = query({
    args: { id: v.id("articles") },
    handler: async (ctx, args) => {
        const article = await ctx.db.get(args.id);
        if (!article) {
            return null;
        }

        const author = await ctx.db.get(article.authorId);
        return {
            ...article,
            author: author ? {
                id: author._id,
                email: author.email,
                name: author.name ?? author.email
            } : null,
        };
    },
});

export const getArticleBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const article = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!article) {
            return null;
        }

        const author = await ctx.db.get(article.authorId);
        return {
            ...article,
            author: author ? {
                id: author._id,
                email: author.email,
                name: author.name ?? author.email
            } : null,
        };
    },
});

// Helper function to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim(); // Remove leading/trailing whitespace
}

export const createArticle = mutation({
    args: {
        title: v.string(),
        slug: v.optional(v.string()),
        content: v.string(),
        excerpt: v.string(),
        imageUrl: v.optional(v.string()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create articles");
        }

        // Generate slug from title if not provided
        const slug = args.slug || generateSlug(args.title);

        // Check if slug already exists
        const existingArticle = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existingArticle) {
            throw new Error("An article with this slug already exists");
        }

        const now = Date.now();

        const articleId = await ctx.db.insert("articles", {
            title: args.title,
            slug,
            content: args.content,
            excerpt: args.excerpt,
            imageUrl: args.imageUrl,
            authorId: userId,
            published: args.published ?? false,
            publishedAt: args.published ? now : undefined,
        });

        return articleId;
    },
});

export const updateArticle = mutation({
    args: {
        id: v.id("articles"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update articles");
        }

        const existingArticle = await ctx.db.get(args.id);
        if (!existingArticle) {
            throw new Error("Article not found");
        }

        // Check if user is the author
        if (existingArticle.authorId !== userId) {
            throw new Error("Only the author can edit this article");
        }

        const updateData: any = {};
        if (args.title !== undefined) updateData.title = args.title;
        if (args.content !== undefined) updateData.content = args.content;
        if (args.excerpt !== undefined) updateData.excerpt = args.excerpt;
        if (args.imageUrl !== undefined) updateData.imageUrl = args.imageUrl;

        // Handle slug update
        if (args.slug !== undefined) {
            // Check if new slug already exists (excluding current article)
            const existingSlugArticle = await ctx.db
                .query("articles")
                .withIndex("by_slug", (q) => q.eq("slug", args.slug!))
                .first();

            if (existingSlugArticle && existingSlugArticle._id !== args.id) {
                throw new Error("An article with this slug already exists");
            }
            updateData.slug = args.slug;
        }

        // Handle publishing status
        if (args.published !== undefined) {
            updateData.published = args.published;
            if (args.published && !existingArticle.published) {
                // Article is being published for the first time
                updateData.publishedAt = Date.now();
            } else if (!args.published) {
                // Article is being unpublished
                updateData.publishedAt = undefined;
            }
        }

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deleteArticle = mutation({
    args: {
        id: v.id("articles"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete articles");
        }

        const article = await ctx.db.get(args.id);
        if (!article) {
            throw new Error("Article not found");
        }

        // Check if user is the author
        if (article.authorId !== userId) {
            throw new Error("Only the author can delete this article");
        }

        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const listUserArticles = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const limit = args.limit ?? 50;

        const articles = await ctx.db
            .query("articles")
            .withIndex("by_author", (q) => q.eq("authorId", userId))
            .order("desc")
            .take(limit);

        return articles;
    },
});