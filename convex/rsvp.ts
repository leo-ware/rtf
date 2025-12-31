import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import RsvpManager from "./models/rsvpManager"

const ticketValidator = v.object({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
})

const rsvpReturnValidator = v.object({
    _id: v.id("rsvp"),
    _creationTime: v.number(),
    eventId: v.id("events"),
    email: v.string(),
    name: v.string(),
    tickets: v.array(ticketValidator),
    additionalDonation: v.optional(v.number()),
    discountCode: v.optional(v.id("discountCodes")),
    priceBeforeDiscount: v.number(),
    finalPrice: v.number(),
})

export const calculateCost = query({
    args: {
        eventId: v.id("events"),
        tickets: v.array(v.object({
            name: v.string(),
            quantity: v.number(),
        })),
        additionalDonation: v.optional(v.number()),
        discountCode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await RsvpManager.calculateCost(ctx, args)
    }
})

export const createRsvp = mutation({
    args: {
        eventId: v.id("events"),
        email: v.string(),
        name: v.string(),
        tickets: v.array(ticketValidator),
        additionalDonation: v.optional(v.number()),
        discountCodeString: v.optional(v.string()),
    },
    returns: v.id("rsvp"),
    handler: async (ctx, args) => {
        const manager = await RsvpManager.create(ctx, args)
        return manager.id
    },
})

export const getRsvpsByEvent = query({
    args: {
        eventId: v.id("events"),
    },
    returns: v.array(rsvpReturnValidator),
    handler: async (ctx, args) => {
        return await RsvpManager.getByEvent(ctx, args.eventId)
    },
})

export const getRsvpsByEmail = query({
    args: {
        email: v.string(),
    },
    returns: v.array(rsvpReturnValidator),
    handler: async (ctx, args) => {
        return await RsvpManager.getByEmail(ctx, args.email)
    },
})

export const getRsvpById = query({
    args: {
        id: v.id("rsvp"),
    },
    returns: v.union(rsvpReturnValidator, v.null()),
    handler: async (ctx, args) => {
        return await RsvpManager.getById(ctx, args.id)
    },
})

export const deleteRsvp = mutation({
    args: {
        id: v.id("rsvp"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const manager = new RsvpManager(args.id)
        await manager.delete(ctx)
        return null
    },
})
