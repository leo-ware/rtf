import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"

// ── Queries ──

export const listCategories = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("wishlistCategories"),
        _creationTime: v.number(),
        name: v.string(),
        order: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db.query("wishlistCategories")
            .withIndex("by_order")
            .order("asc")
            .collect()
    },
})

export const listItems = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("wishlistItems"),
        _creationTime: v.number(),
        name: v.string(),
        category: v.string(),
        order: v.number(),
        link: v.optional(v.string()),
    })),
    handler: async (ctx) => {
        return await ctx.db.query("wishlistItems")
            .collect()
    },
})

export const listPublicWishlist = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("wishlistCategories"),
        _creationTime: v.number(),
        name: v.string(),
        order: v.number(),
        items: v.array(v.object({
            _id: v.id("wishlistItems"),
            _creationTime: v.number(),
            name: v.string(),
            category: v.string(),
            order: v.number(),
            link: v.optional(v.string()),
        })),
    })),
    handler: async (ctx) => {
        const categories = await ctx.db.query("wishlistCategories")
            .withIndex("by_order")
            .order("asc")
            .collect()

        const result = await Promise.all(categories.map(async (cat) => {
            const items = await ctx.db.query("wishlistItems")
                .withIndex("by_category", (q) => q.eq("category", cat.name))
                .collect()
            return { ...cat, items }
        }))

        return result
    },
})

// ── Category Mutations ──

export const createCategory = mutation({
    args: {
        name: v.string(),
        order: v.number(),
    },
    returns: v.id("wishlistCategories"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        return await ctx.db.insert("wishlistCategories", {
            name: args.name,
            order: args.order,
        })
    },
})

export const updateCategory = mutation({
    args: {
        id: v.id("wishlistCategories"),
        name: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const { id, ...patch } = args
        const cleanPatch: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(patch)) {
            if (value !== undefined) cleanPatch[key] = value
        }

        // If name changed, update all items referencing the old name
        if (cleanPatch.name) {
            const old = await ctx.db.get(id)
            if (old && old.name !== cleanPatch.name) {
                const items = await ctx.db.query("wishlistItems")
                    .withIndex("by_category", (q) => q.eq("category", old.name))
                    .collect()
                for (const item of items) {
                    await ctx.db.patch(item._id, { category: cleanPatch.name as string })
                }
            }
        }

        await ctx.db.patch(id, cleanPatch)
        return null
    },
})

export const deleteCategory = mutation({
    args: { id: v.id("wishlistCategories") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const cat = await ctx.db.get(args.id)
        if (cat) {
            const items = await ctx.db.query("wishlistItems")
                .withIndex("by_category", (q) => q.eq("category", cat.name))
                .collect()
            for (const item of items) {
                await ctx.db.delete(item._id)
            }
        }
        await ctx.db.delete(args.id)
        return null
    },
})

export const reorderCategories = mutation({
    args: {
        ids: v.array(v.id("wishlistCategories")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        for (let i = 0; i < args.ids.length; i++) {
            await ctx.db.patch(args.ids[i], { order: i })
        }
        return null
    },
})

// ── Item Mutations ──

export const createItem = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        order: v.number(),
        link: v.optional(v.string()),
    },
    returns: v.id("wishlistItems"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        return await ctx.db.insert("wishlistItems", {
            name: args.name,
            category: args.category,
            order: args.order,
            link: args.link,
        })
    },
})

export const updateItem = mutation({
    args: {
        id: v.id("wishlistItems"),
        name: v.optional(v.string()),
        category: v.optional(v.string()),
        order: v.optional(v.number()),
        link: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const { id, ...patch } = args
        const cleanPatch: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(patch)) {
            if (value !== undefined) cleanPatch[key] = value
        }
        await ctx.db.patch(id, cleanPatch)
        return null
    },
})

export const deleteItem = mutation({
    args: { id: v.id("wishlistItems") },
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

export const reorderItems = mutation({
    args: {
        ids: v.array(v.id("wishlistItems")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        for (let i = 0; i < args.ids.length; i++) {
            await ctx.db.patch(args.ids[i], { order: i })
        }
        return null
    },
})
