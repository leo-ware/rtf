import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { Id } from "./_generated/dataModel"
import { getCurrentUserOrThrow } from "./users"
import { resolveImageId } from "./images"
import { QMCtxType } from "./types"

// Create an image gallery item
export const createImageGalleryItem = mutation({
    args: {
        imageId: v.id("images"),
    },
    returns: v.id("galleryItems"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.insert("galleryItems", {
            type: "image",
            imageId: args.imageId,
        })
    },
})

// Create a video gallery item
export const createVideoGalleryItem = mutation({
    args: {
        videoSource: v.union(v.literal("youtube"), v.literal("vimeo")),
        videoId: v.string(),
        videoTitle: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
    },
    returns: v.id("galleryItems"),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        return await ctx.db.insert("galleryItems", {
            type: "video",
            videoSource: args.videoSource,
            videoId: args.videoId,
            videoTitle: args.videoTitle,
            thumbnailUrl: args.thumbnailUrl,
        })
    },
})

// Delete a gallery item
export const deleteGalleryItem = mutation({
    args: {
        id: v.id("galleryItems"),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx)
        if (!user.atLeastAuthorized) {
            throw new Error("Insufficient permissions")
        }

        await ctx.db.delete(args.id)
        return null
    },
})

// Get a gallery item by ID
export const getGalleryItem = query({
    args: {
        id: v.id("galleryItems"),
    },
    returns: v.union(
        v.object({
            _id: v.id("galleryItems"),
            _creationTime: v.number(),
            type: v.literal("image"),
            imageId: v.id("images"),
            image: v.union(
                v.object({
                    _id: v.id("images"),
                    url: v.union(v.string(), v.null()),
                    altText: v.optional(v.string()),
                    width: v.optional(v.number()),
                    height: v.optional(v.number()),
                    title: v.string(),
                }),
                v.null()
            ),
        }),
        v.object({
            _id: v.id("galleryItems"),
            _creationTime: v.number(),
            type: v.literal("video"),
            videoSource: v.union(v.literal("youtube"), v.literal("vimeo")),
            videoId: v.string(),
            videoTitle: v.optional(v.string()),
            thumbnailUrl: v.optional(v.string()),
        }),
        v.null()
    ),
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.id)
        if (!item) return null

        if (item.type === "image" && item.imageId) {
            const image = await resolveImageId(ctx, item.imageId)
            return {
                _id: item._id,
                _creationTime: item._creationTime,
                type: "image" as const,
                imageId: item.imageId,
                image: image ? {
                    _id: image._id,
                    url: image.url,
                    altText: image.altText,
                    width: image.width,
                    height: image.height,
                    title: image.title,
                } : null,
            }
        }

        if (item.type === "video" && item.videoSource && item.videoId) {
            return {
                _id: item._id,
                _creationTime: item._creationTime,
                type: "video" as const,
                videoSource: item.videoSource,
                videoId: item.videoId,
                videoTitle: item.videoTitle,
                thumbnailUrl: item.thumbnailUrl,
            }
        }

        return null
    },
})

// Resolve a gallery item (internal helper used by other queries)
export const resolveGalleryItem = async (ctx: QMCtxType, itemId: Id<"galleryItems">) => {
    const item = await ctx.db.get(itemId)
    if (!item) return null

    if (item.type === "image" && item.imageId) {
        const image = await resolveImageId(ctx, item.imageId)
        return {
            _id: item._id,
            _creationTime: item._creationTime,
            type: "image" as const,
            imageId: item.imageId,
            image: image ? {
                _id: image._id,
                url: image.url,
                altText: image.altText,
                width: image.width,
                height: image.height,
                title: image.title,
            } : null,
        }
    }

    if (item.type === "video" && item.videoSource && item.videoId) {
        return {
            _id: item._id,
            _creationTime: item._creationTime,
            type: "video" as const,
            videoSource: item.videoSource,
            videoId: item.videoId,
            videoTitle: item.videoTitle,
            thumbnailUrl: item.thumbnailUrl,
        }
    }

    return null
}

// Get multiple gallery items resolved
export const getGalleryItems = query({
    args: {
        ids: v.array(v.id("galleryItems")),
    },
    handler: async (ctx, args) => {
        const items = await Promise.all(
            args.ids.map(id => resolveGalleryItem(ctx, id))
        )
        return items.filter(item => item !== null)
    },
})
