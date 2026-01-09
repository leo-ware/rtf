import { v } from "convex/values"
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

        const articleById: Record<Id<"educationArticles">, Doc<"educationArticles">> = Object.fromEntries(articles.map(a => [a._id, a]))

        const groupsWithArticles = groups.map(group => ({
            ...group,
            articles: group.articleIds
                .map(articleId => articleById[articleId])
                .filter(a => !!a),
        }))

        const groupsWithArticlesById: Record<Id<"educationArticleGroups">, typeof groupsWithArticles[number]> = Object.fromEntries(groupsWithArticles.map(g => [g._id, g]))

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