import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { resolveImageId } from "./images"

// Get all program groups (admin only)
export const getAllProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const programGroups = await ctx.db
            .query("programGroups")
            .order("asc")
            .collect()
        
        return Promise.all(programGroups.map(async (programGroup) => {
            return {
                ...programGroup,
                image: programGroup.imageId
                    ? await resolveImageId(ctx, programGroup.imageId)
                    : null,
            }
        }))
    },
})

// Get public program groups only
export const getPublicProgramGroups = query({
    args: {},
    handler: async (ctx) => {
        const programGroups = await ctx.db
            .query("programGroups")
            .withIndex("by_public", (q) => q.eq("isPublic", true))
            .order("asc")
            .collect()
        return Promise.all(programGroups.map(async (programGroup) => {
            return {
                ...programGroup,
                image: programGroup.imageId
                    ? await resolveImageId(ctx, programGroup.imageId)
                    : null,
            }
        }))
    },
})

// Get a single program group by ID
export const getProgramGroupById = query({
    args: { id: v.id("programGroups") },
    handler: async (ctx, args) => {
        const programGroup = await ctx.db.get(args.id)
        if (!programGroup) {
            return null
        }

        // If not public, check admin auth
        if (!programGroup.isPublic) {
            const user = await getCurrentUserOrThrow(ctx)
            if (!user.atLeastAuthorized) {
                throw new Error("Insufficient permissions");
            }
        }

        return {
            ...programGroup,
            image: programGroup.imageId
                ? await resolveImageId(ctx, programGroup.imageId)
                : null,
        }
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
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        return await ctx.db.insert("programGroups", {
            ...args,
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
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const { id, ...updates } = args

        await ctx.db.patch(id, {
            ...updates,
        })
        return null
    },
})

export const reorderProgramGroups = mutation({
    args: { ids: v.array(v.id("programGroups")) },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

        const previousProgramGroups = await ctx.db.query("programGroups").collect()
        const previousProgramGroupIds = previousProgramGroups
            .sort((a, b) => a.order - b.order)
            .map((group) => group._id)
        
        const allSortedIds = [...args.ids]
        previousProgramGroupIds.forEach((id) => {
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

// Delete a program group
export const deleteProgramGroup = mutation({
    args: { id: v.id("programGroups") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }

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
