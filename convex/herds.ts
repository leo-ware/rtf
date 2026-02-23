import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserOrThrow } from "./users"
import { Doc, Id } from "./_generated/dataModel"
import { resolveImageId } from "./images"
import { paginationOptsValidator } from "convex/server"
import { QMCtxType } from "./types"

const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

// Helper function to add image data to herd
const addImageToHerd = async (ctx: QMCtxType, herd: Doc<"herds">) => {
    return {
        ...herd,
        image: herd.imageId && await resolveImageId(ctx, herd.imageId),
    }
}

export const listHerds = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const herds = await ctx.db
            .query("herds")
            .order("desc")
            .paginate(args.paginationOpts)
        
        return {
            ...herds,
            page: await Promise.all(herds.page.map(herd => addImageToHerd(ctx, herd))),
        }
    },
})

export const getHerd = query({
    args: { id: v.id("herds") },
    handler: async (ctx, args) => {
        const herd = await ctx.db.get(args.id)
        if (!herd) return null
        return await addImageToHerd(ctx, herd)
    },
})

export const getHerdByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const herds = await ctx.db.query("herds").collect()
        const herd = herds.find((h) => h.name === args.name) || null
        if (!herd) return null
        return await addImageToHerd(ctx, herd)
    },
})

export const getHerdBySlug = query({
    args: { slug: v.string() },
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
        content: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),
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

        if (args.donationFormId) {
            const donationForm = await ctx.db.get(args.donationFormId)
            if (!donationForm) {
                throw new Error("Donation form not found")
            }
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
            content: args.content || "",
            donationFormId: args.donationFormId,
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
        content: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),
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
            content: string | undefined
            donationFormId: Id<"donationForms"> | undefined
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

        if (args.content !== undefined) {
            updates.content = args.content
        }

        if (args.donationFormId !== undefined) {
            if (args.donationFormId) {
                const donationForm = await ctx.db.get(args.donationFormId)
                if (!donationForm) {
                    throw new Error("Donation form not found")
                }
            }
            updates.donationFormId = args.donationFormId
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

export const listPublicSlugs = query({
    args: {},
    returns: v.array(v.string()),
    handler: async (ctx) => {
        const herds = await ctx.db.query("herds").collect()
        return herds.map((h) => h.slug)
    },
})
