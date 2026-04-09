import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import ArticleMetadataManager, { convexTopicEnum, convexCategoryEnum, topicNameList, resolvePaginatedResult } from "./models/articleMetadataManager"
import { paginationOptsValidator } from "convex/server"
import { articleMetadataAggregate } from "./aggregates"
import { Id } from "./_generated/dataModel"

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
        topics: v.array(convexTopicEnum),
        tags: v.optional(v.array(v.id("tags"))),
    },
    returns: v.id("articleMetadata"),
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
        topics: v.optional(v.array(convexTopicEnum)),
        tags: v.optional(v.array(v.id("tags"))),
        category: v.optional(convexCategoryEnum),
    },
    returns: v.id("articleMetadata"),
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
    returns: v.null(),
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
        return null
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
        category: v.optional(convexCategoryEnum),
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
                category: args.category,
                dateMin: args.dateMin,
                dateMax: args.dateMax,
                publicOnly: args.publicOnly,
            },
            args.paginationOpts,
        );
        return articleMetadata;
    },
})

export const getForTags = query({
    args: {
        tagIds: v.array(v.id("tags")),
        publicOnly: v.optional(v.boolean()),
        external: v.optional(v.boolean()),
        category: v.optional(convexCategoryEnum),
        dateMin: v.optional(v.number()),
        dateMax: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Fetch each tag doc and union their articleMetadataIds (deduplicated)
        const tags = await Promise.all(args.tagIds.map(id => ctx.db.get(id)));

        const allArticleMetadataIds = new Set<Id<"articleMetadata">>();
        for (const tag of tags) {
            if (!tag) continue;
            for (const id of tag.articleMetadataIds ?? []) {
                allArticleMetadataIds.add(id);
            }
        }

        // Fetch all matching article metadata in parallel
        const articles = await Promise.all(
            [...allArticleMetadataIds].map(id => ctx.db.get(id))
        );

        // Apply filters in memory
        const filtered = articles.filter((a): a is NonNullable<typeof a> => {
            if (!a) return false;
            if (args.publicOnly && !a.public) return false;
            if (args.external !== undefined && a.isExternal !== args.external) return false;
            if (args.category !== undefined && a.category !== args.category) return false;
            if (args.dateMin !== undefined && a.date < args.dateMin) return false;
            if (args.dateMax !== undefined && a.date > args.dateMax) return false;
            return true;
        });

        // Sort descending by date
        filtered.sort((a, b) => b.date - a.date);

        // Resolve images and links
        return await Promise.all(filtered.map(a => resolvePaginatedResult(ctx, a)));
    },
})

export const getForHerd = query({
    args: {
        herdId: v.id("herds"),
        publicOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const herd = await ctx.db.get(args.herdId)
        if (!herd) return []

        const ids = herd.articleMetadataIds ?? []
        const articles = await Promise.all(ids.map(id => ctx.db.get(id)))

        const filtered = articles.filter((a): a is NonNullable<typeof a> => {
            if (!a) return false
            if (args.publicOnly && !a.public) return false
            return true
        })

        filtered.sort((a, b) => b.date - a.date)

        return await Promise.all(filtered.map(a => resolvePaginatedResult(ctx, a)))
    },
})

export const searchHerds = query({
    args: {
        query: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const results = args.query
            ? await ctx.db.query("herds")
                .withSearchIndex("searchName", q => q.search("name", args.query!))
                .paginate(args.paginationOpts)
            : await ctx.db.query("herds")
                .paginate(args.paginationOpts)
        return {
            ...results,
            page: results.page.map(h => ({ _id: h._id, name: h.name })),
        }
    }
})

export const searchAnimals = query({
    args: {
        query: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const results = args.query
            ? await ctx.db.query("animals")
                .withSearchIndex("searchName", q => q.search("name", args.query!))
                .paginate(args.paginationOpts)
            : await ctx.db.query("animals")
                .paginate(args.paginationOpts)
        return {
            ...results,
            page: results.page.map(a => ({ _id: a._id, name: a.name })),
        }
    }
})

export const listTopics = query({
    args: {},
    returns: v.array(v.object({ _id: v.string(), name: v.string() })),
    handler: async () => {
        return topicNameList.map(t => ({
            _id: t,
            name: t.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }));
    }
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