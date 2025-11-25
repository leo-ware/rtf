import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getCurrentUserOrThrow } from "./users";
import { Doc } from "./_generated/dataModel";

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

        // Get author and image information for each article
        const articlesWithAuthors = await Promise.all(
            articles.map(async (article) => {
                const author = await ctx.db.get(article.authorId);
                const image = article.imageId ? await ctx.db.get(article.imageId) : null;
                return {
                    ...article,
                    author: author ? {
                        id: author._id,
                        email: author.email,
                        name: author.name ?? author.email
                    } : null,
                    image: image ? {
                        _id: image._id,
                        fileName: image.fileName,
                        originalName: image.originalName,
                        mimeType: image.mimeType,
                        size: image.size,
                        storageId: image.storageId,
                        altText: image.altText,
                        description: image.description,
                        isPublic: image.isPublic,
                        width: image.width,
                        height: image.height,
                        url: await ctx.storage.getUrl(image.storageId)
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
        const image = article.imageId ? await ctx.db.get(article.imageId) : null;
        
        // Get herds information
        const herds = article.herdIds ? 
            await Promise.all(article.herdIds.map(id => ctx.db.get(id))) : 
            []
        const validHerds = herds.filter((h): h is NonNullable<typeof h> => h !== null)
        
        // Get animals information
        const animals = article.animalIds ? 
            await Promise.all(article.animalIds.map(id => ctx.db.get(id))) : 
            []
        const validAnimals = animals.filter((a): a is NonNullable<typeof a> => a !== null)
        
        return {
            ...article,
            author: author ? {
                id: author._id,
                email: author.email,
                name: author.name ?? author.email
            } : null,
            image: image ? {
                _id: image._id,
                fileName: image.fileName,
                originalName: image.originalName,
                mimeType: image.mimeType,
                size: image.size,
                storageId: image.storageId,
                altText: image.altText,
                description: image.description,
                isPublic: image.isPublic,
                width: image.width,
                height: image.height,
                url: await ctx.storage.getUrl(image.storageId)
            } : null,
            herds: validHerds.map(h => ({
                _id: h._id,
                name: h.name,
                slug: h.slug,
            })),
            animals: validAnimals.map(a => ({
                _id: a._id,
                name: a.name,
                slug: a.slug,
            })),
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
        const image = article.imageId ? await ctx.db.get(article.imageId) : null;
        return {
            ...article,
            author: author ? {
                id: author._id,
                email: author.email,
                name: author.name ?? author.email
            } : null,
            image: image ? {
                _id: image._id,
                fileName: image.fileName,
                originalName: image.originalName,
                mimeType: image.mimeType,
                size: image.size,
                storageId: image.storageId,
                altText: image.altText,
                description: image.description,
                isPublic: image.isPublic,
                width: image.width,
                height: image.height,
                url: await ctx.storage.getUrl(image.storageId)
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
        imageId: v.optional(v.id("images")),
        authorCredit: v.optional(v.string()),
        published: v.optional(v.boolean()),
        publishedAt: v.optional(v.number()),
        herdIds: v.optional(v.array(v.id("herds"))),
        animalIds: v.optional(v.array(v.id("animals"))),
        topics: v.optional(v.array(v.union(
            v.literal("conservation"),
            v.literal("sanctuary"),
            v.literal("advocacy"),
            v.literal("education"),
            v.literal("herd-management"),
            v.literal("population-management"),
            v.literal("roundups"),
            v.literal("horse-slaughter"),
            v.literal("spirit")
        ))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
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
            imageId: args.imageId,
            authorId: user._id,
            authorCredit: args.authorCredit || user.name || "Unknown Author",
            published: args.published ?? false,
            publishedAt: args.publishedAt || (args.published ? now : undefined),
            createdAt: now,
            updatedAt: now,
            herdIds: args.herdIds,
            animalIds: args.animalIds,
            topics: args.topics,
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
        imageId: v.optional(v.id("images")),
        authorCredit: v.optional(v.string()),
        published: v.optional(v.boolean()),
        publishedAt: v.optional(v.number()),
        herdIds: v.optional(v.array(v.id("herds"))),
        animalIds: v.optional(v.array(v.id("animals"))),
        topics: v.optional(v.array(v.union(
            v.literal("conservation"),
            v.literal("sanctuary"),
            v.literal("advocacy"),
            v.literal("education"),
            v.literal("herd-management"),
            v.literal("population-management"),
            v.literal("roundups"),
            v.literal("horse-slaughter"),
            v.literal("spirit")
        ))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const existingArticle = await ctx.db.get(args.id);
        if (!existingArticle) {
            throw new Error("Article not found");
        }

        const updateData: any = {};
        if (args.title !== undefined) updateData.title = args.title;
        if (args.content !== undefined) updateData.content = args.content;
        if (args.excerpt !== undefined) updateData.excerpt = args.excerpt;
        if (args.imageId !== undefined) updateData.imageId = args.imageId;
        if (args.authorCredit !== undefined) updateData.authorCredit = args.authorCredit;
        if (args.published !== undefined) updateData.published = args.published;
        if (args.publishedAt !== undefined) updateData.publishedAt = args.publishedAt;
        if (args.herdIds !== undefined) updateData.herdIds = args.herdIds;
        if (args.animalIds !== undefined) updateData.animalIds = args.animalIds;
        if (args.topics !== undefined) updateData.topics = args.topics;

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

        // Always update the updatedAt timestamp
        updateData.updatedAt = Date.now();

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
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

        const article = await ctx.db.get(args.id);
        if (!article) {
            throw new Error("Article not found");
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
        const user = await getCurrentUserOrThrow(ctx)
        if (!user._id) {
            return [];
        }

        const limit = args.limit ?? 50;

        const articles = await ctx.db
            .query("articles")
            .withIndex("by_author", (q) => q.eq("authorId", user._id))
            .order("desc")
            .take(limit);

        return articles;
    },
});

// Helper query to search herds for tag selection
export const searchHerds = query({
    args: {
        searchTerm: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.object({
        _id: v.id("herds"),
        name: v.string(),
        slug: v.string(),
    })),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20
        const herds = await ctx.db
            .query("herds")
            .order("desc")
            .take(limit)
        
        if (!args.searchTerm) {
            return herds.map(h => ({
                _id: h._id,
                name: h.name,
                slug: h.slug,
            }))
        }
        
        const searchLower = args.searchTerm.toLowerCase()
        return herds
            .filter(h => h.name.toLowerCase().includes(searchLower))
            .map(h => ({
                _id: h._id,
                name: h.name,
                slug: h.slug,
            }))
    },
})

// Helper query to search animals for tag selection
export const searchAnimals = query({
    args: {
        searchTerm: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.object({
        _id: v.id("animals"),
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
    })),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20
        const animals = await ctx.db
            .query("animals")
            .order("desc")
            .take(limit)
        
        if (!args.searchTerm) {
            return animals.map(a => ({
                _id: a._id,
                name: a.name,
                slug: a.slug,
                type: a.type,
            }))
        }
        
        const searchLower = args.searchTerm.toLowerCase()
        return animals
            .filter(a => a.name.toLowerCase().includes(searchLower))
            .map(a => ({
                _id: a._id,
                name: a.name,
                slug: a.slug,
                type: a.type,
            }))
    },
})

// Query articles by tags (herds, animals, topics)
export const getArticlesByTags = query({
    args: {
        herdId: v.optional(v.id("herds")),
        animalId: v.optional(v.id("animals")),
        topic: v.optional(v.union(
            v.literal("conservation"),
            v.literal("sanctuary"),
            v.literal("advocacy"),
            v.literal("education"),
            v.literal("herd-management"),
            v.literal("population-management"),
            v.literal("roundups"),
            v.literal("horse-slaughter"),
            v.literal("spirit")
        )),
        limit: v.optional(v.number()),
    },
    returns: v.array(v.object({
        _id: v.id("articles"),
        _creationTime: v.number(),
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        published: v.boolean(),
        publishedAt: v.optional(v.number()),
        imageId: v.optional(v.id("images")),
        image: v.optional(v.object({
            _id: v.id("images"),
            url: v.union(v.string(), v.null()),
            altText: v.optional(v.string()),
        })),
    })),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 6
        const hasFilters = args.herdId || args.animalId || args.topic
        
        // If no filters, return latest published articles
        if (!hasFilters) {
            const articles = await ctx.db
                .query("articles")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .take(limit)
            
            return await Promise.all(articles.map(async (article) => {
                const image = article.imageId ? await ctx.db.get(article.imageId) : null
                const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : null
                
                return {
                    _id: article._id,
                    _creationTime: article._creationTime,
                    title: article.title,
                    slug: article.slug,
                    excerpt: article.excerpt,
                    published: article.published,
                    publishedAt: article.publishedAt,
                    imageId: article.imageId,
                    image: (image && imageUrl) ? {
                        _id: image._id,
                        url: imageUrl,
                        altText: image.altText,
                    } : undefined,
                }
            }))
        }
        
        // With filters, get articles from each category and combine
        const articleMap = new Map<string, Doc<"articles">>()
        
        // Get articles by herd
        if (args.herdId) {
            const allArticles = await ctx.db
                .query("articles")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .take(100)
            
            const herdArticles = allArticles
                .filter(a => a.herdIds?.includes(args.herdId!))
                .slice(0, 3)
            
            for (const article of herdArticles) {
                articleMap.set(article._id, article)
            }
        }
        
        // Get articles by animal
        if (args.animalId) {
            const allArticles = await ctx.db
                .query("articles")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .take(100)
            
            const animalArticles = allArticles
                .filter(a => a.animalIds?.includes(args.animalId!))
                .slice(0, 3)
            
            for (const article of animalArticles) {
                articleMap.set(article._id, article)
            }
        }
        
        // Get articles by topic
        if (args.topic) {
            const allArticles = await ctx.db
                .query("articles")
                .withIndex("by_published", (q) => q.eq("published", true))
                .order("desc")
                .take(100)
            
            const topicArticles = allArticles
                .filter(a => a.topics?.includes(args.topic!))
                .slice(0, 3)
            
            for (const article of topicArticles) {
                articleMap.set(article._id, article)
            }
        }
        
        // Convert to array and sort by publishedAt (descending)
        const uniqueArticles = Array.from(articleMap.values())
            .sort((a, b) => (b.publishedAt || b._creationTime) - (a.publishedAt || a._creationTime))
        
        // Add image data
        return await Promise.all(uniqueArticles.map(async (article) => {
            const image = article.imageId ? await ctx.db.get(article.imageId) : null
            const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : null
            
            return {
                _id: article._id,
                _creationTime: article._creationTime,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                published: article.published,
                publishedAt: article.publishedAt,
                imageId: article.imageId,
                image: (image && imageUrl) ? {
                    _id: image._id,
                    url: imageUrl,
                    altText: image.altText,
                } : undefined,
            }
        }))
    },
})