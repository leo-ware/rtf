import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"

// Create a new timeline item
export const createTimelineItem = mutation({
    args: {
        order: v.number(),
        date: v.string(),
        title: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
    },
    returns: v.id("timelineItem"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const now = Date.now()
        return await ctx.db.insert("timelineItem", {
            order: args.order,
            date: args.date,
            title: args.title,
            description: args.description,
            imageId: args.imageId,
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Update a timeline item
export const updateTimelineItem = mutation({
    args: {
        id: v.id("timelineItem"),
        order: v.optional(v.number()),
        date: v.optional(v.string()),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const item = await ctx.db.get(args.id)
        if (!item) {
            throw new Error("Timeline item not found")
        }

        const updates: any = {
            updatedAt: Date.now(),
        }

        if (args.order !== undefined) updates.order = args.order
        if (args.date !== undefined) updates.date = args.date
        if (args.title !== undefined) updates.title = args.title
        if (args.description !== undefined) updates.description = args.description
        if (args.imageId !== undefined) updates.imageId = args.imageId

        await ctx.db.patch(args.id, updates)
        return null
    },
})

// Delete a timeline item
export const deleteTimelineItem = mutation({
    args: { id: v.id("timelineItem") },
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

// Reorder timeline items
export const reorderTimelineItems = mutation({
    args: {
        items: v.array(v.object({
            id: v.id("timelineItem"),
            order: v.number(),
        })),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const now = Date.now()
        for (const item of args.items) {
            await ctx.db.patch(item.id, { order: item.order, updatedAt: now })
        }
        return null
    },
})

