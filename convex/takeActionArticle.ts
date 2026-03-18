import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import { generateSlug } from "./utils"
import { paginationOptsValidator } from "convex/server"
import { resolveImageId } from "./images"
import { convexTopicEnum, topicNameToAttributeName, topicNameList } from "./models/articleMetadataManager"

const topicFields = {
    topic_homepage: v.optional(v.boolean()),
    topic_conservation: v.optional(v.boolean()),
    topic_sanctuary: v.optional(v.boolean()),
    topic_advocacy: v.optional(v.boolean()),
    topic_education: v.optional(v.boolean()),
    topic_herd_management: v.optional(v.boolean()),
    topic_population_management: v.optional(v.boolean()),
    topic_roundups: v.optional(v.boolean()),
    topic_horse_slaughter: v.optional(v.boolean()),
    topic_spirit: v.optional(v.boolean()),
}

const takeActionArticleValidator = v.object({
    _id: v.id("takeActionArticle"),
    _creationTime: v.number(),
    title: v.string(),
    slug: v.string(),
    imageId: v.optional(v.id("images")),
    description: v.string(),
    content: v.string(),
    isPublic: v.boolean(),
    ...topicFields,
})

export const listTakeActionArticles = query({
    args: {
        publicOnly: v.optional(v.boolean()),
    },
    returns: v.array(takeActionArticleValidator),
    handler: async (ctx, args) => {
        const publicOnly = args.publicOnly ?? true

        if (!publicOnly) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
            return await ctx.db
                .query("takeActionArticle")
                .order("desc")
                .collect()
        }

        return await ctx.db
            .query("takeActionArticle")
            .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()
    },
})

export const recommendTakeActionArticles = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const pagination = await ctx.db
            .query("takeActionArticle")
            .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
            .order("desc")
            .paginate(args.paginationOpts)

        const withImages = {
            ...pagination,
            page: await Promise.all(pagination.page.map(async (article) => {
                return {
                    ...article,
                    image: article.imageId
                        ? await resolveImageId(ctx, article.imageId)
                        : null,
                }
            })),
        }

        return withImages
    },
})

export const getTopicTakeActionArticles = query({
    args: {
        topic: convexTopicEnum,
    },
    handler: async (ctx, args) => {
        const articles = await ctx.db
            .query("takeActionArticle")
            .withIndex("by_isPublic", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()

        const topicField = topicNameToAttributeName(args.topic)
        const filtered = articles.filter((a) => a[topicField] === true)

        return await Promise.all(filtered.map(async (article) => ({
            ...article,
            image: article.imageId
                ? await resolveImageId(ctx, article.imageId)
                : null,
        })))
    },
})

export const getTakeActionArticle = query({
    args: {
        id: v.id("takeActionArticle"),
    },
    returns: v.union(
        takeActionArticleValidator,
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

export const getTakeActionArticleBySlug = query({
    args: {
        slug: v.string(),
    },
    returns: v.union(
        takeActionArticleValidator,
        v.null()
    ),
    handler: async (ctx, args) => {
        const article = await ctx.db
            .query("takeActionArticle")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique()

        if (!article || !article.isPublic) {
            return null
        }

        return article
    },
})

export const createTakeActionArticle = mutation({
    args: {
        title: v.string(),
        slug: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        description: v.string(),
        topics: v.optional(v.array(convexTopicEnum)),
    },
    returns: v.id("takeActionArticle"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const slug = (args.slug ?? generateSlug(args.title)).trim()
        if (!slug) {
            throw new Error("Slug is required")
        }

        const existing = await ctx.db
            .query("takeActionArticle")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()
        if (existing) {
            throw new Error("Slug already in use")
        }

        const topicPatches: Record<string, boolean> = {}
        if (args.topics) {
            for (const topic of args.topics) {
                topicPatches[topicNameToAttributeName(topic)] = true
            }
        }

        return await ctx.db.insert("takeActionArticle", {
            title: args.title,
            slug,
            imageId: args.imageId,
            description: args.description,
            content: "<p></p>",
            isPublic: false,
            ...topicPatches,
        })
    },
})

export const updateTakeActionArticle = mutation({
    args: {
        id: v.id("takeActionArticle"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        description: v.optional(v.string()),
        content: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
        topics: v.optional(v.array(convexTopicEnum)),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Take action article not found")
        }

        const { id, slug: nextSlug, topics, ...updates } = args

        if (typeof nextSlug === "string") {
            const normalizedSlug = nextSlug.trim()
            if (!normalizedSlug) {
                throw new Error("Slug is required")
            }

            const slugOwner = await ctx.db
                .query("takeActionArticle")
                .withIndex("by_slug", (q) => q.eq("slug", normalizedSlug))
                .unique()
            if (slugOwner && slugOwner._id !== id) {
                throw new Error("Slug already in use")
            }

            ;(updates as typeof updates & { slug: string }).slug = normalizedSlug
        }

        const nextIsPublic = updates.isPublic
        if (nextIsPublic === true) {
            const slugToPublish = (typeof nextSlug === "string")
                ? nextSlug.trim()
                : existing.slug.trim()
            if (!slugToPublish) {
                throw new Error("Slug is required to publish")
            }
        }

        const topicPatches: Record<string, boolean | undefined> = {}
        if (topics !== undefined) {
            const topicSet = new Set(topics)
            for (const t of topicNameList) {
                topicPatches[topicNameToAttributeName(t)] = topicSet.has(t) ? true : undefined
            }
        }

        await ctx.db.patch(id, { ...updates, ...topicPatches })
        return null
    },
})

export const deleteTakeActionArticle = mutation({
    args: {
        id: v.id("takeActionArticle"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.delete(args.id)
        return null
    },
})
