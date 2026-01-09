import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"

const normalizeSlug = (slug: string) => slug.trim().toLowerCase()

const ensureSlugUnique = async (
    ctx: any,
    slug: string,
    opts?: { ignoreId?: string }
) => {
    const existing = await ctx.db
        .query("educationArticles")
        .withIndex("by_slug", (q: any) => q.eq("slug", slug))
        .collect()

    const conflict = existing.find((a: any) => a._id !== opts?.ignoreId)
    if (conflict) {
        throw new Error("Slug already exists")
    }
}

export const getById = query({
    args: {
        id: v.id("educationArticles"),
    },
    returns: v.union(
        v.object({
            _id: v.id("educationArticles"),
            _creationTime: v.number(),
            title: v.string(),
            slug: v.optional(v.string()),
            description: v.string(),
            content: v.string(),
            isPublic: v.boolean(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const article = await ctx.db.get(args.id)
        if (!article) {
            return null
        }

        if (!article.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        return article
    },
})

export const getPublicById = query({
    args: {
        id: v.id("educationArticles"),
    },
    returns: v.union(
        v.object({
            _id: v.id("educationArticles"),
            _creationTime: v.number(),
            title: v.string(),
            slug: v.optional(v.string()),
            description: v.string(),
            content: v.string(),
            isPublic: v.boolean(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const article = await ctx.db.get(args.id)
        if (!article) {
            return null
        }

        if (!article.isPublic) {
            throw new Error("Not found")
        }

        return article
    },
})

export const listAll = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("educationArticles"),
        _creationTime: v.number(),
        title: v.string(),
        slug: v.optional(v.string()),
        description: v.string(),
        content: v.string(),
        isPublic: v.boolean(),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db
            .query("educationArticles")
            .order("desc")
            .collect()
    },
})

export const listPublic = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("educationArticles"),
        _creationTime: v.number(),
        title: v.string(),
        slug: v.optional(v.string()),
        description: v.string(),
        content: v.string(),
        isPublic: v.boolean(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("educationArticles")
            .withIndex("by_is_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()
    },
})

export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        description: v.string(),
    },
    returns: v.id("educationArticles"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const slug = normalizeSlug(args.slug)
        if (!slug) {
            throw new Error("Slug is required")
        }

        await ensureSlugUnique(ctx, slug)

        return await ctx.db.insert("educationArticles", {
            title: args.title,
            slug,
            description: args.description,
            content: "<p></p>",
            isPublic: false,
        })
    },
})

export const updateMetadata = mutation({
    args: {
        id: v.id("educationArticles"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const { id, slug, ...updates } = args

        const nextUpdates = {
            ...updates,
            ...(typeof slug === "string"
                ? { slug: normalizeSlug(slug) }
                : {}),
        }

        if (typeof slug === "string") {
            const normalized = normalizeSlug(slug)
            if (!normalized) {
                throw new Error("Slug is required")
            }
            await ensureSlugUnique(ctx, normalized, { ignoreId: id })
        }

        await ctx.db.patch(id, nextUpdates)
        return null
    },
})

export const updateContent = mutation({
    args: {
        id: v.id("educationArticles"),
        content: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.patch(args.id, {
            content: args.content,
        })
        return null
    },
})

export const deleteArticle = mutation({
    args: {
        id: v.id("educationArticles"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const groups = await ctx.db
            .query("educationArticleGroups")
            .collect()

        await Promise.all(groups.map(async (group) => {
            if (!group.articleIds.includes(args.id)) {
                return
            }

            await ctx.db.patch(group._id, {
                articleIds: group.articleIds.filter((articleId) => articleId !== args.id),
            })
        }))

        await ctx.db.delete(args.id)
        return null
    },
})

export const getPublicBySlug = query({
    args: {
        slug: v.string(),
    },
    returns: v.union(
        v.object({
            _id: v.id("educationArticles"),
            _creationTime: v.number(),
            title: v.string(),
            slug: v.optional(v.string()),
            description: v.string(),
            content: v.string(),
            isPublic: v.boolean(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const slug = normalizeSlug(args.slug)
        const article = await ctx.db
            .query("educationArticles")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()

        if (!article) {
            return null
        }

        if (!article.isPublic) {
            return null
        }

        return article
    },
})


