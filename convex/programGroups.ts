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

// Get all program groups (admin only)
export const getAllProgramGroups = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("programGroups"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
        order: v.number(),
        isPublic: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        await checkAdminAuth(ctx)
        return await ctx.db
            .query("programGroups")
            .order("asc")
            .collect()
    },
})

// Get public program groups only
export const getPublicProgramGroups = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("programGroups"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
        order: v.number(),
        isPublic: v.boolean(),
        createdBy: v.id("users"),
        createdAt: v.number(),
        updatedAt: v.number(),
    })),
    handler: async (ctx) => {
        return await ctx.db
            .query("programGroups")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
    },
})

// Get a single program group by ID
export const getProgramGroupById = query({
    args: { id: v.id("programGroups") },
    returns: v.union(
        v.object({
            _id: v.id("programGroups"),
            _creationTime: v.number(),
            name: v.string(),
            description: v.string(),
            imageId: v.optional(v.id("images")),
            order: v.number(),
            isPublic: v.boolean(),
            createdBy: v.id("users"),
            createdAt: v.number(),
            updatedAt: v.number(),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const programGroup = await ctx.db.get(args.id)
        if (!programGroup) {
            return null
        }
        
        // If not public, check admin auth
        if (!programGroup.isPublic) {
            await checkAdminAuth(ctx)
        }
        
        return programGroup
    },
})

// Create a new program group
export const createProgramGroup = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        imageId: v.optional(v.id("images")),
        order: v.number(),
        isPublic: v.boolean(),
    },
    returns: v.id("programGroups"),
    handler: async (ctx, args) => {
        const userId = await checkAdminAuth(ctx)
        const now = Date.now()
        
        return await ctx.db.insert("programGroups", {
            ...args,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
        })
    },
})

// Update an existing program group
export const updateProgramGroup = mutation({
    args: {
        id: v.id("programGroups"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        order: v.optional(v.number()),
        isPublic: v.optional(v.boolean()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await checkAdminAuth(ctx)
        const { id, ...updates } = args
        
        const existingProgramGroup = await ctx.db.get(id)
        if (!existingProgramGroup) {
            throw new Error("Program group not found")
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        })
        return null
    },
})

// Delete a program group
export const deleteProgramGroup = mutation({
    args: { id: v.id("programGroups") },
    returns: v.null(),
    handler: async (ctx, args) => {
        await checkAdminAuth(ctx)
        
        const existingProgramGroup = await ctx.db.get(args.id)
        if (!existingProgramGroup) {
            throw new Error("Program group not found")
        }

        // Check if there are any programs in this group
        const programsInGroup = await ctx.db
            .query("programs")
            .withIndex("by_program_group", (q) => q.eq("programGroupId", args.id))
            .collect()
        
        if (programsInGroup.length > 0) {
            throw new Error("Cannot delete program group that contains programs")
        }

        await ctx.db.delete(args.id)
        return null
    },
})
