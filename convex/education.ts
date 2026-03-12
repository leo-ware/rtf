import { v } from "convex/values"
import { paginationOptsValidator } from "convex/server"
import { query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import { Doc, Id } from "./_generated/dataModel"

const educationArticleValidator = v.object({
    _id: v.id("educationArticles"),
    _creationTime: v.number(),
    title: v.string(),
    slug: v.optional(v.string()),
    description: v.string(),
    content: v.string(),
    isPublic: v.boolean(),
    documentId: v.optional(v.id("documents")),
    documentUrl: v.optional(v.string()),
})

const educationGroupValidator = v.object({
    _id: v.id("educationArticleGroups"),
    _creationTime: v.number(),
    title: v.string(),
    articleIds: v.array(v.id("educationArticles")),
    articles: v.array(educationArticleValidator),
})

const educationSuperGroupValidator = v.object({
    _id: v.id("educationArticleSuperGroups"),
    _creationTime: v.number(),
    title: v.string(),
    order: v.optional(v.number()),
    groupIds: v.array(v.id("educationArticleGroups")),
    groups: v.array(educationGroupValidator),
})

export const getEducationTree = query({
    args: {
        includePrivate: v.optional(v.boolean()),
    },
    returns: v.object({
        superGroups: v.array(educationSuperGroupValidator),
        // unassignedGroups: v.array(educationGroupValidator),
        // unassignedArticles: v.array(educationArticleValidator),
    }),
    handler: async (ctx, args) => {
        const includePrivate = args.includePrivate ?? false

        if (includePrivate) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        const superGroupsPromise = ctx.db
            .query("educationArticleSuperGroups")
            .collect()

        const groupsPromise = ctx.db
            .query("educationArticleGroups")
            .collect()

        const articlesPromise = includePrivate
            ? ctx.db.query("educationArticles").collect()
            : ctx.db
                .query("educationArticles")
                .withIndex("by_is_public", (q) => q.eq("isPublic", true))
                .collect()

        const [superGroups, groups, articles] = await Promise.all([
            superGroupsPromise,
            groupsPromise,
            articlesPromise,
        ])

        // Resolve document URLs for articles with documentId
        const articlesWithDocUrls = await Promise.all(articles.map(async (a) => {
            if (!a.documentId) return { ...a, documentUrl: undefined }
            const doc = await ctx.db.get(a.documentId)
            if (!doc) return { ...a, documentUrl: undefined }
            const url = await ctx.storage.getUrl(doc.fileId)
            return { ...a, documentUrl: url ?? undefined }
        }))

        const articleById = Object.fromEntries(articlesWithDocUrls.map(a => [a._id, a]))

        const groupsWithArticles = groups.map(group => ({
            ...group,
            articles: group.articleIds
                .map(articleId => articleById[articleId])
                .filter(a => !!a),
        }))

        const groupsWithArticlesById = Object.fromEntries(groupsWithArticles.map(g => [g._id, g]))

        const superGroupsWithChildren = superGroups
            .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
            .map(superGroup => ({
                ...superGroup,
                groups: superGroup.groupIds
                    .map(groupId => groupsWithArticlesById[groupId])
                    .filter(g => !!g)
                    .filter(g => includePrivate || g.articles.length > 0),
            }))

        return {
            superGroups: superGroupsWithChildren,
        }
    },
})


export const getInvertedEducationTree = query({
    args: {
        includePrivate: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const includePrivate = args.includePrivate ?? false

        if (includePrivate) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        const superGroupsPromise = ctx.db
            .query("educationArticleSuperGroups")
            .collect()

        const groupsPromise = ctx.db
            .query("educationArticleGroups")
            .collect()

        const articlesPromise = includePrivate
            ? ctx.db.query("educationArticles").collect()
            : ctx.db
                .query("educationArticles")
                .withIndex("by_is_public", (q) => q.eq("isPublic", true))
                .collect()

        const [superGroups, groups, articles] = await Promise.all([
            superGroupsPromise,
            groupsPromise,
            articlesPromise,
        ])

        const result = articles.map(article => {
            const group = groups.find(g => g.articleIds.includes(article._id))
            const superGroup = group
                ? superGroups.find(sg => sg.groupIds.includes(group._id))
                : null

            return {...article, group, superGroup}
        })

        return result
    }
})

export const searchArticles = query({
    args: {
        query: v.optional(v.string()),
        groupId: v.optional(v.id("educationArticleGroups")),
        superGroupId: v.optional(v.id("educationArticleSuperGroups")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        // Resolve allowed article IDs based on filters
        let allowedArticleIds: Set<string> | null = null

        if (args.groupId) {
            const group = await ctx.db.get(args.groupId)
            if (group) {
                allowedArticleIds = new Set(group.articleIds.map(id => id as string))
            } else {
                allowedArticleIds = new Set()
            }
        } else if (args.superGroupId) {
            const superGroup = await ctx.db.get(args.superGroupId)
            if (superGroup) {
                const groups = await Promise.all(
                    superGroup.groupIds.map(gid => ctx.db.get(gid))
                )
                const allArticleIds = groups
                    .filter(g => !!g)
                    .flatMap(g => g.articleIds)
                allowedArticleIds = new Set(allArticleIds.map(id => id as string))
            } else {
                allowedArticleIds = new Set()
            }
        }

        const baseQuery = args.query
            ? ctx.db
                .query("educationArticles")
                .withSearchIndex("searchTitle", (q) =>
                    q.search("title", args.query!).eq("isPublic", true)
                )
            : ctx.db
                .query("educationArticles")
                .withIndex("by_is_public", (q) => q.eq("isPublic", true))

        const filteredQuery = allowedArticleIds !== null
            ? baseQuery.filter((q) => {
                const idChecks = [...allowedArticleIds!].map(id =>
                    q.eq(q.field("_id"), id)
                )
                return idChecks.length > 0 ? q.or(...idChecks as [any, ...any[]]) : q.eq(1, 0)
            })
            : baseQuery

        const paginatedResult = await filteredQuery.paginate(args.paginationOpts)

        const [groups, superGroups] = await Promise.all([
            ctx.db.query("educationArticleGroups").collect(),
            ctx.db.query("educationArticleSuperGroups").collect(),
        ])

        const articleIdToLabels: Record<string, { groupTitle?: string, superGroupTitle?: string }> = {}
        for (const group of groups) {
            const superGroup = superGroups.find((sg) => sg.groupIds.includes(group._id))
            for (const articleId of group.articleIds) {
                articleIdToLabels[articleId] = {
                    groupTitle: group.title,
                    superGroupTitle: superGroup?.title,
                }
            }
        }

        // Resolve document URLs for articles with documentId
        const pageWithDocs = await Promise.all(paginatedResult.page.map(async (article) => {
            let documentUrl: string | undefined
            if (article.documentId) {
                const doc = await ctx.db.get(article.documentId)
                if (doc) {
                    const url = await ctx.storage.getUrl(doc.fileId)
                    documentUrl = url ?? undefined
                }
            }
            return {
                _id: article._id,
                _creationTime: article._creationTime,
                title: article.title,
                slug: article.slug,
                description: article.description,
                isPublic: article.isPublic,
                documentId: article.documentId,
                documentUrl,
                groupTitle: articleIdToLabels[article._id]?.groupTitle,
                superGroupTitle: articleIdToLabels[article._id]?.superGroupTitle,
            }
        }))

        return {
            ...paginatedResult,
            page: pageWithDocs,
        }
    },
})

export const getGroupsAndSuperGroups = query({
    args: {},
    returns: v.object({
        groups: v.array(v.object({
            _id: v.id("educationArticleGroups"),
            title: v.string(),
            superGroupId: v.optional(v.id("educationArticleSuperGroups")),
        })),
        superGroups: v.array(v.object({
            _id: v.id("educationArticleSuperGroups"),
            title: v.string(),
        })),
    }),
    handler: async (ctx) => {
        const [groups, superGroups] = await Promise.all([
            ctx.db.query("educationArticleGroups").collect(),
            ctx.db.query("educationArticleSuperGroups").collect(),
        ])

        const groupsWithSuperGroup = groups.map(group => {
            const superGroup = superGroups.find(sg => sg.groupIds.includes(group._id))
            return {
                _id: group._id,
                title: group.title,
                superGroupId: superGroup?._id,
            }
        })

        return {
            groups: groupsWithSuperGroup,
            superGroups: superGroups.map(sg => ({
                _id: sg._id,
                title: sg.title,
            })),
        }
    },
})
