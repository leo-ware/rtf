"use node"

import { v } from "convex/values"
import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"
import sharp from "sharp"

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
