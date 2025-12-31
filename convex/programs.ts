import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { resolveImageId } from "./images"
import { removeUndefinedFields } from "./utils"

export const getProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        return await ctx.db
            .query("programGroups")
            .order("asc")
            .collect()
    }
})

export const getPublicProgramGroups = query({
    handler: async (ctx) => {
        const results = await ctx.db
            .query("programGroups")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
        const withImages = await Promise.all(results.map(async (result) => {
            return {
                ...result,
                image: result.imageId
                    ? await resolveImageId(ctx, result.imageId)
                    : null,
            }
        }))
        return withImages
    }
})

export const getProgramGroupById = query({
    args: { id: v.id("programGroups") },
    handler: async (ctx, args) => {
        const groupPromise = ctx.db.get(args.id)

        const programsPromise = ctx.db
            .query("programs")
            .withIndex("by_program_group", (q) => q.eq("programGroupId", args.id))
            .order("asc")
            .collect()

        const [group, programDocs] = await Promise.all([groupPromise, programsPromise])

        const programs = await Promise.all(programDocs.map(async (program) => {
            const [tickets, image] = await Promise.all([
                program.ticketPriceId
                    ? ctx.db.get(program.ticketPriceId)
                    : null,
                program.imageId
                    ? await resolveImageId(ctx, program.imageId)
                    : null,
            ])
            return {
                ...program,
                tickets,
                image,
            }
        }))

        if (!group) {
            return null
        }

        return {
            ...group,
            image: group?.imageId
                ? await resolveImageId(ctx, group?.imageId)
                : null,
            programs: await Promise.all(programs
                .filter((program) => program.isPublic)
                .map(async (program) => {
                    return {
                        ...program,
                        image: program.imageId
                            ? await resolveImageId(ctx, program.imageId)
                            : null,
                    }
                })
            ),
        }
    }
})

// Get all programs (admin only)
export const getAllPrograms = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const programsPromise = ctx.db
            .query("programs")
            .order("asc")
            .collect()
        const eventsPromise = ctx.db.query("events").take(1000)
        const programGroupsPromise = ctx.db.query("programGroups").take(1000)

        const [programs, events, programGroups] = await Promise.all([
            programsPromise,
            eventsPromise,
            programGroupsPromise
        ])

        return await Promise.all(programs.map(async (program) => {
            return {
                ...program,
                programGroup: programGroups.find((group) => group._id === program.programGroupId),
                events: events
                    .filter((event) => event.programId === program._id)
                    .sort((a, b) => a.dateNumber - b.dateNumber),
                image: program.imageId
                    ? await resolveImageId(ctx, program.imageId)
                    : null,
            }
        }))
    },
})

// Get public programs only
export const getPublicPrograms = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("programs"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        details: v.string(),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("programs")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
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
                throw new Error("Insufficient permissions");
            }
        }

        const programs = await ctx.db
            .query("programs")
            .withIndex("by_program_group", (q) => q.eq("programGroupId", args.programGroupId))
            .order("asc")
            .collect()
        return await Promise.all(programs.map(async (program) => {
            return {
                ...program,
                image: program.imageId
                    ? await resolveImageId(ctx, program.imageId)
                    : null,
            }
        }))
    },
})

// Get a single program by ID
export const getProgramById = query({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.id)
        if (!program) {
            return null
        }

        // If not public, check admin auth
        if (!program.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions");
            }
        }

        const [image, events] = await Promise.all([
            program.imageId ? await resolveImageId(ctx, program.imageId) : null,
            await ctx.db.query("events")
                .withIndex("by_program", (q) => q.eq("programId", program._id))
                .order("desc")
                .collect()
        ])

        return {
            ...program,
            image,
            events,
        }
    },
})

// Get events for a specific program
export const getEventsByProgram = query({
    args: { programId: v.id("programs") },
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.programId)
        if (!program) {
            throw new Error("Program not found")
        }

        // If program is not public, check admin auth
        if (!program.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions");
            }
        }

        return await ctx.db
            .query("events")
            .withIndex("by_program", (q) => q.eq("programId", args.programId))
            .order("desc")
            .collect()
    },
})

