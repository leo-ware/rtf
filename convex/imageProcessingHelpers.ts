import { v } from "convex/values"
import { internalMutation, internalQuery } from "./_generated/server"

export const saveBlurDataUrl = internalMutation({
    args: {
        imageId: v.id("images"),
        blurDataUrl: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await ctx.db.patch(args.imageId, { blurDataUrl: args.blurDataUrl })
        return null
    },
})

export const setProcessingStatus = internalMutation({
    args: {
        imageId: v.id("images"),
        status: v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("failed"),
        ),
        error: v.optional(v.string()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const patch: Record<string, unknown> = { processingStatus: args.status }
        if (args.status === "failed" && args.error) {
            patch.processingError = args.error
        }
        if (args.status === "completed") {
            patch.processedAt = Date.now()
            patch.processingError = undefined
        }
        await ctx.db.patch(args.imageId, patch)
        return null
    },
})

export const updateImageAfterOptimization = internalMutation({
    args: {
        imageId: v.id("images"),
        storageId: v.id("_storage"),
        size: v.number(),
        width: v.number(),
        height: v.number(),
        mimeType: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const { imageId, ...fields } = args
        await ctx.db.patch(imageId, {
            ...fields,
            processingStatus: "completed" as const,
            processedAt: Date.now(),
            processingError: undefined,
        })
        return null
    },
})

export const getUnprocessedImages = internalQuery({
    args: {
        limit: v.optional(v.number()),
    },
    returns: v.array(v.object({
        _id: v.id("images"),
        storageId: v.id("_storage"),
    })),
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10
        const failed = await ctx.db.query("images")
            .withIndex("by_processingStatus", (q) => q.eq("processingStatus", "failed"))
            .take(limit)
        const pending = await ctx.db.query("images")
            .withIndex("by_processingStatus", (q) => q.eq("processingStatus", "pending"))
            .take(limit - failed.length)
        return [...failed, ...pending].map((img) => ({
            _id: img._id,
            storageId: img.storageId,
        }))
    },
})

export const getImagesWithoutBlur = internalQuery({
    args: {
        cursor: v.optional(v.string()),
        batchSize: v.optional(v.number()),
    },
    returns: v.object({
        images: v.array(v.object({
            _id: v.id("images"),
            storageId: v.id("_storage"),
        })),
        cursor: v.union(v.string(), v.null()),
        isDone: v.boolean(),
    }),
    handler: async (ctx, args) => {
        const batchSize = args.batchSize ?? 20
        const result = await ctx.db.query("images")
            .paginate({ numItems: batchSize, cursor: args.cursor ?? null })

        const images = result.page
            .filter(image => !image.blurDataUrl)
            .map(image => ({ _id: image._id, storageId: image.storageId }))

        return {
            images,
            cursor: result.continueCursor,
            isDone: result.isDone,
        }
    },
})
