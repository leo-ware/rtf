import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { Id } from "./_generated/dataModel"
import { resolveImageId } from "./images"

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

// Helper function to add image data to herd
async function addImageToHerd(ctx: any, herd: any) {
    const image = herd.imageId ? await ctx.db.get(herd.imageId) : null
    const imageUrl = image ? await ctx.storage.getUrl(image.storageId) : undefined
    return {
        ...herd,
        image: (image && imageUrl) ? {
            _id: image._id,
            fileName: image.fileName,
            originalName: image.originalName,
            mimeType: image.mimeType,
            size: image.size,
            storageId: image.storageId,
            altText: image.altText,
            description: image.description,
            isPublic: image.isPublic,
            width: image.width,
            height: image.height,
            url: imageUrl,
        } : undefined,
    }
}

const herdReturnValidator = v.object({
    _id: v.id("herds"),
    _creationTime: v.number(),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("images")),
    timeline: v.optional(v.array(v.id("timelineItem"))),
    createdAt: v.number(),
    updatedAt: v.number(),
    image: v.optional(v.object({
        _id: v.id("images"),
        fileName: v.string(),
        originalName: v.string(),
        mimeType: v.string(),
        size: v.number(),
        storageId: v.id("_storage"),
        altText: v.optional(v.string()),
        description: v.optional(v.string()),
        isPublic: v.boolean(),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        url: v.string(),
    })),
})

export const listHerds = query({
    args: {
        limit: v.optional(v.number()),
    },
    returns: v.array(herdReturnValidator),
    handler: async (ctx, args) => {
        const herds = await ctx.db
            .query("herds")
            .order("desc")
            .take(args.limit || 100)
        
        return await Promise.all(herds.map(herd => addImageToHerd(ctx, herd)))
    },
})

export const getHerd = query({
    args: { id: v.id("herds") },
    returns: v.union(v.null(), herdReturnValidator),
    handler: async (ctx, args) => {
        const herd = await ctx.db.get(args.id)
        if (!herd) return null
        return await addImageToHerd(ctx, herd)
    },
})

export const getHerdByName = query({
    args: { name: v.string() },
    returns: v.union(v.null(), herdReturnValidator),
    handler: async (ctx, args) => {
        // Note: This loads all herds into memory and should only be used if herds count is small
        // For better performance, use getHerdBySlug() with a generated slug
        const herds = await ctx.db.query("herds").collect()
        const herd = herds.find((h) => h.name === args.name) || null
        if (!herd) return null
        return await addImageToHerd(ctx, herd)
    },
})

export const getHerdBySlug = query({
    args: { slug: v.string() },
    returns: v.union(v.null(), herdReturnValidator),
    handler: async (ctx, args) => {
        const herd = await ctx.db
            .query("herds")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique()
        if (!herd) return null
        return await addImageToHerd(ctx, herd)
    },
})

export const createHerd = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        timeline: v.optional(v.array(v.id("timelineItem"))),
    },
    returns: v.id("herds"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Input validation: name cannot be empty
        if (args.name.trim().length === 0) {
            throw new Error("Herd name cannot be empty")
        }

        const slug = generateSlug(args.name)

        // Validate that slug generation worked
        if (slug.length === 0) {
            throw new Error("Invalid herd name: cannot generate valid slug")
        }

        // Check if slug already exists
        const existingHerd = await ctx.db
            .query("herds")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .unique()

        if (existingHerd) {
            throw new Error("A herd with this name already exists")
        }

        const now = Date.now()
        return await ctx.db.insert("herds", {
            name: args.name,
            slug,
            description: args.description,
            imageId: args.imageId,
            timeline: args.timeline || [],
            createdAt: now,
            updatedAt: now,
        })
    },
})

