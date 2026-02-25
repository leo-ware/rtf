import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import { generateSlug } from "./utils"

// ── Timeline CRUD ──────────────────────────────────────────────────

export const listTimelines = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("learnTimelines"),
        _creationTime: v.number(),
        title: v.string(),
        slug: v.string(),
        isPublic: v.boolean(),
        order: v.number(),
    })),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db
            .query("learnTimelines")
            .withIndex("by_order")
            .order("asc")
            .collect()
    },
})

export const getTimeline = query({
    args: { id: v.id("learnTimelines") },
    returns: v.union(v.null(), v.object({
        _id: v.id("learnTimelines"),
        _creationTime: v.number(),
        title: v.string(),
        slug: v.string(),
        isPublic: v.boolean(),
        order: v.number(),
    })),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.get(args.id)
    },
})

export const createTimeline = mutation({
    args: { title: v.string() },
    returns: v.id("learnTimelines"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const slug = generateSlug(args.title)
        if (slug.length === 0) {
            throw new Error("Invalid title: cannot generate valid slug")
        }

        const existing = await ctx.db
            .query("learnTimelines")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()
        if (existing) {
            throw new Error("A timeline with this name already exists")
        }

        const last = await ctx.db
            .query("learnTimelines")
            .withIndex("by_order")
            .order("desc")
            .first()

        const newOrder = last ? last.order + 1 : 0

        return await ctx.db.insert("learnTimelines", {
            title: args.title,
            slug,
            isPublic: false,
            order: newOrder,
        })
    },
})

export const updateTimeline = mutation({
    args: {
        id: v.id("learnTimelines"),
        title: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
    },
    returns: v.id("learnTimelines"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Timeline not found")
        }

        const patch: Record<string, unknown> = {}
        if (args.title !== undefined) {
            patch.title = args.title

            const newSlug = generateSlug(args.title)
            if (newSlug !== existing.slug) {
                const conflict = await ctx.db
                    .query("learnTimelines")
                    .withIndex("by_slug", (q) => q.eq("slug", newSlug))
                    .unique()
                if (conflict && conflict._id !== args.id) {
                    throw new Error("A timeline with this name already exists")
                }
                patch.slug = newSlug
            }
        }
        if (args.isPublic !== undefined) patch.isPublic = args.isPublic

        await ctx.db.patch(args.id, patch)
        return args.id
    },
})

export const deleteTimeline = mutation({
    args: { id: v.id("learnTimelines") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Cascade-delete all items
        const items = await ctx.db
            .query("learnTimelineItems")
            .withIndex("by_timelineId", (q) => q.eq("timelineId", args.id))
            .collect()

        for (const item of items) {
            await ctx.db.delete(item._id)
        }

        await ctx.db.delete(args.id)
        return null
    },
})

export const reorderTimelines = mutation({
    args: { orderedIds: v.array(v.id("learnTimelines")) },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await Promise.all(
            args.orderedIds.map(async (id, index) => {
                await ctx.db.patch(id, { order: index })
            }),
        )

        return null
    },
})

// ── Item CRUD ──────────────────────────────────────────────────────

const learnTimelineItemWithImageValidator = v.object({
    _id: v.id("learnTimelineItems"),
    _creationTime: v.number(),
    timelineId: v.id("learnTimelines"),
    order: v.number(),
    date: v.string(),
    title: v.string(),
    content: v.string(),
    imageId: v.optional(v.id("images")),
    image: v.union(
        v.null(),
        v.object({
            url: v.union(v.null(), v.string()),
            altText: v.optional(v.string()),
            authorCredit: v.optional(v.string()),
        }),
    ),
})

export const listTimelineItems = query({
    args: { timelineId: v.id("learnTimelines") },
    returns: v.array(learnTimelineItemWithImageValidator),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const items = await ctx.db
            .query("learnTimelineItems")
            .withIndex("by_timelineId_and_order", (q) => q.eq("timelineId", args.timelineId))
            .order("asc")
            .collect()

        return await Promise.all(
            items.map(async (item) => {
                let image: { url: string | null, altText?: string, authorCredit?: string } | null = null
                if (item.imageId) {
                    const img = await ctx.db.get(item.imageId)
                    if (img) {
                        const url = await ctx.storage.getUrl(img.storageId)
                        image = { url, altText: img.altText, authorCredit: img.authorCredit }
                    }
                }
                return { ...item, image }
            }),
        )
    },
})

