import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import { removeUndefinedFields } from "./utils"

const donatePathwayReturnValidator = v.object({
    _id: v.id("donatePathways"),
    _creationTime: v.number(),
    name: v.string(),
    imageId: v.id("images"),
    order: v.number(),
    link: v.optional(v.string()),
    donationFormId: v.optional(v.id("donationForms")),
    showInDialog: v.optional(v.boolean()),
})

const donatePathwayWithImageValidator = v.object({
    _id: v.id("donatePathways"),
    _creationTime: v.number(),
    name: v.string(),
    imageId: v.id("images"),
    order: v.number(),
    link: v.optional(v.string()),
    donationFormId: v.optional(v.id("donationForms")),
    showInDialog: v.optional(v.boolean()),
    image: v.union(
        v.null(),
        v.object({
            url: v.union(v.null(), v.string()),
            altText: v.optional(v.string()),
        }),
    ),
})

export const listDonatePathways = query({
    args: {},
    returns: v.array(donatePathwayWithImageValidator),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const pathways = await ctx.db
            .query("donatePathways")
            .withIndex("by_order")
            .order("asc")
            .collect()

        const pathwaysWithImages = await Promise.all(
            pathways.map(async (pathway) => {
                const image = await ctx.db.get(pathway.imageId)
                let imageUrl: string | null = null
                if (image) {
                    imageUrl = await ctx.storage.getUrl(image.storageId)
                }
                return {
                    ...pathway,
                    image: image
                        ? {
                              url: imageUrl,
                              altText: image.altText,
                          }
                        : null,
                }
            }),
        )

        return pathwaysWithImages
    },
})

export const listPublicDonatePathways = query({
    args: {},
    returns: v.array(donatePathwayWithImageValidator),
    handler: async (ctx) => {
        const pathways = await ctx.db
            .query("donatePathways")
            .withIndex("by_order")
            .order("asc")
            .collect()

        const pathwaysWithImages = await Promise.all(
            pathways.map(async (pathway) => {
                const image = await ctx.db.get(pathway.imageId)
                let imageUrl: string | null = null
                if (image) {
                    imageUrl = await ctx.storage.getUrl(image.storageId)
                }
                return {
                    ...pathway,
                    image: image
                        ? {
                              url: imageUrl,
                              altText: image.altText,
                          }
                        : null,
                }
            }),
        )

        return pathwaysWithImages
    },
})

export const getDonatePathway = query({
    args: {
        id: v.id("donatePathways"),
    },
    returns: v.union(v.null(), donatePathwayReturnValidator),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.get(args.id)
    },
})

export const listDialogPathways = query({
    args: {},
    returns: v.array(v.object({
        _id: v.id("donatePathways"),
        name: v.string(),
        donationFormId: v.id("donationForms"),
    })),
    handler: async (ctx) => {
        const pathways = await ctx.db
            .query("donatePathways")
            .withIndex("by_order")
            .order("asc")
            .collect()

        // Filter: only those with donationFormId AND showInDialog=true
        // Order is preserved from the query
        return pathways
            .filter(p => p.donationFormId && p.showInDialog === true)
            .map(p => ({
                _id: p._id,
                name: p.name,
                donationFormId: p.donationFormId!,
            }))
    },
})

export const getPathwayByName = query({
    args: { name: v.string() },
    returns: v.union(v.null(), v.object({
        _id: v.id("donatePathways"),
        name: v.string(),
        donationFormId: v.id("donationForms"),
    })),
    handler: async (ctx, args) => {
        const pathways = await ctx.db
            .query("donatePathways")
            .withIndex("by_order")
            .order("asc")
            .collect()

        const searchName = args.name.toLowerCase()

        // Filter to valid pathways first
        const validPathways = pathways.filter(p =>
            p.donationFormId && p.showInDialog === true
        )

        // Try exact match first (case-insensitive)
        let match = validPathways.find(p =>
            p.name.toLowerCase() === searchName
        )

        // Fall back to partial match (contains)
        if (!match) {
            match = validPathways.find(p =>
                p.name.toLowerCase().includes(searchName) ||
                searchName.includes(p.name.toLowerCase())
            )
        }

        return match ? {
            _id: match._id,
            name: match.name,
            donationFormId: match.donationFormId!,
        } : null
    },
})