// Create a new program
export const createProgram = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        details: v.string(),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        ticketPriceOptions: v.optional(v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
            availableBefore: v.optional(v.number()),
            availableAfter: v.optional(v.number()),
        }))),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
    },
    returns: v.id("programs"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        // Verify program group exists
        const programGroup = await ctx.db.get(args.programGroupId)
        if (!programGroup) {
            throw new Error("Program group not found")
        }

        const { ticketPriceOptions, ...programArgs } = args

        // Create ticketPrice if options provided
        let ticketPriceId = programArgs.ticketPriceId
        if (ticketPriceOptions && ticketPriceOptions.length > 0) {
            ticketPriceId = await ctx.db.insert("ticketPrice", {
                options: ticketPriceOptions,
            })
        }

        return await ctx.db.insert("programs", {
            ...programArgs,
            ticketPriceId,
        })
    },
})

// Update an existing program
export const updateProgram = mutation({
    args: {
        id: v.id("programs"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        details: v.optional(v.string()),
        ticketPriceId: v.optional(v.id("ticketPrice")),
        ticketPriceOptions: v.optional(v.array(v.object({
            name: v.string(),
            description: v.optional(v.string()),
            price: v.number(),
            availableBefore: v.optional(v.number()),
            availableAfter: v.optional(v.number()),
        }))),
        location: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
        imageId: v.optional(v.id("images")),
        programGroupId: v.optional(v.id("programGroups")),
        order: v.optional(v.number()),
        requiresRegistration: v.optional(v.boolean()),
        contactEmail: v.optional(v.string()),
        contactPhone: v.optional(v.string()),
        maxAttendees: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const { id, ticketPriceOptions, ...updates } = args

        // If changing program group, verify it exists
        if (updates.programGroupId) {
            const programGroup = await ctx.db.get(updates.programGroupId)
            if (!programGroup) {
                throw new Error("Program group not found")
            }
        }

        const existingProgram = await ctx.db.get(id)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        // Handle ticketPrice update
        let ticketPriceId = updates.ticketPriceId
        if (ticketPriceOptions && ticketPriceOptions.length > 0) {
            // If program already has a ticketPriceId, update it; otherwise create new
            if (existingProgram.ticketPriceId) {
                await ctx.db.patch(existingProgram.ticketPriceId, {
                    options: ticketPriceOptions,
                })
                ticketPriceId = existingProgram.ticketPriceId
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
            }),
        })
        return null
    },
})

// Delete a program
export const deleteProgram = mutation({
    args: { id: v.id("programs") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const existingProgram = await ctx.db.get(args.id)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        // Check if there are any events using this program
        const eventsUsingProgram = await ctx.db
            .query("events")
            .withIndex("by_program", (q) => q.eq("programId", args.id))
            .collect()

        if (eventsUsingProgram.length > 0) {
            throw new Error("Cannot delete program that has associated events")
        }

        await ctx.db.delete(args.id)
        return null
    },
})

// Reorder programs
export const reorderPrograms = mutation({
    args: { ids: v.array(v.id("programs")) },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const previousPrograms = await ctx.db.query("programs").collect()
        const previousProgramIds = previousPrograms
            .sort((a, b) => a.order - b.order)
            .map((program) => program._id)

        const allSortedIds = [...args.ids]
        previousProgramIds.forEach((id) => {
            if (!allSortedIds.includes(id)) {
                allSortedIds.push(id)
            }
        })

        await Promise.all(allSortedIds.map(async (id, order) =>
            await ctx.db.patch(id, { order })
        ))
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
        isPublic: v.optional(v.boolean()),
        imageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const program = await ctx.db.get(args.programId)
        if (!program) {
            throw new Error("Program not found")
        }

        return await ctx.db.insert("events", {
            title: args.title || program.name,
            description: program.description,
            longDescription: program.details,
            startDate: args.startDate,
            dateNumber: Date.parse(args.startDate),
            endDate: args.endDate,
            location: program.location,
            maxAttendees: program.maxAttendees,
            ticketPriceId: program.ticketPriceId,
            isPublic: args.isPublic ?? false, // Default to not public
            requiresRegistration: program.requiresRegistration ?? false,
            contactEmail: program.contactEmail,
            contactPhone: program.contactPhone,
            imageId: args.imageId || program.imageId,
            programId: args.programId,
        })
    },
})
