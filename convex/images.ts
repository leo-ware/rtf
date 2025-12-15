import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getCurrentUserOrThrow } from "./users"
import ImageManager, { resolveImageId } from "./models/imageManager"
import { paginationOptsValidator } from "convex/server"
import { imagesAggregate } from "./aggregates"

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
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions");
        }
        const manager = new ImageManager(args.id);
        await manager.update(ctx, args);
        return manager.id;
    },
});

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