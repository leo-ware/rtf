import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow, getCurrentUser } from "./users"
import { eventsAggregate } from "./aggregates"
import { paginationOptsValidator } from "convex/server"
import EventManager from "./models/eventManager"

// Get all events (admin only)
export const getAllEvents = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await EventManager.getAll(ctx)
    },
})

// Get public events only
export const getPublicEvents = query({
    args: {},
    handler: async (ctx) => {
        return await EventManager.getAll(ctx, { isPublic: true })
    },
})

export const getPaginatedEvents = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx)
        const publicOnly = !user || !user.atLeastAuthorized

        return await EventManager.getPaginated(ctx, { publicOnly }, args.paginationOpts)
    },
})

export const getUpcomingPaginatedEvents = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUser(ctx)
        const publicOnly = !user || !user.atLeastAuthorized

        return await EventManager.getUpcomingPaginated(ctx, { publicOnly }, args.paginationOpts)
    },
})

// Get upcoming standalone (one-off) events, public only
export const getUpcomingStandaloneEvents = query({
    args: {},
    handler: async (ctx) => {
        return await EventManager.getUpcomingStandalone(ctx)
    },
})

// Get a single event by ID
export const getEventById = query({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        const eventWithProgram = await EventManager.getById(ctx, args.id)
        if (!eventWithProgram) {
            return null
        }

        // If not public, check admin auth
        if (!eventWithProgram.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        return eventWithProgram
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
        locationId: v.optional(v.id("locations")),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        registrationLink: v.optional(v.string()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        programId: v.optional(v.id("programs")),
        ticketPriceText: v.optional(v.string()),
        status: v.optional(v.union(v.literal("scheduled"), v.literal("cancelled"), v.literal("sold_out"))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        if (args.requiresRegistration && !args.registrationLink?.trim()) {
            throw new Error("registrationLink is required when requiresRegistration is true")
        }

        const eventManager = await EventManager.create(ctx, args)

        const event = await eventManager.get(ctx)
        if (event) {
            await eventsAggregate.insert(ctx, event)
        }

        return eventManager.id
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
        locationId: v.optional(v.id("locations")),
        maxAttendees: v.optional(v.number()),
        isPublic: v.optional(v.boolean()),
        requiresRegistration: v.optional(v.boolean()),
        registrationLink: v.optional(v.string()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        status: v.optional(v.union(v.literal("scheduled"), v.literal("cancelled"), v.literal("sold_out"))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existingEvent = await ctx.db.get(args.id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }
        if (!existingEvent.programId) {
            throw new Error("Event has no associated program")
        }
        const existingProgram = await ctx.db.get(existingEvent.programId)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        const nextRequiresRegistration = args.requiresRegistration ?? (existingProgram.requiresRegistration ?? false)
        if (nextRequiresRegistration) {
            const nextRegistrationLink = args.registrationLink ?? existingEvent.registrationLink
            if (!nextRegistrationLink?.trim()) {
                throw new Error("registrationLink is required when requiresRegistration is true")
            }
        }

        const { id, ...updates } = args
        const eventManager = new EventManager(id)
        await eventManager.update(ctx, updates)

        return null
    },
})

// Quick status update for an event
export const updateEventStatus = mutation({
    args: {
        id: v.id("events"),
        status: v.union(v.literal("scheduled"), v.literal("cancelled"), v.literal("sold_out")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const event = await ctx.db.get(args.id)
        if (!event) {
            throw new Error("Event not found")
        }

        await ctx.db.patch(args.id, { status: args.status })
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

        const eventManager = new EventManager(args.id)
        const event = await eventManager.get(ctx)

        if (!event) {
            throw new Error("Event not found")
        }

        await eventsAggregate.delete(ctx, event)
        await eventManager.delete(ctx)

        return null
    },
})
