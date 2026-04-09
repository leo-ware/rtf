"use node"

import { v } from "convex/values"
import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import sharp from "sharp"

export const optimizeImage = internalAction({
    args: {
        imageId: v.id("images"),
        storageId: v.id("_storage"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        // Mark as processing
        await ctx.runMutation(internal.imageProcessingHelpers.setProcessingStatus, {
            imageId: args.imageId,
            status: "processing",
        })

        try {
            const url = await ctx.storage.getUrl(args.storageId)
            if (!url) {
                throw new Error("Could not get storage URL for image")
            }

            const response = await fetch(url)
            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Resize (max 2400px long edge) and convert to JPEG
            const optimized = await sharp(buffer)
                .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
                .flatten({ background: "#ffffff" })
                .jpeg({ quality: 82 })
                .toBuffer()

            // Get dimensions of the optimized image
            const metadata = await sharp(optimized).metadata()

            // Upload optimized image to storage
            const newStorageId = await ctx.storage.store(
                new Blob([new Uint8Array(optimized)], { type: "image/jpeg" })
            )

            // Update the image record with new storage ID and metadata
            await ctx.runMutation(internal.imageProcessingHelpers.updateImageAfterOptimization, {
                imageId: args.imageId,
                storageId: newStorageId,
                size: optimized.length,
                width: metadata.width ?? 0,
                height: metadata.height ?? 0,
                mimeType: "image/jpeg",
            })

            // Delete the old storage blob
            await ctx.storage.delete(args.storageId)

            // Generate blur data URL from the already-optimized image
            await ctx.runAction(internal.imageProcessing.generateBlurDataUrl, {
                imageId: args.imageId,
                storageId: newStorageId,
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error"
            await ctx.runMutation(internal.imageProcessingHelpers.setProcessingStatus, {
                imageId: args.imageId,
                status: "failed",
                error: message,
            })
        }

        return null
    },
})

export const generateBlurDataUrl = internalAction({
    args: {
        imageId: v.id("images"),
        storageId: v.id("_storage"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const url = await ctx.storage.getUrl(args.storageId)
        if (!url) return null

        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const blurBuffer = await sharp(buffer)
            .resize(20, null, { withoutEnlargement: true, fit: "inside" })
            .jpeg({ quality: 50 })
            .toBuffer()

        const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`

        await ctx.runMutation(internal.imageProcessingHelpers.saveBlurDataUrl, {
            imageId: args.imageId,
            blurDataUrl,
        })

        return null
    },
})

export const backfillBlurDataUrls = internalAction({
    args: {
        cursor: v.optional(v.string()),
        batchSize: v.optional(v.number()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const result = await ctx.runQuery(internal.imageProcessingHelpers.getImagesWithoutBlur, {
            cursor: args.cursor,
            batchSize: args.batchSize,
        })

        for (const image of result.images) {
            await ctx.runAction(internal.imageProcessing.generateBlurDataUrl, {
                imageId: image._id,
                storageId: image.storageId,
            })
        }

        if (!result.isDone) {
            await ctx.scheduler.runAfter(0, internal.imageProcessing.backfillBlurDataUrls, {
                cursor: result.cursor,
                batchSize: args.batchSize,
            })
        }

        return null
    },
})
