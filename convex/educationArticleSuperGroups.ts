import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import { Id } from "./_generated/dataModel"

const dedupeIdsPreserveOrder = <T extends string>(ids: Array<T>) => {
    const seen = new Set<T>()
    const result: Array<T> = []
    ids.forEach((id) => {
        if (seen.has(id)) {
            return
        }
        seen.add(id)
        result.push(id)
    })
    return result
}

const educationArticleValidator = v.object({
    _id: v.id("educationArticles"),
    _creationTime: v.number(),
    title: v.string(),
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
    groupIds: v.array(v.id("educationArticleGroups")),
    order: v.optional(v.number()),
    groups: v.array(educationGroupValidator),
})

export const listAll = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("educationArticleSuperGroups"),
        _creationTime: v.number(),
        title: v.string(),
        groupIds: v.array(v.id("educationArticleGroups")),
        order: v.optional(v.number()),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const superGroups = await ctx.db
            .query("educationArticleSuperGroups")
            .order("asc")
            .collect()

        return superGroups.sort((a, b) => {
            const aOrder = a.order ?? Number.MAX_SAFE_INTEGER
            const bOrder = b.order ?? Number.MAX_SAFE_INTEGER
            if (aOrder !== bOrder) {
                return aOrder - bOrder
            }
            return a.title.localeCompare(b.title)
        })
    },
})

export const getTreeForAdmin = query({
    args: {},
    returns: v.array(educationSuperGroupValidator),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const superGroups = await ctx.db
            .query("educationArticleSuperGroups")
            .order("asc")
            .collect()

        const groups = await ctx.db
            .query("educationArticleGroups")
            .order("asc")
            .collect()

        const articles = await ctx.db
            .query("educationArticles")
            .order("desc")
            .collect()

        const groupById: Record<Id<"educationArticleGroups">, typeof groups[number]> = {} as any
        groups.forEach((g) => {
            groupById[g._id] = g
        })

        const articleById: Record<Id<"educationArticles">, typeof articles[number]> = {} as any
        articles.forEach((a) => {
            articleById[a._id] = a
        })

        return superGroups.map((sg) => {
            const orderedGroups = sg.groupIds
                .map((groupId) => groupById[groupId])
                .filter((g) => !!g)
                .map((g) => {
                    const orderedArticles = g.articleIds
                        .map((articleId) => articleById[articleId])
                        .filter((a) => !!a)
                    return {
                        ...g,
                        articles: orderedArticles,
                    }
                })

            return {
                ...sg,
                groups: orderedGroups,
            }
        })
    },
})

export const getPublicTree = query({
    args: {},
    returns: v.array(educationSuperGroupValidator),
    handler: async (ctx) => {
        const superGroups = await ctx.db
            .query("educationArticleSuperGroups")
            .order("asc")
            .collect()

        const groups = await ctx.db
            .query("educationArticleGroups")
            .order("asc")
            .collect()

        const publicArticles = await ctx.db
            .query("educationArticles")
            .withIndex("by_is_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()

        const groupById: Record<Id<"educationArticleGroups">, typeof groups[number]> = {} as any
        groups.forEach((g) => {
            groupById[g._id] = g
        })

        const articleById: Record<Id<"educationArticles">, typeof publicArticles[number]> = {} as any
        publicArticles.forEach((a) => {
            articleById[a._id] = a
        })

        return superGroups
            .map((sg) => {
                const orderedGroups = sg.groupIds
                    .map((groupId) => groupById[groupId])
                    .filter((g) => !!g)
                    .map((g) => {
                        const orderedArticles = g.articleIds
                            .map((articleId) => articleById[articleId])
                            .filter((a) => !!a)

                        return {
                            ...g,
                            articles: orderedArticles,
                        }
                    })
                    .filter((g) => g.articles.length > 0)

                return {
                    ...sg,
                    groups: orderedGroups,
                }
            })
            .filter((sg) => sg.groups.length > 0)
    },
})

export const create = mutation({
    args: {
        title: v.string(),
    },
    returns: v.id("educationArticleSuperGroups"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db
            .query("educationArticleSuperGroups")
            .collect()
        const maxOrder = existing.reduce((max, sg) => Math.max(max, sg.order ?? -1), -1)

        return await ctx.db.insert("educationArticleSuperGroups", {
            title: args.title,
            groupIds: [],
            order: maxOrder + 1,
        })
    },
})

export const update = mutation({
    args: {
        id: v.id("educationArticleSuperGroups"),
        title: v.optional(v.string()),
        groupIds: v.optional(v.array(v.id("educationArticleGroups"))),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const { id, ...updates } = args
        const nextUpdates = {
            ...updates,
            ...(updates.groupIds ? { groupIds: dedupeIdsPreserveOrder(updates.groupIds) } : {}),
        }
        await ctx.db.patch(id, nextUpdates)
        return null
    },
})

export const reorderGroups = mutation({
    args: {
        id: v.id("educationArticleSuperGroups"),
        groupIds: v.array(v.id("educationArticleGroups")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.patch(args.id, {
            groupIds: dedupeIdsPreserveOrder(args.groupIds),
        })
        return null
    },
})

export const reorderSuperGroups = mutation({
    args: {
        ids: v.array(v.id("educationArticleSuperGroups")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const previousSuperGroups = await ctx.db.query("educationArticleSuperGroups").collect()
        const previousSuperGroupIds = previousSuperGroups
            .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
            .map((sg) => sg._id)

        const allSortedIds = [...dedupeIdsPreserveOrder(args.ids)]
        previousSuperGroupIds.forEach((id) => {
            if (!allSortedIds.includes(id)) {
                allSortedIds.push(id)
            }
        })

        await Promise.all(allSortedIds.map(async (id, order) => {
            await ctx.db.patch(id, { order })
        }))

        return null
    },
})

export const assignGroupToSuperGroup = mutation({
    args: {
        groupId: v.id("educationArticleGroups"),
        superGroupId: v.union(v.id("educationArticleSuperGroups"), v.null()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const superGroups = await ctx.db.query("educationArticleSuperGroups").collect()

        await Promise.all(superGroups.map(async (sg) => {
            if (!sg.groupIds.includes(args.groupId)) {
                return
            }
            await ctx.db.patch(sg._id, {
                groupIds: sg.groupIds.filter((id) => id !== args.groupId),
            })
        }))

        if (args.superGroupId === null) {
            return null
        }

        const target = await ctx.db.get(args.superGroupId)
        if (!target) {
            throw new Error("Super group not found")
        }

        await ctx.db.patch(target._id, {
            groupIds: dedupeIdsPreserveOrder([...target.groupIds, args.groupId]),
        })

        return null
    },
})

export const deleteSuperGroup = mutation({
    args: {
        id: v.id("educationArticleSuperGroups"),
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


