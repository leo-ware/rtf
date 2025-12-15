import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import ArticleMetadataManager, { convexTopicEnum } from "./models/articleMetadataManager"
import { paginationOptsValidator } from "convex/server"
import { articleMetadataAggregate } from "./aggregates"

export const createArticleMetadata = mutation({
    args: {
        title: v.string(),
        imageId: v.id("images"),
        articleId: v.optional(v.id("articles")),
        externalArticleId: v.optional(v.id("externalArticles")),

        excerpt: v.optional(v.string()),
        date: v.optional(v.number()),
        public: v.boolean(),

        herdIds: v.array(v.id("herds")),
        animalIds: v.array(v.id("animals")),   
        topics: v.array(convexTopicEnum)
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const articleMetadataManager = await ArticleMetadataManager.create(ctx, args)
        const articleMetadata = await articleMetadataManager.get(ctx)
        if (articleMetadata) {
            await articleMetadataAggregate.insert(ctx, articleMetadata)
        }
        return articleMetadataManager.id
    },
})

export const updateArticleMetadata = mutation({
    args: {
        id: v.id("articleMetadata"),
        articleId: v.optional(v.id("articles")),
        externalArticleId: v.optional(v.id("externalArticles")),

        date: v.optional(v.number()),
        public: v.optional(v.boolean()),
        imageId: v.optional(v.id("images")),
        title: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        
        herdIds: v.optional(v.array(v.id("herds"))),
        animalIds: v.optional(v.array(v.id("animals"))),   
        topics: v.optional(v.array(convexTopicEnum))
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const articleMetadata = new ArticleMetadataManager(args.id)
        await articleMetadata.update(ctx, args);
        return args.id;
    },
});

export const assignArticleMetadata = mutation({
    args: {
        articleMetadataId: v.id("articleMetadata"),
        articleId: v.optional(v.id("articles")),
        externalArticleId: v.optional(v.id("externalArticles")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = new ArticleMetadataManager(args.articleMetadataId)
        if (args.articleId && args.externalArticleId) {
            throw new Error("Cannot specify both articleId and externalArticleId")
        }
        if (!args.articleId && !args.externalArticleId) {
            throw new Error("Must specify either articleId or externalArticleId")
        }
        if (args.articleId) {
            await manager.assignArticle(ctx, {articleId: args.articleId})
        }
        if (args.externalArticleId) {
            await manager.assignExternalArticle(ctx, {externalArticleId: args.externalArticleId})
        }
    },
})

export const deleteArticleMetadata = mutation({
    args: {
        id: v.id("articleMetadata"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = new ArticleMetadataManager(args.id)
        const articleMetadata = await manager.get(ctx)
        if (articleMetadata) {
            await articleMetadataAggregate.delete(ctx, articleMetadata)
        }
        await manager.delete(ctx)
        return null
    },
})

export const search = query({
    args: {
        query: v.optional(v.string()),
        topics: v.optional(v.array(convexTopicEnum)),
        external: v.optional(v.boolean()),
        dateMin: v.optional(v.number()),
        dateMax: v.optional(v.number()),
        publicOnly: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        if (args.publicOnly === undefined) {
            args.publicOnly = true;
        }
        if (!args.publicOnly) {
            const user = await getCurrentUserOrThrow(ctx);
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions");
            }
        }
        const articleMetadata = await ArticleMetadataManager.search(
            ctx,
            {
                query: args.query,
                topics: args.topics,
                external: args.external,
                dateMin: args.dateMin,
                dateMax: args.dateMax,
                publicOnly: args.publicOnly,
            },
            args.paginationOpts,
        );
        return articleMetadata;
    },
})

export const carouselSearch = query({
    args: {
        topic: v.optional(convexTopicEnum),
        external: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const articleMetadata = await ArticleMetadataManager.search(
            ctx,
            {
                query: undefined,
                topics: args.topic ? [args.topic] : undefined,
                external: args.external,
                dateMin: undefined,
                dateMax: undefined,
                publicOnly: true,
            },
            args.paginationOpts,
        );
        return articleMetadata;
    },
})