export const updateHerd = mutation({
    args: {
        id: v.id("herds"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        timeline: v.optional(v.array(v.id("timelineItem"))),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const herd = await ctx.db.get(args.id)
        if (!herd) {
            throw new Error("Herd not found")
        }

        // Build updates object with proper typing
        const updates: Partial<{
            name: string
            slug: string
            description: string | undefined
            imageId: Id<"images"> | undefined
            timeline: Array<Id<"timelineItem">> | undefined
            updatedAt: number
        }> = {
            updatedAt: Date.now(),
        }

        if (args.name !== undefined) {
            // Input validation: name cannot be empty
            if (args.name.trim().length === 0) {
                throw new Error("Herd name cannot be empty")
            }

            const newSlug = generateSlug(args.name)

            // Check if the new slug conflicts with existing herds
            if (newSlug !== herd.slug) {
                const existingHerd = await ctx.db
                    .query("herds")
                    .withIndex("by_slug", (q) => q.eq("slug", newSlug))
                    .unique()

                if (existingHerd && existingHerd._id !== args.id) {
                    throw new Error("A herd with this name already exists")
                }
                updates.slug = newSlug
            }

            updates.name = args.name
        }

        if (args.description !== undefined) {
            updates.description = args.description
        }

        if (args.imageId !== undefined) {
            updates.imageId = args.imageId
        }

        if (args.timeline !== undefined) {
            updates.timeline = args.timeline
        }

        await ctx.db.patch(args.id, updates)
        return null
    },
})

export const deleteHerd = mutation({
    args: { id: v.id("herds") },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Verify herd exists before attempting deletion
        const herd = await ctx.db.get(args.id)
        if (!herd) {
            throw new Error("Herd not found")
        }

        // Security check: Prevent deletion if there are any animals in this herd
        const animalsInHerd = await ctx.db
            .query("animals")
            .withIndex("by_herd", (q) => q.eq("herdId", args.id))
            .first()

        if (animalsInHerd) {
            throw new Error("Cannot delete herd that contains animals. Please reassign or remove animals first.")
        }

        await ctx.db.delete(args.id)
        return null
    },
})

const timelineItemReturnValidator = v.object({
    _id: v.id("timelineItem"),
    _creationTime: v.number(),
    order: v.number(),
    date: v.string(),
    title: v.string(),
    description: v.string(),
    imageId: v.optional(v.id("images")),
    createdAt: v.number(),
    updatedAt: v.number(),
    image: v.optional(v.object({
        _id: v.id("images"),
        fileName: v.string(),
        originalName: v.string(),
        mimeType: v.string(),
        size: v.number(),
        storageId: v.id("_storage"),
        altText: v.optional(v.string()),
        description: v.optional(v.string()),
        isPublic: v.boolean(),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        url: v.string(),
    })),
})

export const getHerdTimeline = query({
    args: { herdId: v.id("herds") },
    handler: async (ctx, args) => {
        const herd = await ctx.db.get(args.herdId)
        if (!herd) {
            throw new Error("Herd not found")
        }

        const timelineIds = herd.timeline || []
        const timelineItems = await Promise.all(
            timelineIds.map((id) => ctx.db.get(id))
        )

        // Filter out any null values (deleted items), add images, and sort by order
        const itemsWithImages = await Promise.all(
            timelineItems
                .filter((item): item is NonNullable<typeof item> => item !== null)
                .map(async (item) => {
                    const image = item.imageId ? await resolveImageId(ctx, item.imageId) : null
                    return {...item, image}
                })
                .filter(x => !!x)
        )

        const sortedItems = itemsWithImages.sort((a, b) => a.order - b.order)
        return sortedItems
    },
})

export const addTimelineItem = mutation({
    args: {
        herdId: v.id("herds"),
        timelineItemId: v.id("timelineItem"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const herd = await ctx.db.get(args.herdId)
        if (!herd) {
            throw new Error("Herd not found")
        }

        const timelineItem = await ctx.db.get(args.timelineItemId)
        if (!timelineItem) {
            throw new Error("Timeline item not found")
        }

        // Check if timeline item is already in the herd
        const currentTimeline = herd.timeline || []
        if (currentTimeline.includes(args.timelineItemId)) {
            throw new Error("Timeline item already exists in this herd")
        }

        await ctx.db.patch(args.herdId, {
            timeline: [...currentTimeline, args.timelineItemId],
            updatedAt: Date.now(),
        })

        return null
    },
})

export const removeTimelineItem = mutation({
    args: {
        herdId: v.id("herds"),
        timelineItemId: v.id("timelineItem"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const herd = await ctx.db.get(args.herdId)
        if (!herd) {
            throw new Error("Herd not found")
        }

        await ctx.db.patch(args.herdId, {
            timeline: (herd.timeline || []).filter((id) => id !== args.timelineItemId),
            updatedAt: Date.now(),
        })

        return null
    },
})