export const createDonatePathway = mutation({
    args: {
        name: v.string(),
        imageId: v.id("images"),
        link: v.optional(v.string()),
        donationFormId: v.optional(v.id("donationForms")),
        showInDialog: v.optional(v.boolean()),
    },
    returns: v.id("donatePathways"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Validate mutual exclusivity
        if (args.link && args.donationFormId) {
            throw new Error("Cannot set both link and donationFormId")
        }
        if (!args.link && !args.donationFormId) {
            throw new Error("Must set either link or donationFormId")
        }

        // showInDialog only valid for donation form pathways
        if (args.showInDialog && !args.donationFormId) {
            throw new Error("showInDialog can only be set for donation form pathways")
        }

        // Get max order
        const existingPathways = await ctx.db
            .query("donatePathways")
            .withIndex("by_order")
            .order("desc")
            .first()

        const newOrder = existingPathways ? existingPathways.order + 1 : 0

        return await ctx.db.insert("donatePathways", {
            name: args.name,
            imageId: args.imageId,
            order: newOrder,
            link: args.link,
            donationFormId: args.donationFormId,
            showInDialog: args.showInDialog,
        })
    },
})

export const updateDonatePathway = mutation({
    args: {
        id: v.id("donatePathways"),
        name: v.optional(v.string()),
        imageId: v.optional(v.id("images")),
        link: v.optional(v.union(v.string(), v.null())),
        donationFormId: v.optional(v.union(v.id("donationForms"), v.null())),
        showInDialog: v.optional(v.union(v.boolean(), v.null())),
    },
    returns: v.id("donatePathways"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        const existing = await ctx.db.get(args.id)
        if (!existing) {
            throw new Error("Donate pathway not found")
        }

        // Determine final values
        const finalLink = args.link !== undefined ? args.link : existing.link
        const finalFormId =
            args.donationFormId !== undefined
                ? args.donationFormId
                : existing.donationFormId

        // Validate mutual exclusivity with final values
        if (finalLink && finalFormId) {
            throw new Error("Cannot set both link and donationFormId")
        }
        if (!finalLink && !finalFormId) {
            throw new Error("Must set either link or donationFormId")
        }

        // Determine final showInDialog value
        const finalShowInDialog = args.showInDialog !== undefined
            ? args.showInDialog
            : existing.showInDialog

        // showInDialog only valid for donation form pathways
        if (finalShowInDialog && !finalFormId) {
            throw new Error("showInDialog can only be set for donation form pathways")
        }

        const updateData = removeUndefinedFields({
            name: args.name,
            imageId: args.imageId,
            link: args.link === null ? undefined : args.link,
            donationFormId:
                args.donationFormId === null ? undefined : args.donationFormId,
            showInDialog:
                args.showInDialog === null ? undefined : args.showInDialog,
        })

        // Handle clearing fields when switching types
        if (args.link !== undefined && args.link !== null) {
            await ctx.db.patch(args.id, {
                ...updateData,
                link: args.link,
                donationFormId: undefined,
                showInDialog: undefined, // Clear showInDialog when switching to link
            })
        } else if (
            args.donationFormId !== undefined &&
            args.donationFormId !== null
        ) {
            await ctx.db.patch(args.id, {
                ...updateData,
                donationFormId: args.donationFormId,
                link: undefined,
            })
        } else {
            await ctx.db.patch(args.id, updateData)
        }

        return args.id
    },
})

export const deleteDonatePathway = mutation({
    args: {
        id: v.id("donatePathways"),
    },
    returns: v.id("donatePathways"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.delete(args.id)
        return args.id
    },
})

export const reorderDonatePathways = mutation({
    args: {
        orderedIds: v.array(v.id("donatePathways")),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        // Update order for each pathway
        await Promise.all(
            args.orderedIds.map(async (id, index) => {
                await ctx.db.patch(id, { order: index })
            }),
        )

        return null
    },
})
