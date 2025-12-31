import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { eventsAggregate } from "./aggregates"
import { paginationOptsValidator } from "convex/server"
import { removeUndefinedFields } from "./utils"
import { resolveImageId } from "./images"

// Get all events (admin only)
export const getAllEvents = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        return await ctx.db
            .query("events")
            .withIndex("by_date_number")
            .order("desc")
            .collect()
    },
})

// Get public events only
export const getPublicEvents = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("events")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()
    },
})

export const getPaginatedEvents = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("events")
            .withIndex("by_date_number")
            .order("desc")
            .paginate(args.paginationOpts);
    },
})

// // Get events by date range (public events only)
// export const getEventsByDateRange = query({
//     args: {
//         startDate: v.number(),
//         endDate: v.number(),
//     },
//     handler: async (ctx, args) => {
//         return await ctx.db
//             .query("events")
//             .withIndex("by_start_date", (q) =>
//                 q.gte("startDate", args.startDate).lte("startDate", args.endDate)
//             )
//             .filter((q) => q.eq(q.field("isPublic"), true))
//             .order("asc")
//             .collect()
//     },
// })

// Get a single event by ID
export const getEventById = query({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.id)
        if (!event) {
            return null
        }

        // If not public, check admin auth
        if (!event.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions");
            }
        }

        return {
            ...event,
            image: event.imageId ? await resolveImageId(ctx, event.imageId) : null,
            tickets: event.ticketPriceId ? await ctx.db.get(event.ticketPriceId) : null,
        }
    },
})

// Create a new event
export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.string(),
        location: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        ticketPriceOptions: v.optional(v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
            availableBefore: v.optional(v.number()),
            availableAfter: v.optional(v.number()),
        }))),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        programId: v.optional(v.id("programs")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const { ticketPriceOptions, ...eventArgs } = args

        // Create ticketPrice if options provided
        let ticketPriceId = eventArgs.ticketPriceId
        if (ticketPriceOptions && ticketPriceOptions.length > 0) {
            ticketPriceId = await ctx.db.insert("ticketPrice", {
                options: ticketPriceOptions,
            })
        }

        const eventId = await ctx.db.insert("events", {
            ...eventArgs,
            ticketPriceId,
            dateNumber: Date.parse(args.startDate),
        })
        const event = await ctx.db.get(eventId)
        if (event) {
            await eventsAggregate.insert(ctx, event)
        }
        return eventId
    },
})

// Update an existing event
export const updateEvent = mutation({
    args: {
        id: v.id("events"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        longDescription: v.optional(v.string()),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        location: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        ticketPriceOptions: v.optional(v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
            availableBefore: v.optional(v.number()),
            availableAfter: v.optional(v.number()),
        }))),
        isPublic: v.optional(v.boolean()),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        programId: v.optional(v.id("programs")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const { id, ticketPriceOptions, ...updates } = args

        const existingEvent = await ctx.db.get(id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        // Handle ticketPrice update
        let ticketPriceId = updates.ticketPriceId
        if (ticketPriceOptions && ticketPriceOptions.length > 0) {
            // If event already has a ticketPriceId, update it; otherwise create new
            if (existingEvent.ticketPriceId) {
                await ctx.db.patch(existingEvent.ticketPriceId, {
                    options: ticketPriceOptions,
                })
                ticketPriceId = existingEvent.ticketPriceId
            } else {
                ticketPriceId = await ctx.db.insert("ticketPrice", {
                    options: ticketPriceOptions,
                })
            }
        }

        await ctx.db.patch(id, {
            ...removeUndefinedFields({
                ...updates,
                ticketPriceId,
                dateNumber: Date.parse(updates.startDate ?? ""),
            }),
        })
        return null
    },
})

// Delete an event
export const deleteEvent = mutation({
    args: { id: v.id("events") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingEvent = await ctx.db.get(args.id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        await eventsAggregate.delete(ctx, existingEvent)
        await ctx.db.delete(args.id)
        return null
    },
})


