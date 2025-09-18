import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to upload images");
        }

        return await ctx.storage.generateUploadUrl();
    },
});

export const createImage = mutation({
    args: {
        storageId: v.id("_storage"),
        fileName: v.string(),
        originalName: v.string(),
        mimeType: v.string(),
        size: v.number(),
        altText: v.optional(v.string()),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isPublic: v.optional(v.boolean()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to create image records");
        }

        const imageId = await ctx.db.insert("images", {
            ...args,
            uploadedBy: userId,
            isPublic: args.isPublic ?? true,
            uploadedAt: Date.now(),
        });

        return imageId;
    },
});

export const listImages = query({
    args: {
        limit: v.optional(v.number()),
        publicOnly: v.optional(v.boolean()),
        uploadedBy: v.optional(v.id("users")),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        const limit = args.limit ?? 50;
        const publicOnly = args.publicOnly ?? false;

        let query;

        // Apply filters
        if (publicOnly) {
            query = ctx.db.query("images").withIndex("by_public", (q) => q.eq("isPublic", true));
        } else if (args.uploadedBy) {
            query = ctx.db.query("images").withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", args.uploadedBy!));
        } else if (!userId) {
            // Non-authenticated users can only see public images
            query = ctx.db.query("images").withIndex("by_public", (q) => q.eq("isPublic", true));
        } else {
            // Authenticated users can see all images
            query = ctx.db.query("images");
        }

        const images = await query
            .order("desc")
            .take(limit);

        // Filter by tags if specified
        let filteredImages = images;
        if (args.tags && args.tags.length > 0) {
            filteredImages = images.filter(image =>
                image.tags && image.tags.some(tag => args.tags!.includes(tag))
            );
        }

        // Get storage URLs and uploader info
        const imagesWithUrls = await Promise.all(
            filteredImages.map(async (image) => {
                const url = await ctx.storage.getUrl(image.storageId);
                const uploaderDoc = await ctx.db.get(image.uploadedBy);
                const uploader = uploaderDoc && 'email' in uploaderDoc ? uploaderDoc : null;

                return {
                    ...image,
                    url,
                    uploader: uploader ? {
                        id: uploader._id,
                        email: uploader.email || '',
                        name: uploader.name ?? uploader.email ?? 'Unknown'
                    } : null,
                };
            })
        );

        return imagesWithUrls;
    },
});

export const getImage = query({
    args: { id: v.id("images") },
    handler: async (ctx, args) => {
        const image = await ctx.db.get(args.id);
        if (!image) {
            return null;
        }

        const userId = await getAuthUserId(ctx);

        // Check permissions
        if (!image.isPublic && image.uploadedBy !== userId) {
            throw new Error("Access denied to this image");
        }

        const url = await ctx.storage.getUrl(image.storageId);
        const uploaderDoc = await ctx.db.get(image.uploadedBy);
        const uploader = uploaderDoc && 'email' in uploaderDoc ? uploaderDoc : null;

        return {
            ...image,
            url,
            uploader: uploader ? {
                id: uploader._id,
                email: uploader.email || '',
                name: uploader.name ?? uploader.email ?? 'Unknown'
            } : null,
        };
    },
});

export const updateImage = mutation({
    args: {
        id: v.id("images"),
        altText: v.optional(v.string()),
        description: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        isPublic: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to update images");
        }

        const image = await ctx.db.get(args.id);
        if (!image) {
            throw new Error("Image not found");
        }

        // Check if user is the uploader
        if (image.uploadedBy !== userId) {
            throw new Error("Only the uploader can edit this image");
        }

        const updateData: any = {};
        if (args.altText !== undefined) updateData.altText = args.altText;
        if (args.description !== undefined) updateData.description = args.description;
        if (args.tags !== undefined) updateData.tags = args.tags;
        if (args.isPublic !== undefined) updateData.isPublic = args.isPublic;

        await ctx.db.patch(args.id, updateData);
        return args.id;
    },
});

export const deleteImage = mutation({
    args: {
        id: v.id("images"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Must be authenticated to delete images");
        }

        const image = await ctx.db.get(args.id);
        if (!image) {
            throw new Error("Image not found");
        }

        // Check if user is the uploader
        if (image.uploadedBy !== userId) {
            throw new Error("Only the uploader can delete this image");
        }

        // Delete from storage
        await ctx.storage.delete(image.storageId);

        // Delete from database
        await ctx.db.delete(args.id);

        return { success: true };
    },
});

export const listUserImages = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const limit = args.limit ?? 50;

        const images = await ctx.db
            .query("images")
            .withIndex("by_uploaded_by", (q) => q.eq("uploadedBy", userId))
            .order("desc")
            .take(limit);

        // Get storage URLs
        const imagesWithUrls = await Promise.all(
            images.map(async (image) => {
                const url = await ctx.storage.getUrl(image.storageId);
                return {
                    ...image,
                    url,
                };
            })
        );

        return imagesWithUrls;
    },
});

export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const getImageUrlById = query({
    args: { imageId: v.id("images") },
    handler: async (ctx, args) => {
        const image = await ctx.db.get(args.imageId);
        if (!image) {
            throw new Error("Image not found");
        }
        return await ctx.storage.getUrl(image.storageId);
    },
});

export const searchImages = query({
    args: {
        searchTerm: v.string(),
        limit: v.optional(v.number()),
        publicOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        const limit = args.limit ?? 20;
        const publicOnly = args.publicOnly ?? false;

        // Get all images (with basic filtering)
        let query;

        if (publicOnly || !userId) {
            query = ctx.db.query("images").withIndex("by_public", (q) => q.eq("isPublic", true));
        } else {
            query = ctx.db.query("images");
        }

        const allImages = await query
            .order("desc")
            .take(limit * 3); // Get more to filter

        // Filter by search term
        const searchLower = args.searchTerm.toLowerCase();
        const filteredImages = allImages
            .filter(image => {
                const fileName = image.fileName.toLowerCase();
                const originalName = image.originalName.toLowerCase();
                const altText = (image.altText || "").toLowerCase();
                const description = (image.description || "").toLowerCase();
                const tags = (image.tags || []).join(" ").toLowerCase();

                return (
                    fileName.includes(searchLower) ||
                    originalName.includes(searchLower) ||
                    altText.includes(searchLower) ||
                    description.includes(searchLower) ||
                    tags.includes(searchLower)
                );
            })
            .slice(0, limit);

        // Get storage URLs and uploader info
        const imagesWithUrls = await Promise.all(
            filteredImages.map(async (image) => {
                const url = await ctx.storage.getUrl(image.storageId);
                const uploaderDoc = await ctx.db.get(image.uploadedBy);
                const uploader = uploaderDoc && 'email' in uploaderDoc ? uploaderDoc : null;

                return {
                    ...image,
                    url,
                    uploader: uploader ? {
                        id: uploader._id,
                        email: uploader.email || '',
                        name: uploader.name ?? uploader.email ?? 'Unknown'
                    } : null,
                };
            })
        );

        return imagesWithUrls;
    },
});
