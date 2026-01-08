import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"

export const listJobListings = query({
    args: {
        limit: v.optional(v.number()),
        includeExpired: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 100
        const includeExpired = args.includeExpired ?? false

        const baseQuery = ctx.db
            .query("jobListings")
            .withIndex("by_application_deadline", (q) => {
                if (includeExpired) {
                    return q
                }
                return q.gte("applicationDeadline", Date.now())
            })
            .order("asc")

        return await baseQuery.take(limit)
    },
})

export const getJobListing = query({
    args: { id: v.id("jobListings") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    },
})

export const createJobListing = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        applicationDeadline: v.number(),
        applicationFormLink: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.insert("jobListings", {
            name: args.name,
            description: args.description,
            applicationDeadline: args.applicationDeadline,
            applicationFormLink: args.applicationFormLink,
            order: 1000 + Math.floor(Math.random() * 1000),
        })
    },
})

export const updateJobListing = mutation({
    args: {
        id: v.id("jobListings"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        applicationDeadline: v.optional(v.number()),
        applicationFormLink: v.optional(v.string()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Job listing not found")
        }

        const { id, ...updates } = args

        await ctx.db.patch(id, {
            ...updates,
        })

        return null
    },
})

export const reorderJobListings = mutation({
    args: {
        jobListings: v.array(v.id("jobListings")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions")
        }

        await Promise.all(args.jobListings.map(async (id, order) => await ctx.db.patch(id, { order })))
    }
})

export const deleteJobListing = mutation({
    args: { id: v.id("jobListings") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAdmin) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Job listing not found")
        }

        await ctx.db.delete(args.id)
        return null
    },
})


