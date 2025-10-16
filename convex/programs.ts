import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { getAuthUserId } from "@convex-dev/auth/server"

// Helper function to check if user has admin privileges
const checkAdminAuth = async (ctx: any) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
        throw new Error("User not authenticated")
    }

    const user = await ctx.db.get(userId)
    if (!user || !user.role || !["authorized", "admin", "dev"].includes(user.role)) {
        throw new Error("User not authorized")
    }

    return userId
}

export const getProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        await checkAdminAuth(ctx)
        return await ctx.db
            .query("programGroups")
            .order("asc")
            .collect()
    }
})

export const getPublicProgramGroups = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("programGroups")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
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
        
        const [group, programs] = await Promise.all([groupPromise, programsPromise])
        
        return {
            ...group,
            programs: programs.filter((program) => program.isPublic),
        }
    }
})

// Get all programs (admin only)
export const getAllPrograms = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("programs"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        details: v.string(),
        price: v.optional(v.number()),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        await checkAdminAuth(ctx)
        return await ctx.db
            .query("programs")
            .order("asc")
            .collect()
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
        price: v.optional(v.number()),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
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
    returns: v.array(v.object({
        _id: v.id("programs"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        details: v.string(),
        price: v.optional(v.number()),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx, args) => {
        const programGroup = await ctx.db.get(args.programGroupId)
        if (!programGroup) {
            throw new Error("Program group not found")
        }

        // If program group is not public, check admin auth
        if (!programGroup.isPublic) {
            await checkAdminAuth(ctx)
        }

        return await ctx.db
            .query("programs")
            .withIndex("by_program_group", (q) => q.eq("programGroupId", args.programGroupId))
            .order("asc")
            .collect()
    },
})

// Get a single program by ID
export const getProgramById = query({
    args: { id: v.id("programs") },
    returns: v.union(
        v.object({
            _id: v.id("programs"),
            _creationTime: v.number(),
            name: v.string(),
            description: v.string(),
            details: v.string(),
            price: v.optional(v.number()),
            location: v.string(),
            isPublic: v.boolean(),
            imageId: v.optional(v.id("images")),
            programGroupId: v.id("programGroups"),
            order: v.number(),
            createdBy: v.id("users"),
            createdAt: v.number(),
            updatedAt: v.number(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.id)
        if (!program) {
            return null
        }

        // If not public, check admin auth
        if (!program.isPublic) {
            await checkAdminAuth(ctx)
        }

        return program
    },
})

// Get events for a specific program
export const getEventsByProgram = query({
    args: { programId: v.id("programs") },
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
        programId: v.optional(v.id("programs")),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx, args) => {
        const program = await ctx.db.get(args.programId)
        if (!program) {
            throw new Error("Program not found")
        }

        // If program is not public, check admin auth
        if (!program.isPublic) {
            await checkAdminAuth(ctx)
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
        price: v.optional(v.number()),
        location: v.string(),
        isPublic: v.boolean(),
        imageId: v.optional(v.id("images")),
        programGroupId: v.id("programGroups"),
        order: v.number(),
    },
    returns: v.id("programs"),
    handler: async (ctx, args) => {
        const userId = await checkAdminAuth(ctx)

        // Verify program group exists
        const programGroup = await ctx.db.get(args.programGroupId)
        if (!programGroup) {
            throw new Error("Program group not found")
        }

        const now = Date.now()
        return await ctx.db.insert("programs", {
            ...args,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
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
        price: v.optional(v.number()),
        location: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
        imageId: v.optional(v.id("images")),
        programGroupId: v.optional(v.id("programGroups")),
        order: v.optional(v.number()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await checkAdminAuth(ctx)
        const { id, ...updates } = args

        const existingProgram = await ctx.db.get(id)
        if (!existingProgram) {
            throw new Error("Program not found")
        }

        // If changing program group, verify it exists
        if (updates.programGroupId) {
            const programGroup = await ctx.db.get(updates.programGroupId)
            if (!programGroup) {
                throw new Error("Program group not found")
            }
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        })
        return null
    },
})

// Delete a program
export const deleteProgram = mutation({
    args: { id: v.id("programs") },
    returns: v.null(),
    handler: async (ctx, args) => {
        await checkAdminAuth(ctx)

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

// Create event from program template
export const createEventFromProgram = mutation({
    args: {
        programId: v.id("programs"),
        startDate: v.number(),
        endDate: v.number(),
        title: v.optional(v.string()),
        isPublic: v.optional(v.boolean()),
    },
    returns: v.id("events"),
    handler: async (ctx, args) => {
        const userId = await checkAdminAuth(ctx)

        const program = await ctx.db.get(args.programId)
        if (!program) {
            throw new Error("Program not found")
        }

        const now = Date.now()
        const longDescription = program.description + "\n\n" + program.details

        return await ctx.db.insert("events", {
            title: args.title || program.name,
            description: program.description,
            longDescription: longDescription,
            startDate: args.startDate,
            endDate: args.endDate,
            location: program.location,
            eventType: "other", // Default event type, can be changed later
            maxAttendees: undefined,
            currentAttendees: 0,
            price: program.price,
            isPublic: args.isPublic ?? false, // Default to not public
            requiresRegistration: true,
            contactEmail: undefined,
            contactPhone: undefined,
            imageUrl: undefined,
            programId: args.programId,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
        })
    },
})
