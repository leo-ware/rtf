import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { paginationOptsValidator } from "convex/server"
import { getCurrentUserOrThrow } from "./users"
import LocationManager from "./models/locationManager"

// Public: Search locations by name with pagination
export const searchLocations = query({
    args: {
        query: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await LocationManager.search(ctx, args.query, args.paginationOpts)
    },
})

// Public: Get a single location by ID
export const getLocation = query({
    args: { id: v.id("locations") },
    handler: async (ctx, args) => {
        const manager = new LocationManager(args.id)
        return await manager.getWithImage(ctx)
    },
})

// Admin: Create a new location
export const createLocation = mutation({
    args: {
        name: v.string(),
        address: v.optional(v.string()),
        notes: v.optional(v.string()),
        mapsUrl: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = await LocationManager.create(ctx, args)
        return manager.id
    },
})

// Admin: Update an existing location
export const updateLocation = mutation({
    args: {
        id: v.id("locations"),
        name: v.optional(v.string()),
        address: v.optional(v.string()),
        notes: v.optional(v.string()),
        mapsUrl: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const { id, ...updates } = args
        const manager = new LocationManager(id)
        await manager.update(ctx, updates)
        return null
    },
})

// Admin: Delete a location
export const deleteLocation = mutation({
    args: { id: v.id("locations") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = new LocationManager(args.id)
        await manager.delete(ctx)
        return null
    },
})