export const createTimelineItem = mutation({
    args: {
        timelineId: v.id("learnTimelines"),
        date: v.string(),
        title: v.string(),
        content: v.string(),
        imageId: v.optional(v.id("images")),
    },
    returns: v.id("learnTimelineItems"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const last = await ctx.db
            .query("learnTimelineItems")
            .withIndex("by_timelineId_and_order", (q) => q.eq("timelineId", args.timelineId))
            .order("desc")
            .first()

        const newOrder = last ? last.order + 1 : 0

        return await ctx.db.insert("learnTimelineItems", {
            timelineId: args.timelineId,
            order: newOrder,
            date: args.date,
            title: args.title,
            content: args.content,
            imageId: args.imageId,
        })
    },
})

export const updateTimelineItem = mutation({
    args: {
        id: v.id("learnTimelineItems"),
        date: v.optional(v.string()),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        imageId: v.optional(v.union(v.id("images"), v.null())),
    },
    returns: v.id("learnTimelineItems"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Timeline item not found")
        }

        const patch: Record<string, unknown> = {}
        if (args.date !== undefined) patch.date = args.date
        if (args.title !== undefined) patch.title = args.title
        if (args.content !== undefined) patch.content = args.content
        if (args.imageId !== undefined) {
            patch.imageId = args.imageId === null ? undefined : args.imageId
        }

        await ctx.db.patch(args.id, patch)
        return args.id
    },
})

export const deleteTimelineItem = mutation({
    args: { id: v.id("learnTimelineItems") },
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

export const reorderTimelineItems = mutation({
    args: {
        items: v.array(v.object({
            id: v.id("learnTimelineItems"),
            order: v.number(),
        })),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await Promise.all(
            args.items.map(async ({ id, order }) => {
                await ctx.db.patch(id, { order })
            }),
        )

        return null
    },
})

// ── Public query ───────────────────────────────────────────────────

export const listPublicTimelinesWithItems = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("learnTimelines"),
        title: v.string(),
        slug: v.string(),
        order: v.number(),
        items: v.array(v.object({
            _id: v.id("learnTimelineItems"),
            date: v.string(),
            title: v.string(),
            content: v.string(),
            image: v.union(
                v.null(),
                v.object({
                    url: v.union(v.null(), v.string()),
                    altText: v.optional(v.string()),
                    authorCredit: v.optional(v.string()),
                }),
            ),
        })),
    })),
    handler: async (ctx) => {
        const timelines = await ctx.db
            .query("learnTimelines")
            .withIndex("by_order")
            .order("asc")
            .collect()

        const publicTimelines = timelines.filter((t) => t.isPublic)

        return await Promise.all(
            publicTimelines.map(async (timeline) => {
                const items = await ctx.db
                    .query("learnTimelineItems")
                    .withIndex("by_timelineId_and_order", (q) =>
                        q.eq("timelineId", timeline._id),
                    )
                    .order("asc")
                    .collect()

                const resolvedItems = await Promise.all(
                    items.map(async (item) => {
                        let image: { url: string | null, altText?: string, authorCredit?: string } | null = null
                        if (item.imageId) {
                            const img = await ctx.db.get(item.imageId)
                            if (img) {
                                const url = await ctx.storage.getUrl(img.storageId)
                                image = { url, altText: img.altText, authorCredit: img.authorCredit }
                            }
                        }
                        return {
                            _id: item._id,
                            date: item.date,
                            title: item.title,
                            content: item.content,
                            image,
                        }
                    }),
                )

                return {
                    _id: timeline._id,
                    title: timeline.title,
                    slug: timeline.slug,
                    order: timeline.order,
                    items: resolvedItems,
                }
            }),
        )
    },
})
