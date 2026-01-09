import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"

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

export const listAll = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("educationArticleGroups"),
        _creationTime: v.number(),
        title: v.string(),
        articleIds: v.array(v.id("educationArticles")),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db
            .query("educationArticleGroups")
            .order("asc")
            .collect()
    },
})

export const getById = query({
    args: {
        id: v.id("educationArticleGroups"),
    },
    returns: v.union(
        v.object({
            _id: v.id("educationArticleGroups"),
            _creationTime: v.number(),
            title: v.string(),
            articleIds: v.array(v.id("educationArticles")),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.get(args.id)
    },
})

export const create = mutation({
    args: {
        title: v.string(),
    },
    returns: v.id("educationArticleGroups"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.insert("educationArticleGroups", {
            title: args.title,
            articleIds: [],
        })
    },
})

export const update = mutation({
    args: {
        id: v.id("educationArticleGroups"),
        title: v.optional(v.string()),
        articleIds: v.optional(v.array(v.id("educationArticles"))),
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
            ...(updates.articleIds ? { articleIds: dedupeIdsPreserveOrder(updates.articleIds) } : {}),
        }

        await ctx.db.patch(id, nextUpdates)
        return null
    },
})

export const reorderArticles = mutation({
    args: {
        id: v.id("educationArticleGroups"),
        articleIds: v.array(v.id("educationArticles")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.patch(args.id, {
            articleIds: dedupeIdsPreserveOrder(args.articleIds),
        })
        return null
    },
})

export const assignArticleToGroup = mutation({
    args: {
        articleId: v.id("educationArticles"),
        groupId: v.union(v.id("educationArticleGroups"), v.null()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const groups = await ctx.db.query("educationArticleGroups").collect()

        await Promise.all(groups.map(async (group) => {
            if (!group.articleIds.includes(args.articleId)) {
                return
            }
            await ctx.db.patch(group._id, {
                articleIds: group.articleIds.filter((id) => id !== args.articleId),
            })
        }))

        if (args.groupId === null) {
            return null
        }

        const target = await ctx.db.get(args.groupId)
        if (!target) {
            throw new Error("Group not found")
        }

        await ctx.db.patch(target._id, {
            articleIds: dedupeIdsPreserveOrder([...target.articleIds, args.articleId]),
        })

        return null
    },
})

export const deleteGroup = mutation({
    args: {
        id: v.id("educationArticleGroups"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Group not found")
        }

        if (existing.articleIds.length > 0) {
            throw new Error("Cannot delete a group that contains articles")
        }

        const superGroups = await ctx.db
            .query("educationArticleSuperGroups")
            .collect()

        const referencedBy = superGroups.find((sg) => sg.groupIds.includes(args.id))
        if (referencedBy) {
            throw new Error("Cannot delete a group that belongs to a super group")
        }

        await ctx.db.delete(args.id)
        return null
    },
})


