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
