import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { resolveImageId } from "./images"
import ProgramManager from "./models/programManager"

export const getProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        return await ctx.db
            .query("programGroups")
            .order("asc")
            .collect()
    },
})

export const getPublicProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db
            .query("programGroups")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
        const withImages = await Promise.all(
            results.map(async (result) => ({
                ...result,
                image: result.imageId
                    ? await resolveImageId(ctx, result.imageId)
                    : null,
            }))
        )
        return withImages
    },
})

export const getProgramGroupById = query({
    args: { id: v.id("programGroups") },
    handler: async (ctx, args) => {
        const groupPromise = ctx.db.get(args.id)
        const programs = await ProgramManager.getByProgramGroup(ctx, args.id)

        const group = await groupPromise

        const programsWithTickets = await Promise.all(
            programs.map(async (program) => {
                const tickets = program.ticketPriceId
                    ? await ctx.db.get(program.ticketPriceId)
                    : null
                return {
                    ...program,
                    tickets,
                }
            })
        )

        if (!group) {
            return null
        }

        return {
            ...group,
            image: group?.imageId
                ? await resolveImageId(ctx, group?.imageId)
                : null,
            programs: programsWithTickets.filter((program) => program.isPublic),
        }
    },
})

// Get all programs (admin only)
export const getAllPrograms = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        return await ProgramManager.getAll(ctx)
    },
})

// Get public programs only
export const getPublicPrograms = query({
    args: {},
    returns: v.array(
        v.object({
            _id: v.id("programs"),
            _creationTime: v.number(),
            name: v.string(),
            description: v.string(),
            details: v.string(),
            ticketPriceId: v.optional(v.id("ticketPrice")),
            ticketPriceText: v.optional(v.string()),
            locationId: v.id("locations"),
            isPublic: v.boolean(),
            imageId: v.optional(v.id("images")),
            programGroupId: v.id("programGroups"),
            order: v.number(),
            maxAttendees: v.optional(v.number()),
            requiresRegistration: v.optional(v.boolean()),
            contactEmail: v.optional(v.string()),
            contactPhone: v.optional(v.string()),
        })
    ),
    handler: async (ctx) => {
        const programs = await ProgramManager.getAll(ctx, { isPublic: true })
        return programs.map(({
            _id,
            _creationTime,
            name,
            description,
            details,
            ticketPriceId,
            ticketPriceText,
            locationId,
            isPublic,
            imageId,
            programGroupId,
            order,
            maxAttendees,
            requiresRegistration,
            contactEmail,
            contactPhone,
        }) => ({
            _id,
            _creationTime,
            name,
            description,
            details,
            ticketPriceId,
            ticketPriceText,
            locationId,
            isPublic,
            imageId,
            programGroupId,
            order,
            maxAttendees,
            requiresRegistration,
            contactEmail,
            contactPhone,
        }))
    },
})

// Get programs by program group
export const getProgramsByGroup = query({
    args: { programGroupId: v.id("programGroups") },
    handler: async (ctx, args) => {
        const programGroup = await ctx.db.get(args.programGroupId)
        if (!programGroup) {
            throw new Error("Program group not found")
        }

        // If program group is not public, check admin auth
        if (!programGroup.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        return await ProgramManager.getByProgramGroup(ctx, args.programGroupId)
    },
})

// Get a single program by ID
export const getProgramById = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const manager = new ProgramManager(args.id)
        const program = await manager.get(ctx)

        if (!program) {
            return null
        }

        // If not public, check admin auth
        if (!program.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        return await manager.getWithRelations(ctx)
    },
})

// Get events for a specific program
export const getEventsByProgram = query({
    args: { programId: v.id("programs") },
    handler: async (ctx, args) => {
        const manager = new ProgramManager(args.programId)
        const program = await manager.get(ctx)

        if (!program) {
            throw new Error("Program not found")
        }

        // If program is not public, check admin auth
        if (!program.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions")
            }
        }

        return await manager.getEvents(ctx)
    },
})

// Create a new program
export const createProgram = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        details: v.string(),
        locationId: v.id("locations"),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
        ticketPriceText: v.optional(v.string()),
    },
    returns: v.id("programs"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const manager = await ProgramManager.create(ctx, args)
        return manager.id
    },
})

// Update an existing program
export const updateProgram = mutation({
    args: {
        id: v.id("programs"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        details: v.optional(v.string()),
        locationId: v.optional(v.id("locations")),
        isPublic: v.optional(v.boolean()),
        imageId: v.optional(v.id("images")),
        programGroupId: v.optional(v.id("programGroups")),
        order: v.optional(v.number()),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
        ticketPriceText: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const { id, ...updates } = args
        const manager = new ProgramManager(id)
        await manager.update(ctx, updates)
        return null
    },
})

// Delete a program and all associated events
export const deleteProgram = mutation({
    args: { id: v.id("programs") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const manager = new ProgramManager(args.id)
        await manager.delete(ctx)
        return null
    },
})

// Reorder programs
export const reorderPrograms = mutation({
    args: { ids: v.array(v.id("programs")) },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ProgramManager.reorder(ctx, args.ids)
        return null
    },
})

// Create event from program template
export const createEventFromProgram = mutation({
    args: {
        programId: v.id("programs"),
        startDate: v.string(),
        endDate: v.string(),
        title: v.optional(v.string()),
        registrationLink: v.optional(v.string()),
    },
    returns: v.id("events"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const program = await ctx.db.get(args.programId)
        if (!program) {
            throw new Error("Program not found")
        }

        const requiresRegistration = program.requiresRegistration ?? false
        if (requiresRegistration && !args.registrationLink?.trim()) {
            throw new Error("registrationLink is required when requiresRegistration is true")
        }

        const manager = new ProgramManager(args.programId)
        return await manager.createEvent(ctx, {
            startDate: args.startDate,
            endDate: args.endDate,
            title: args.title,
            registrationLink: args.registrationLink,
        })
    },
})
