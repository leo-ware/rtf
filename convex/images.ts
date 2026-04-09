import { v } from "convex/values"
import { query, mutation, internalMutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import ImageManager, { resolveImageId, buildSearchText } from "./models/imageManager"
import { paginationOptsValidator } from "convex/server"
import { imagesAggregate } from "./aggregates"
import { internal } from "./_generated/api"

export { resolveImageId };

export const generateUploadUrl = mutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        return await ImageManager.generateUploadUrl(ctx);
    },
});

export const createImage = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
        originalName: v.string(),
        title: v.string(),
        mimeType: v.string(),
        size: v.number(),
        altText: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        authorCredit: v.optional(v.string()),
        authors: v.optional(v.array(v.id("people"))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = await ImageManager.create(ctx, args)
        const image = await manager.get(ctx)
        if (!image) {
            throw new Error("Error creating image")
        }
        await imagesAggregate.insert(ctx, image)
        await ctx.scheduler.runAfter(0, internal.imageProcessing.optimizeImage, {
            imageId: image._id,
            storageId: args.storageId,
        })
        return image
    },
})

export const listImages = query({
    args: {paginationOpts: paginationOptsValidator},
    handler: async (ctx, args) => {
        return await ImageManager.list(ctx, args);
    },
});

export const searchImagesByTitle = query({
    args: {
        query: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        return await ImageManager.search(ctx, args);
    },
});

export const getImage = query({
    args: { id: v.id("images") },
    handler: async (ctx, args) => {
        const manager = new ImageManager(args.id);
        const image = await manager.get(ctx);
        if (!image) {
            throw new Error("Image not found");
        }
        return image;
    },
});

export const updateImage = mutation({
    args: {
        id: v.id("images"),
        altText: v.optional(v.string()),
        title: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        authorCredit: v.optional(v.string()),
        authors: v.optional(v.array(v.id("people"))),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const { id, ...updateFields } = args;
        const manager = new ImageManager(id);
        await manager.update(ctx, updateFields);
        return manager.id;
    },
});

export const listImagesByAuthors = query({
    args: {
        authorIds: v.array(v.id("people")),
    },
    returns: v.array(v.object({
        _id: v.id("images"),
        _creationTime: v.number(),
        fileName: v.string(),
        originalName: v.string(),
        title: v.string(),
        mimeType: v.string(),
        size: v.number(),
        storageId: v.id("_storage"),
        altText: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        authorCredit: v.optional(v.string()),
        authors: v.optional(v.array(v.id("people"))),
        searchText: v.optional(v.string()),
        blurDataUrl: v.optional(v.string()),
        processingStatus: v.optional(v.union(
            v.literal("pending"),
            v.literal("processing"),
            v.literal("completed"),
            v.literal("failed"),
        )),
        processingError: v.optional(v.string()),
        processedAt: v.optional(v.number()),
        url: v.union(v.string(), v.null()),
        authorNames: v.array(v.string()),
    })),
    handler: async (ctx, args) => {
        if (args.authorIds.length === 0) return []
        const authorIdSet = new Set(args.authorIds.map(id => id.toString()))
        const allImages = await ctx.db.query("images").collect()
        const matched = allImages.filter(image =>
            image.authors?.some(authorId => authorIdSet.has(authorId.toString()))
        )
        const resolved = await Promise.all(
            matched.map(image => resolveImageId(ctx, image._id))
        )
        return resolved.filter((img): img is NonNullable<typeof img> => img !== null)
    },
})

export const deleteImage = mutation({
    args: {
        id: v.id("images"),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }
        const manager = new ImageManager(args.id)
        const image = await manager.get(ctx)
        if (image) {
            await imagesAggregate.delete(ctx, image)
        }
        await manager.delete(ctx)
    },
})

export const backfillSearchText = internalMutation({
    args: {
        cursor: v.optional(v.string()),
        batchSize: v.optional(v.number()),
    },
    returns: v.object({
        updated: v.number(),
        cursor: v.union(v.string(), v.null()),
        isDone: v.boolean(),
    }),
    handler: async (ctx, args) => {
        const batchSize = args.batchSize ?? 100
        const result = await ctx.db.query("images")
            .paginate({ numItems: batchSize, cursor: args.cursor ?? null })
        let updated = 0
        for (const image of result.page) {
            const searchText = await buildSearchText(ctx, {
                title: image.title,
                authors: image.authors,
                authorCredit: image.authorCredit,
            })
            await ctx.db.patch(image._id, { searchText })
            updated++
        }
        return {
            updated,
            cursor: result.continueCursor,
            isDone: result.isDone,
        }
    },
})