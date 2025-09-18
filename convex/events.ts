import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { getAuthUserId } from "@convex-dev/auth/server"

// Get all events
export const getAllEvents = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("events"),
        _creationTime: v.number(),
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        currentAttendees: v.number(),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("events")
            .order("desc")
            .collect()
    },
})

// Get public events only
export const getPublicEvents = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("events"),
        _creationTime: v.number(),
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        currentAttendees: v.number(),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("events")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("desc")
            .collect()
    },
})

// Get events by date range
export const getEventsByDateRange = query({
    args: {
        startDate: v.number(),
        endDate: v.number(),
    },
    returns: v.array(v.object({
        _id: v.id("events"),
        _creationTime: v.number(),
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        currentAttendees: v.number(),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("events")
            .withIndex("by_start_date", (q) => 
                q.gte("startDate", args.startDate).lte("startDate", args.endDate)
            )
            .order("asc")
            .collect()
    },
})

// Get a single event by ID
export const getEventById = query({
    args: { id: v.id("events") },
    returns: v.union(
        v.object({
            _id: v.id("events"),
            _creationTime: v.number(),
            title: v.string(),
            description: v.string(),
        longDescription: v.optional(v.string()),
            startDate: v.number(),
            endDate: v.number(),
            location: v.optional(v.string()),
            eventType: v.union(
                v.literal("tour"),
                v.literal("volunteer"),
                v.literal("photo_safari"),
                v.literal("educational"),
                v.literal("fundraising"),
                v.literal("other")
            ),
            maxAttendees: v.optional(v.number()),
            currentAttendees: v.number(),
            price: v.optional(v.number()),
            isPublic: v.boolean(),
            requiresRegistration: v.boolean(),
            contactEmail: v.optional(v.string()),
            contactPhone: v.optional(v.string()),
            imageUrl: v.optional(v.string()),
            createdBy: v.id("users"),
            createdAt: v.number(),
            updatedAt: v.number(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id)
    },
})

// Create a new event
export const createEvent = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    returns: v.id("events"),
    handler: async (ctx, args) => {
        const now = Date.now()
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated")
        }
        return await ctx.db.insert("events", {
            ...args,
            currentAttendees: 0,
            createdAt: now,
            updatedAt: now,
            createdBy: userId,
        })
    },
})

// Update an existing event
export const updateEvent = mutation({
    args: {
        id: v.id("events"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        longDescription: v.optional(v.string()),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        location: v.optional(v.string()),
        eventType: v.optional(v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        )),
        maxAttendees: v.optional(v.number()),
        price: v.optional(v.number()),
        isPublic: v.optional(v.boolean()),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        const existingEvent = await ctx.db.get(id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        })
        return null
    },
})

// Delete an event
export const deleteEvent = mutation({
    args: { id: v.id("events") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existingEvent = await ctx.db.get(args.id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        await ctx.db.delete(args.id)
        return null
    },
})

// Update attendee count
export const updateAttendeeCount = mutation({
    args: {
        id: v.id("events"),
        currentAttendees: v.number(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const existingEvent = await ctx.db.get(args.id)
        if (!existingEvent) {
            throw new Error("Event not found")
        }

        await ctx.db.patch(args.id, {
            currentAttendees: args.currentAttendees,
            updatedAt: Date.now(),
        })
        return null
    },
})

// Get events by type
export const getEventsByType = query({
    args: {
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
    },
    returns: v.array(v.object({
        _id: v.id("events"),
        _creationTime: v.number(),
        title: v.string(),
        description: v.string(),
        longDescription: v.optional(v.string()),
        startDate: v.number(),
        endDate: v.number(),
        location: v.optional(v.string()),
        eventType: v.union(
            v.literal("tour"),
            v.literal("volunteer"),
            v.literal("photo_safari"),
            v.literal("educational"),
            v.literal("fundraising"),
            v.literal("other")
        ),
        maxAttendees: v.optional(v.number()),
        currentAttendees: v.number(),
        price: v.optional(v.number()),
        isPublic: v.boolean(),
        requiresRegistration: v.boolean(),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx, args) => {
        return await ctx.db
            .query("events")
            .withIndex("by_event_type", (q) => q.eq("eventType", args.eventType))
            .order("desc")
            .collect()
    },
})
