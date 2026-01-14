import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"

const ticketPriceOptionValidator = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    availableBefore: v.optional(v.number()),
    availableAfter: v.optional(v.number()),
})

export const listTicketPrices = query({
    args: {},
    handler: async (ctx) => {
        const ticketPrices = await ctx.db
            .query("ticketPrice")
            .order("desc")
            .collect()
        return ticketPrices
    },
})

export const getTicketPrice = query({
    args: { id: v.id("ticketPrice") },
    handler: async (ctx, args) => {
        const ticketPrice = await ctx.db.get(args.id)
        return ticketPrice
    },
})

export const createTicketPrice = mutation({
    args: {
        options: v.array(ticketPriceOptionValidator),
    },
    returns: v.id("ticketPrice"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.insert("ticketPrice", {
            options: args.options,
        })
    },
})

export const updateTicketPrice = mutation({
    args: {
        id: v.id("ticketPrice"),
        options: v.array(ticketPriceOptionValidator),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const ticketPrice = await ctx.db.get(args.id)
        if (!ticketPrice) {
            throw new Error("Ticket price not found")
        }

        await ctx.db.patch(args.id, {
            options: args.options,
        })
        return null
    },
})

export const deleteTicketPrice = mutation({
    args: { id: v.id("ticketPrice") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const ticketPrice = await ctx.db.get(args.id)
        if (!ticketPrice) {
            throw new Error("Ticket price not found")
        }

        await ctx.db.delete(args.id)
        return null
    },
})








