import { v } from "convex/values"
import { mutation } from "./_generated/server"
import ArticleManager from "./models/articleManager"
import { convexCategoryEnum } from "./models/articleMetadataManager"
import { articleMetadataAggregate, animalsAggregate } from "./aggregates"

export const importArticle = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(),
        date: v.number(),
        imageId: v.id("images"),
        authorCredit: v.optional(v.string()),
        tags: v.optional(v.array(v.id("tags"))),
        category: v.optional(convexCategoryEnum),
    },
    returns: v.id("articles"),
    handler: async (ctx, args) => {
        const manager = await ArticleManager.create(ctx, {
            title: args.title,
            slug: args.slug,
            excerpt: args.excerpt,
            content: args.content,
            date: args.date,
            imageId: args.imageId,
            authorCredit: args.authorCredit,
            tags: args.tags,
            category: args.category,
            from_import: true,
        })

        const article = await manager.get(ctx)
        if (article) {
            const articleMetadata = await ctx.db.get(article.articleMetadataId)
            if (articleMetadata) {
                await ctx.db.patch(articleMetadata._id, { public: true })
                await articleMetadataAggregate.insert(ctx, { ...articleMetadata, public: true })
            }
        }

        return manager.id
    },
})

export const importCreateImage = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
        originalName: v.string(),
        title: v.string(),
        mimeType: v.string(),
        size: v.number(),
        altText: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
    },
    returns: v.id("images"),
    handler: async (ctx, args) => {
        const imageId = await ctx.db.insert("images", {
            ...args,
            searchText: `${args.title} ${args.altText || ""}`,
        })
        return imageId
    },
})

export const importCreateTag = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
    },
    returns: v.id("tags"),
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("tags")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first()

        if (existing) {
            return existing._id
        }

        return await ctx.db.insert("tags", {
            name: args.name,
            slug: args.slug,
            articleMetadataIds: [],
        })
    },
})

export const importGetUploadUrl = mutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl()
    },
})

export const importCheckSlugExists = mutation({
    args: { slug: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const article = await ctx.db
            .query("articles")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first()
        return !!article
    },
})

export const importCheckAnimalSlugExists = mutation({
    args: { slug: v.string() },
    returns: v.boolean(),
    handler: async (ctx, args) => {
        const animal = await ctx.db
            .query("animals")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first()
        return !!animal
    },
})

export const importCreateGalleryItem = mutation({
    args: { imageId: v.id("images") },
    returns: v.id("galleryItems"),
    handler: async (ctx, args) => {
        return await ctx.db.insert("galleryItems", {
            type: "image",
            imageId: args.imageId,
        })
    },
})

export const importCreateAnimal = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        type: v.union(v.literal("horse"), v.literal("burro")),
        description: v.string(),
        content: v.optional(v.string()),
        imageId: v.id("images"),
        gallery: v.optional(v.array(v.id("galleryItems"))),
    },
    returns: v.id("animals"),
    handler: async (ctx, args) => {
        const animalId = await ctx.db.insert("animals", {
            name: args.name,
            slug: args.slug,
            type: args.type,
            description: args.description,
            content: args.content,
            imageId: args.imageId,
            gallery: args.gallery,
        })
        const animal = await ctx.db.get(animalId)
        if (animal) {
            await animalsAggregate.insert(ctx, animal)
        }
        return animalId
    },
})
